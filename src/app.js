import express from "express";
import authRoutes from "./routes/authRoute.js"
import permissionRoutes from "./routes/permission.js"
import roleRoutes from "./routes/roleRoutes.js"
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());   


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message:{
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,   // Include rate limit info in response headers
    legacyHeaders: false,
  }
});
app.use(limiter);
app.use("/api/auth", authRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/roles", roleRoutes);



app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
