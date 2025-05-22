import express from "express";
import { nanoid } from "nanoid";
import connection from "./src/config/mongoose.config.js";
import analytics from "./src/middleware/analytics.js";
import shortUrlRoute from "./src/routes/shortUrlCreation.route.js";
import urlRedirectionRoute from "./src/routes/urlRedirection.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Test random nanoid
app.get("/random", (req, res) => {
  const randomNumber = nanoid(6);
  res.json({ random: randomNumber });
});

app.use("/api/short", shortUrlRoute);
app.use("/", urlRedirectionRoute);

app.get("/:shortId", analytics, async (req, res) => {
  const { originalUrl } = req.originalUrlData;
  console.log(`Redirecting to: ${originalUrl}`);
  res.redirect(originalUrl);
});

app.listen(3000, () => {
  connection();
  console.log("Server is running on port 3000");
});
