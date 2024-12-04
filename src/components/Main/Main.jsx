import React, { useContext, useRef, useState } from "react";
import { Context } from "../../context/Context";
import "./Main.css";
import { assets } from "../../assets/assets";

const Main = () => {
  const {
    input,
    setInput,
    recentPrompt,
    setRecentPrompt,
    onSent,
    showResult,
    loading,
    resultData,
    handleFileUpload,
    uploadedFile,
    setUploadedFile,
    stopGenerating, // Add stopGenerating from context
  } = useContext(Context);

  // Create a ref for the file input
  const fileInputRef = useRef(null);

  // State to manage drag over
  const [isDragOver, setIsDragOver] = useState(false);

  // Function to trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Drag and Drop Event Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      fileInputRef.current.files = files;
      handleFileUpload({ target: fileInputRef.current });
    }
  };

  // Remove file function
  const removeFile = () => {
    fileInputRef.current.value = "";
    setUploadedFile(null);
  };

  // handling cards input

  const handleCardClick = (promptText) => {
    setInput(promptText);
  };

  return (
    <div
      className="main"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
        accept=".jpg,.jpeg,.png,.gif,.pdf,.txt,.csv,.xlsx"
      />

      <div className="nav">
        <img src={assets.gemini_icon} alt="" />
        <p id="Makhs-AI">Makhs-Ai</p>
        <img src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">
        {/* Drag and Drop Overlay */}
        {isDragOver && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
            }}
          >
            Drop files here
          </div>
        )}

        {!showResult && (
          <>
            <div className="greet">
              <p>
                <span>Hola Mamacita.</span>{" "}
              </p>
              <p>How can I assist you today?</p>
            </div>
            <div className="cards">
              <div
                className="card"
                onClick={() =>
                  handleCardClick("Suggest a new restaurant for me to try.")
                }
              >
                <p>Suggest a new restaurant for me to try.</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() =>
                  handleCardClick("Brain storm ideas for a dinner party menu.")
                }
              >
                <p>Brain storm ideas for a dinner party menu.</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() =>
                  handleCardClick("Reccomend me a movie to watch.")
                }
              >
                <p>Reccomend me a movie to watch.</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() =>
                  handleCardClick(
                    "Help me optimize my code to improve readability."
                  )
                }
              >
                <p>Help me optimize my code to improve readability.</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        )}

        {showResult && (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
              <div className="result-content">
                {loading ? (
                  <div className="loading">
                    <div className="typing-indicator">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                  </div>
                ) : (
                  <p dangerouslySetInnerHTML={{ __html: resultData }} />
                )}
              </div>
            </div>
          </div>
        )}

        <div className="main-bottom">
          {/* File Preview Section */}
          {uploadedFile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                backgroundColor: "#f0f0f0",
                borderRadius: "5px",
                margin: "10px 0",
              }}
            >
              <span style={{ marginRight: "10px" }}>{uploadedFile.name}</span>
              <button
                onClick={removeFile}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          )}

          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter your query here..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  onSent(input);
                }
              }}
            />
            <div>
              <img
                src={assets.gallery_icon}
                alt="Upload"
                onClick={triggerFileInput}
                style={{ cursor: "pointer" }}
              />
              <img src={assets.mic_icon} alt="" />
              {input ? (
                <img
                  onClick={() => input.trim() && onSent(input)}
                  src={assets.send_icon}
                  alt=""
                  style={{ cursor: "pointer" }}
                />
              ) : null}
              {/* Add stop generation button */}
              {loading && (
                <button
                  onClick={stopGenerating}
                  style={{
                    background: "#ff4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    marginLeft: "10px",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "background 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  onMouseOver={(e) => e.target.style.background = "#ff2222"}
                  onMouseOut={(e) => e.target.style.background = "#ff4444"}
                >
                  <span style={{ display: "inline-flex", alignItems: "center" }}>
                    ⏹️ Stop
                  </span>
                </button>
              )}
            </div>
          </div>          <p className="bottom-info">
            The AI may display inaccurate info including about people so
            double-check its responses
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
