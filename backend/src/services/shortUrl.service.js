import { generateNanoId } from "../utils/helper.js";
import urlSchema from "../models/urlShortenerSchema.js";

export const createShort = async (url) => {    
    const existing = await urlSchema.findOne({ originalUrl: url }).select("shortUrl");
    if (existing) {
        return existing.shortUrl;
    }
    const shortUrl = generateNanoId(6);
    const newUrl = new urlSchema({
      originalUrl: url,
      shortUrl,
    });
    await newUrl.save();
    return shortUrl;
};