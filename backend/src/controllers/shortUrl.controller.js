import { sendBadRequest, sendServerError } from "../utils/helper.js";
import { validateUrl } from "../services/urlValidator.service.js";
import { createShort } from "../services/shortUrl.service.js";

export const createShortUrl =  async (req, res) => {
  let { url } = req.body;

  const result = validateUrl(url);
  if (result.error) {
    return sendBadRequest(res, result.error);
  }
  url = result.url;

  try {
    const shortUrl = await createShort(url);
    res.json({ shortUrl, originalUrl: url });
  } catch (err) {
    console.error("Error saving URL:", err);
    return sendServerError(res, "Error saving URL");
  }
}