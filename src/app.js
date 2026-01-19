// const express = require("express");
// const rateLimiter = require("./middleware/rate-limiter");
// const v1Routes = require("./routes/v1/routes");

// const app = express();

// app.use(express.json());
// app.use(rateLimiter);

// app.use("/api/v1", v1Routes);

// app.use((err, req, res, next) => {
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Server Error"
//   });
// });

// module.exports = app;

const express = require("express");
const cors = require("cors");
const rateLimiter = require("./middleware/rate-limiter");
const routes = require("./routes/v1/route");

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use("/api/v1", routes);
// console.log("V1 ROUTES MOUNTED");

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message
  });
});

module.exports = app;
