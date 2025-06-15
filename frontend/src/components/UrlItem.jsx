import { useState } from "react";
import { CopyButton } from "./CopyButton";

const UrlItem = ({ url, shortUrl, timestamp, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="url-item">
      <div className="url-item-main">
        <div className="url-item-content">
          <div className="short-url">
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl.replace(/^https?:\/\//, '')}
            </a>
          </div>
          <div className="original-url" title={url}>
            {url.length > 40 ? `${url.substring(0, 40)}...` : url}
          </div>
        </div>
        <div className="url-item-actions">
          <CopyButton text={shortUrl} />
          <button 
            className="details-btn"
            onClick={() => setShowDetails(!showDetails)}
            aria-label={showDetails ? "Hide details" : "Show details"}
          >
            {showDetails ? "Less" : "More"}
          </button>
          <button 
            className="delete-btn" 
            onClick={() => onDelete(shortUrl)}
            aria-label="Delete URL"
          >
            Delete
          </button>
        </div>
      </div>
      {showDetails && (
        <div className="url-item-details">
          <div className="details-row">
            <span className="details-label">Created:</span>
            <span className="details-value">{new Date(timestamp).toLocaleString()}</span>
          </div>
          <div className="details-row">
            <span className="details-label">Original URL: </span>
            <span className="details-value full-url"> {url}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlItem;
