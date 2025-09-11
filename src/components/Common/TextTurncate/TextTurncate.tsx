import React, { useState } from "react";

const TextTruncator = ({ textContent }: any) => {
  const [showFullText, setShowFullText] = useState(false);

  const handleReadToggle = () => {
    setShowFullText(!showFullText);
  };

  // Sample text data

  return (
    <div className="pujadetails-data--description">
      <span>
        <p
          style={styles.text}
          dangerouslySetInnerHTML={{
            __html: showFullText
              ? textContent
              : `${textContent.slice(0, 100)}...`,
          }}
        />
        {textContent.length > 100 && (
          <span style={styles.seeMore} onClick={handleReadToggle}>
            {showFullText ? " See Less" : " See More"}
          </span>
        )}
      </span>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
  },
  title: {
    textAlign: "center",
    color: "#2c3e50",
    marginBottom: "30px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "30px",
  },
  cardTitle: {
    color: "#2c3e50",
    marginBottom: "15px",
  },
  textContainer: {
    lineHeight: "1.6",
  },
  text: {
    display: "inline",
    margin: 0,
  },
  seeMore: {
    color: "#3498db",
    cursor: "pointer",
    fontWeight: "600",
  },
  codeContainer: {
    backgroundColor: "#2c3e50",
    color: "#ecf0f1",
    borderRadius: "8px",
    padding: "20px",
    overflowX: "auto",
  },
  codeTitle: {
    marginBottom: "15px",
  },
  code: {
    whiteSpace: "pre-wrap",
    lineHeight: "1.5",
  },
};

export default TextTruncator;
