export const UrlService = {
  API_BASE: "http://localhost:3000/api/short",
  BASE_URL: "http://localhost:3000",

  getStoredUrls() {
    const storedUrls = localStorage.getItem("urlHistory");
    return storedUrls ? JSON.parse(storedUrls) : [];
  },

  saveUrlToHistory(originalUrl, shortUrl) {
    const urlHistory = this.getStoredUrls();
    const timestamp = new Date().toISOString();
    
    // Check if URL already exists to prevent duplicates
    const urlExists = urlHistory.some(item => item.shortUrl === shortUrl);
    
    if (!urlExists) {
      // Add new URL to the beginning of the array
      urlHistory.unshift({
        originalUrl,
        shortUrl: `${this.BASE_URL}/${shortUrl}`,
        timestamp
      });
      
      // Limit history to last 10 items
      const limitedHistory = urlHistory.slice(0, 10);
      localStorage.setItem("urlHistory", JSON.stringify(limitedHistory));
    }
  },

  deleteUrlFromHistory(shortUrl) {
    let urlHistory = this.getStoredUrls();
    urlHistory = urlHistory.filter(item => item.shortUrl !== shortUrl);
    localStorage.setItem("urlHistory", JSON.stringify(urlHistory));
    return urlHistory;
  },

  clearHistory() {
    localStorage.removeItem("urlHistory");
    return [];
  }
};

export default UrlService;
