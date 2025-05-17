import express from "express";
import { nanoid } from "nanoid";
import validator from "validator";
import connection from "./src/config/mongoose.config.js";
import urlSchema from "./src/models/urlShortenerSchema.js";

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

// Shorten URL route
app.post("/api/short", async (req, res) => {
  let { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  // Normalize: prepend https:// if missing
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  // Validate the URL
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

// Redirect short URL to original
app.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;
  try {
    const urlData = await urlSchema.findOne({ shortUrl: shortId });
    if (!urlData) {
      return res.status(404).json({ error: "URL not found" });
    }
    urlData.clicks += 1;
    await urlData.save();
    console.log(`Redirecting to: ${urlData.originalUrl}`);
    res.redirect(urlData.originalUrl);
  } catch (err) {
    console.error("Error fetching URL:", err);
    return res.status(500).json({ error: "Error fetching URL" });
  }
});

// Start server and connect to DB
app.listen(3000, () => {
  connection();
  console.log("Server is running on port 3000");
});
