import React, { useContext, useRef, useState, useEffect } from "react";
import { Context } from "../../context/Context";
import "./Main.css";
import { assets } from "../../assets/assets";

const Main = () => {
  const {
    input,
    setInput,
    loading,
    resultData,
    showResult,
    onSent,
    handleFileUpload,
    uploadedFile,
    stopGenerating,
    recentPrompt,
    currentSessionId
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
    setInput('');  // Clear the input first
    setTimeout(() => {
        setInput(promptText);
        // Add animation class
        const inputElement = document.querySelector('.search-box input');
        inputElement.classList.add('animate-text');
        // Remove animation class after animation ends
        setTimeout(() => {
            inputElement.classList.remove('animate-text');
        }, 300);
    }, 50);
  };

  const ResultContent = ({ text, isNewResponse = false }) => {
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const createMarkup = (htmlContent) => {
        return { __html: htmlContent };
    };

    useEffect(() => {
        if (text) {
            if (isNewResponse) {
                // Animate only for new AI responses
                setIsTyping(true);
                let index = 0;
                setDisplayText('');

                const typeNextCharacter = () => {
                    if (index < text.length) {
                        setDisplayText(current => current + text.charAt(index));
                        index++;
                        const randomDelay = Math.floor(Math.random() * 20) + 10;
                        setTimeout(typeNextCharacter, randomDelay);
                    } else {
                        setIsTyping(false);
                    }
                };

                typeNextCharacter();
            } else {
                // Instantly show text for recent chats
                setDisplayText(text);
                setIsTyping(false);
            }
        }
    }, [text, isNewResponse]);

    return (
        <div className="result-content">
            <p 
                className={`typing-text ${isTyping ? 'typing' : ''}`}
                dangerouslySetInnerHTML={createMarkup(displayText)}
            />
        </div>
    );
  };

  // Add this state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className={`main ${isSidebarOpen ? 'sidebar-open' : ''}`}
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
              {loading ? (
                <div className="loading">
                  <div className="typing-indicator">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              ) : (
                <ResultContent 
                  text={resultData} 
                  isNewResponse={loading}
                />
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          {/* File Preview Section */}
          {uploadedFile && (
            <div
              className="uploaded-file-preview"
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
                  className="stop-button"
                >
                  <span>Stop</span>
                </button>
              )}
            </div>
          </div>          
          <p className="bottom-info">
            The AI may display inaccurate info including about people so
            double-check its responses
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
