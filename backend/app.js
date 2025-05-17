import express from "express";
import { nanoid } from "nanoid";
import validator from "validator";
import connection from "./src/config/mongoose.config.js";
import urlSchema from "./src/models/urlShortenerSchema.js";
import analytics from "./src/middleware/analytics.js";

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

app.post("/api/short", async (req, res) => {
  let { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  if (!validator.isURL(url, { require_protocol: true })) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  try {
    const shortUrl = nanoid(6);
    const newUrl = new urlSchema({
      originalUrl: url,
      shortUrl,
    });

    await newUrl.save();
    res.json({ shortUrl, originalUrl: url });
  } catch (err) {
    console.error("Error saving URL:", err);
    return res.status(500).json({ error: "Error saving URL" });
  }
});

app.get("/:shortId", analytics, async (req, res) => {
  const { originalUrl } = req.originalUrlData;
  console.log(`Redirecting to: ${originalUrl}`);
  res.redirect(originalUrl);
});

app.listen(3000, () => {
  connection();
  console.log("Server is running on port 3000");
});
