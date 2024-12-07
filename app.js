import hpp from "hpp";
import xss from "xss";
import cors from "cors";
import helmet from "helmet";
import express from "express";
import { rateLimit } from "express-rate-limit";

import blogsRoute from "./routes/blogsRoute";
import * as bodyParser from "express";

const app = express();

// Parsing JSON
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

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
app.use(xss());

// Prevent parameter pollution
app.use(hpp({}));

// Routes
app.use("/api/v1/blogs", blogsRoute);

// Serving Images
app.use("/uploads", express.static("uploads"));

// Global Catch Handler
app.use("*", function (req, res) {
  res.status(404).json({
    error: "Not Found",
    msg: "Route is not found",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
