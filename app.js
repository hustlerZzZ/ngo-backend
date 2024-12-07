import hpp from "hpp";
import xss from "xss";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import express from "express";
import { rateLimit } from "express-rate-limit";
import * as bodyParser from "express";

import blogsRoute from "./routes/blogsRoute.js";
import adminRoute from "./routes/adminRoute.js";

const envFile = `.env`;
dotenv.config({path: envFile});

const app = express();

// Parsing JSON
app.use(express.json({ limit: "10kb" }));

app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Allowing cors
app.use(cors());

// Adding rate limit
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 100, // Limit each IP to requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

// Adding security headers in the request
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Data sanitization against XSS
app.use((req, res, next) => {
  const sanitize = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = xss(obj[key]);
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
});

// Prevent parameter pollution
app.use(hpp({
  whitelist: ["id"]
}));

// Routes
app.use("/api/v1/blogs", blogsRoute);
app.use("/api/v1/admin", adminRoute);

// Serving Images
app.use("/uploads", express.static("uploads"));

// Global Catch Handler
app.all("*", function (req, res) {
  res.status(404).json({
    error: "Not Found",
    msg: `Can't find ${req.originalUrl} on this server!`,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
