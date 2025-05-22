import urlSchema from "../models/urlShortenerSchema.js";

const analytics = async (req, res, next) => {
  const { shortId } = req.params;

  try {
    const urlData = await urlSchema.findOne({ shortUrl: shortId });

    if (!urlData) {
      return res.status(404).json({ error: "URL not found" });
    }

    urlData.clicks += 1;
    await urlData.save();
    req.originalUrlData = urlData;
    next();
  } catch (err) {
    console.error("Error tracking clicks:", err);
    return res.status(500).json({ error: "Error tracking clicks" });
  }
};

export default analytics;
