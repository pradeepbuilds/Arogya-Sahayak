const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const apiLimiter = require("./middleware/rateLimit.middleware");

const authRoutes = require("./routes/auth.routes");
const workerRoutes = require("./routes/worker.routes");
const adminRoutes = require("./routes/admin.routes");
const publicRoutes = require("./routes/public.routes");
const healthRoutes = require("./routes/health.routes");
const notificationRoutes = require("./routes/notification.routes");
const schemeRoutes = require("./routes/scheme.routes");

const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api", apiLimiter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Arogya Sahayak API Running",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/workers", workerRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/public", publicRoutes);
app.use("/api/v1/health-records", healthRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/schemes", schemeRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

app.use(errorMiddleware);

module.exports = app;