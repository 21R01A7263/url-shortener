import validator from "validator";

export function validateUrl(url) {
  if (!url) {
    return { error: "URL is required" };
  }
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  
  try {
    const parsed = new URL(url);
    if (
      !parsed.hostname.startsWith("www.") &&
      /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(parsed.hostname)
    ) {
      parsed.hostname = "www." + parsed.hostname;
      url = parsed.toString();
    }
  } catch (e) {
    return { error: "Invalid URL format" };
  }
  if (!validator.isURL(url, { require_protocol: true })) {
    return { error: "Invalid URL format" };
  }
  return { url };
}