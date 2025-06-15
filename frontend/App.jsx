import React, { useState, useEffect } from "react";
import axios from "axios";
import CopyButton from "./src/components/CopyButton";
import UrlItem from "./src/components/UrlItem";
import { UrlService } from "./src/services/UrlService";
import "./src/styles.css";

export default function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlHistory, setUrlHistory] = useState([]);

  useEffect(() => {
    // Load URL history from localStorage on component mount
    const storedUrls = UrlService.getStoredUrls();
    setUrlHistory(storedUrls);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setLoading(true);
    
    try {
      const res = await axios.post(UrlService.API_BASE, { url });
      const shortUrlCode = res.data.shortUrl;
      const fullShortUrl = `${UrlService.BASE_URL}/${shortUrlCode}`;
      
      setShortUrl(fullShortUrl);
      
      // Save to localStorage
      UrlService.saveUrlToHistory(url, shortUrlCode);
      
      // Update URL history state
      setUrlHistory(UrlService.getStoredUrls());
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearInput = () => {
    setUrl("");
    setShortUrl("");
    setError("");
  };

  const handleDeleteUrl = (shortUrl) => {
    const updatedHistory = UrlService.deleteUrlFromHistory(shortUrl);
    setUrlHistory(updatedHistory);
  };

  const handleClearHistory = () => {
    const emptyHistory = UrlService.clearHistory();
    setUrlHistory(emptyHistory);
  };

  return (
    <div className="app-container">
      <div className="container">
        <header>
          <h1 className="app-title">URL Shortener</h1>
          <p className="app-subtitle">
            Transform long, unwieldy links into clean, memorable and trackable URLs
          </p>
        </header>

        <main>
          <div className="card">
            <div className="form-container">
              <form className="url-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <div className="input-group">
                    <input
                      className="url-input"
                      type="text"
                      placeholder="Enter a long URL to make it short..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                    {url && (
                      <button
                        type="button"
                        className="clear-input"
                        onClick={handleClearInput}
                        aria-label="Clear input"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Shortening...
                    </>
                  ) : (
                    "Shorten URL"
                  )}
                </button>
              </form>

              {(shortUrl || error) && (
                <div className="result-container">
                  {shortUrl && (
                    <div className="result-box success">
                      <div className="result-content">
                        <span className="result-label">Your shortened URL:</span>
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="result-link"
                        >
                          {shortUrl}
                        </a>
                      </div>
                      <CopyButton text={shortUrl} />
                    </div>
                  )}

                  {error && (
                    <div className="result-box error">
                      <div className="result-content">
                        <span className="result-label">Error:</span>
                        <span className="result-error">{error}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <section className="history-section">
            <div className="history-header">
              <h2 className="history-title">Your shortened URLs</h2>
              {urlHistory.length > 0 && (
                <button
                  className="clear-history-btn"
                  onClick={handleClearHistory}
                >
                  Clear History
                </button>
              )}
            </div>

            <div className="url-list">
              {urlHistory.length > 0 ? (
                urlHistory.map((item, index) => (
                  <UrlItem
                    key={index}
                    url={item.originalUrl}
                    shortUrl={item.shortUrl}
                    timestamp={item.timestamp}
                    onDelete={handleDeleteUrl}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <p>You haven't created any short URLs yet</p>
                </div>
              )}
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} URL Shortener - All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
