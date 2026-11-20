const sendSuccess = (
  res,
  data = null,
  message = "Success",
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    success: true, // frontends can check this flag
    message, // short text, e.g. "Product created"
    data, // the actual result (object, array or null)
  });
};

// Sends a list with page information, used for tables like products and orders
const sendPaginated = (res, items, page, limit, total, message = "Success") => {
  return res.status(200).json({
    success: true,
    message,
    data: items, // the records for this page only
    pagination: {
      page, // current page number
      limit, // records per page
      total, // total records in the database
      totalPages: Math.ceil(total / limit), // round up so a partial last page counts
    },
  });
};

// Usage later: sendSuccess(res, product, 'Product created', 201);
module.exports = { sendSuccess, sendPaginated };
