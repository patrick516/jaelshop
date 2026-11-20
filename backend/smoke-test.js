// Run with: node smoke-test.js   (the API must be running on port 5000)
const BASE = "http://localhost:5000/api";
let passed = 0; // how many checks passed
let failed = 0; // how many checks failed

// Sends one request and returns { status, body }. token is optional
const call = async (method, path, body, token) => {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // adds the login header only when a token is given
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: await res.json() };
};

// Prints one PASS or FAIL line and counts it. info explains a failure
const check = (name, ok, info = "") => {
  if (ok) passed++;
  else failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : "  -> " + info}`);
};

// Reads the public stock of the first A4 Notebook variant
const stockOf = async () => {
  const { body } = await call("GET", "/products/slug/a4-notebook");
  const v = body.data.variants.find((x) => x.sku === "A4-NOTEBOOK-1");
  return { variantId: v.id, quantity: v.inventory.quantity };
};

const main = async () => {
  const stamp = Date.now(); // makes the test customer email different on every run
  const shipping = {
    shippingName: "Smoke Test",
    shippingPhone: "0888000000",
    shippingDistrict: "Blantyre",
    shippingArea: "Madulira",
  };

  // ---------- Public ----------
  let r = await call("GET", "/health");
  check("health", r.status === 200, r.status);
  r = await call("GET", "/categories");
  check(
    "4 categories",
    r.body.data?.length >= 4,
    JSON.stringify(r.body).slice(0, 100),
  );
  r = await call("GET", "/products");
  check(
    "public products hide costPrice",
    r.status === 200 &&
      r.body.data.length > 0 &&
      !("costPrice" in r.body.data[0]),
    r.status,
  );
  r = await call("GET", "/settings");
  check(
    "WhatsApp number is set",
    Boolean(r.body.data?.whatsappNumber),
    "set it with PUT /api/settings",
  );

  // ---------- Logins ----------
  r = await call("POST", "/auth/staff/login", {
    email: "patrick@jael.mw",
    password: "Admin@12345",
  });
  check("staff login", r.status === 200, r.status);
  const staff = r.body.data?.token;
  r = await call("GET", "/auth/me");
  check("no token is rejected", r.status === 401, r.status);
  r = await call("POST", "/auth/register", {
    firstName: "Smoke",
    lastName: "Test",
    email: `smoke${stamp}@test.com`,
    password: "Smoke12345",
  });
  check("customer register", r.status === 201, r.status);
  const customer = r.body.data?.token;
  r = await call("GET", "/orders", null, customer);
  check("customer blocked from staff orders", r.status === 403, r.status);

  // ---------- Orders and stock ----------
  const before = await stockOf();
  const item = { items: [{ variantId: before.variantId, quantity: 1 }] };
  r = await call(
    "POST",
    "/orders",
    {
      ...item,
      ...shipping,
      paymentMethod: "AIRTEL_MONEY",
      paymentPhone: "0888000000",
    },
    customer,
  );
  check("customer order placed", r.status === 201, r.status);
  const orderA = r.body.data?.id;
  const o = r.body.data;
  check(
    "total = subtotal + delivery",
    Number(o?.total) === Number(o?.subtotal) + Number(o?.deliveryFee),
    JSON.stringify(o?.total),
  );
  r = await call("POST", "/orders/whatsapp", { ...item, ...shipping }); // guest, no token
  check(
    "guest order returns WhatsApp link",
    r.status === 201 && r.body.data?.whatsappUrl?.startsWith("https://wa.me/"),
    r.status,
  );
  const orderB = r.body.data?.id;
  const after = await stockOf();
  check(
    "stock reduced by 2",
    after.quantity === before.quantity - 2,
    `${before.quantity} -> ${after.quantity}`,
  );
  r = await call(
    "POST",
    "/orders",
    { items: [{ variantId: before.variantId, quantity: 99999 }], ...shipping },
    customer,
  );
  check("overselling is blocked", r.status === 409, r.status);

  // ---------- Staff and customer views ----------
  r = await call("GET", "/orders", null, staff);
  check(
    "staff lists orders",
    r.status === 200 && r.body.pagination?.total >= 2,
    r.status,
  );
  r = await call("GET", `/orders/${orderB}/whatsapp`, null, staff);
  check(
    "customer WhatsApp link",
    Boolean(r.body.data?.url?.includes("wa.me")),
    r.status,
  );
  r = await call("GET", "/orders/mine", null, customer);
  check("My Orders shows 1 order", r.body.data?.length === 1, r.status);

  // ---------- Dashboard and reports ----------
  r = await call("GET", "/dashboard?days=30", null, staff);
  check(
    "dashboard counts orders",
    r.status === 200 && r.body.data?.cards?.orders?.value >= 2,
    JSON.stringify(r.body.data?.cards?.orders),
  );
  check(
    "dashboard top categories",
    r.body.data?.topCategories?.length > 0,
    "empty",
  );
  r = await call("GET", "/reports/sales?group=month", null, staff);
  check(
    "report: sales by month",
    r.body.data?.totalOrders >= 2,
    JSON.stringify(r.body.data?.totalOrders),
  );
  r = await call("GET", "/reports/top-products", null, staff);
  check(
    "report: top products",
    Boolean(r.body.data?.rows?.some((x) => x.name === "A4 Notebook")),
    "empty",
  );
  r = await call("GET", "/reports/payments", null, staff);
  check("report: payments", r.body.data?.rows?.length > 0, "empty");
  r = await call("GET", "/reports/stock", null, staff);
  check("report: stock value", r.body.data?.units > 0, "empty");

  // ---------- Cancel both test orders: stock must come back ----------
  for (const id of [orderA, orderB])
    await call("PATCH", `/orders/${id}/status`, { status: "CANCELLED" }, staff);
  const end = await stockOf();
  check(
    "cancelling restores stock",
    end.quantity === before.quantity,
    `${before.quantity} -> ${end.quantity}`,
  );

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0); // a non-zero exit code signals failure
};

main().catch((e) => {
  console.error("Smoke test crashed:", e.message);
  process.exit(1);
});
