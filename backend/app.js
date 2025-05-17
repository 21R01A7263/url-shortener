import express from "express";
import { nanoid } from "nanoid";
import connection from "./src/config/mongoose.config.js";
import urlSchema from "./src/models/urlShortenerSchema.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/random", (req, res) => {
  const randomNumber = nanoid(6);
  res.json({ random: randomNumber });
});

app.post("/api/short", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
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

app.listen(3000, () => {
  connection();
  console.log("Server is running on port 3000");
});
