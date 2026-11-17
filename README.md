# JAEL ENTERPRISE

**Kugulitsa stationery, office equipment, electronics, and clothing.**

A mobile-first e-commerce website and customer portal for JAEL ENTERPRISE, built for Malawian shoppers: prices in MWK, Mobile Money payments, and WhatsApp ordering.

---

## Project Structure

```
jaelshopp/
├── storefront/   # Customer-facing website (mobile-first)
├── admin/        # Admin dashboard (products, orders, customers)
└── backend/      # API, database, authentication, payments
```

| Folder       | Purpose                                                                |
| ------------ | ---------------------------------------------------------------------- |
| `storefront` | Public shop and customer portal: browse, cart, checkout, account       |
| `admin`      | Staff dashboard: manage products, categories, stock, orders, customers |
| `backend`    | REST API, database models, auth, order and payment logic               |

---

## Features

### Storefront (Mobile First)

- **Home**: logo, search, cart and WhatsApp icons; hero banner; 4 category cards; featured / best sellers; sticky bottom navigation
- **Categories / Shop**: filter chips, 2-column product grid, price and "Add" button on every card
- **Product Detail**: image gallery, price in MWK, size/colour selectors (clothing), **Add to Cart** and **Order via WhatsApp** buttons, delivery and Mobile Money note
- **Cart & Checkout**: item list, subtotal + delivery, Mobile Money or Cash on Delivery, large **Place Order** button
- **Customer Portal**: My Orders (with status), Wishlist, Profile and Addresses

### Admin Dashboard

- Add, edit, and remove products and categories
- Upload product images, set prices (MWK), and manage stock
- View and update order status (Pending, Confirmed, Out for Delivery, Delivered, Cancelled)
- Manage customers

### Local Features

- Prices in **MWK**
- Big **WhatsApp** buttons for quick ordering
- **Airtel Money** and **TNM Mpamba** payment options
- **Cash on Delivery**

---

## Product Categories

1. Stationery
2. Office Equipment
3. Electronics
4. Clothing

---

## Brand & Design

| Item       | Value                                          |
| ---------- | ---------------------------------------------- |
| Primary    | Deep Navy `#0A2540`                            |
| Accent     | Warm Orange `#F97316`                          |
| WhatsApp   | Green `#25D366`                                |
| Background | Soft white / light grey                        |
| Feel       | Clean, professional, trustworthy, yet friendly |

Design approach: **mobile first**, then tablet and desktop.

---

## Tech Stack

> Fill in once decided.

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Storefront | _e.g. Next.js / React / Vue_                |
| Admin      | _e.g. React Admin / Next.js_                |
| Backend    | _e.g. Node.js (Express) / Django / Laravel_ |
| Database   | _e.g. PostgreSQL / MongoDB / MySQL_         |
| Payments   | Airtel Money, TNM Mpamba (via provider API) |
| Hosting    | _TBD_                                       |

---

## Getting Started

### Prerequisites

- Git
- Node.js 18+ and npm (adjust if you use another stack)
- A database (see Tech Stack)

### 1. Clone the repository

```bash
git clone <your-repo-url> jaelshopp
cd jaelshopp
```

### 2. Backend

```bash
cd backend
cp .env.example .env     # then edit values
npm install
npm run dev
```

### 3. Storefront

```bash
cd storefront
cp .env.example .env
npm install
npm run dev
```

### 4. Admin

```bash
cd admin
cp .env.example .env
npm install
npm run dev
```

---

## Environment Variables

Example `backend/.env`:

```env
PORT=5000
DATABASE_URL=
JWT_SECRET=
WHATSAPP_NUMBER=+265XXXXXXXXX
AIRTEL_MONEY_API_KEY=
TNM_MPAMBA_API_KEY=
```

Example `storefront/.env`:

```env
API_URL=http://localhost:5000
WHATSAPP_NUMBER=+265XXXXXXXXX
```

> Never commit real `.env` files or secrets to Git.

---

## Roadmap

- [ ] Finalize UI mockups (Home, Shop, Product, Cart, Account)
- [ ] Set up backend API and database
- [ ] Build storefront (mobile first)
- [ ] Build admin dashboard
- [ ] Integrate Airtel Money and TNM Mpamba
- [ ] WhatsApp order integration
- [ ] Order tracking and notifications
- [ ] Desktop / tablet layouts
- [ ] Deployment

---

## Contributing

1. Create a branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m "Add your feature"`
3. Push: `git push origin feature/your-feature`
4. Open a Pull Request

---

## Contact

**JAEL ENTERPRISE**
WhatsApp: `+265 XXX XXX XXX`
Location: Malawi

---

## License

_To be decided._
