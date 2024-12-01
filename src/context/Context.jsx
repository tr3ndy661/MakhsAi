import React, { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

export const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [chatTitles, setChatTitles] = useState([]); // Ensure this is initialized as an empty array
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);

    // Function to generate a chat title
    const generateChatTitle = async (prompt) => {
        try {
            // Generate a concise title based on the first user prompt
            const titlePrompt = `Generate a concise, descriptive title (max 5 words) for a conversation starting with: "${prompt}"`;
            const titleResponse = await runChat(titlePrompt);
            
            // Clean and truncate the title
            const cleanedTitle = titleResponse
                .replace(/[^a-zA-Z0-9 ]/g, '')
                .trim()
                .split(' ')
                .slice(0, 5)
                .join(' ');

            return cleanedTitle || `Chat on ${new Date().toLocaleDateString()}`;
        } catch (error) {
            console.error("Error generating chat title:", error);
            return `Chat on ${new Date().toLocaleDateString()}`;
        }
    };

    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setResultData("");
        setRecentPrompt("");
        setUploadedFile(null);
    }

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // File validation logic 
            const maxSize = 5 * 1024 * 1024; 
            const allowedTypes = [
                'image/jpeg', 
                'image/png', 
                'image/gif', 
                'application/pdf', 
                'text/plain', 
                'text/csv', 
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];

            if (file.size > maxSize) {
                alert('File is too large. Maximum size is 5MB.');
                return;
            }

            if (!allowedTypes.includes(file.type)) {
                alert('Invalid file type. Allowed types are: JPEG, PNG, GIF, PDF, Text, CSV, Word files.');
                return;
            }

            setUploadedFile(file);
        }
    }
    
    

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
       
        let response;
        try {
            // Existing file handling logic
            let fileData = null;
            if (uploadedFile) {
                try {
                    fileData = await readFileContent(uploadedFile);
                } catch (fileReadError) {
                    console.error("Error reading file:", fileReadError);
                    setResultData("Error reading the uploaded file.");
                    setLoading(false);
                    return;
                }
            }

            // Prepare prompt with file context
            let fullPrompt = prompt;
            if (fileData) {
                if (fileData.type === 'text') {
                    fullPrompt += `\n\nAttached File Content:\n${fileData.content}`;
                }
            }

            // Send prompt to AI
            response = await runChat(
                fullPrompt, 
                fileData?.type === 'image' || fileData?.type === 'pdf' ? fileData.content : null, 
                fileData?.mimeType
            );
            
            // Generate and store chat title if it's a new conversation
            if (!recentPrompt) {
                const newTitle = await generateChatTitle(prompt);
                setChatTitles(prev => [newTitle, ...prev.slice(0, 9)]); // Keep last 10 titles
            }

            setRecentPrompt(prompt);

            // Existing response formatting logic
            let responseArray = response.split("**");
            let newResponse = "";
            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    newResponse += responseArray[i];
                } else {
                    newResponse += "<b>" + responseArray[i] + "</b>";
                }
            }

            let newResponse2 = newResponse.split("*").join("<br>");
            let newResponseArray = newResponse2.split(" ");
            
            setResultData("");
           
            for (let i = 0; i < newResponseArray.length; i++) {
                const nextWord = newResponseArray[i];
                delayPara(i, nextWord + " ");
            }
        } catch (error) {
            console.error("Error getting response:", error);
            setResultData("Sorry, there was an error getting the response.");
        } finally {
            setLoading(false);
            setInput("");
        }
    }

    const readFileContent = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                const content = event.target.result;
                
                // Determine content type and processing
                if (file.type.startsWith('image/')) {
                    // For images, return base64 
                    resolve({
                        type: 'image',
                        content: content,
                        mimeType: file.type
                    });
                } else if (file.type === 'application/pdf') {
                    // For PDF, return base64
                    resolve({
                        type: 'pdf',
                        content: content,
                        mimeType: file.type
                    });
                } else if (
                    file.type.includes('spreadsheet') || 
                    file.type.includes('word') || 
                    file.type === 'text/csv' || 
                    file.type === 'text/plain'
                ) {
                    // For text-based files, return text content
                    resolve({
                        type: 'text',
                        content: content,
                        mimeType: file.type
                    });
                } else {
                    reject(new Error('Unsupported file type'));
                }
            };

            reader.onerror = (error) => reject(error);
            
            // Choose appropriate reading method
            if (file.type.startsWith('image/')) {
                reader.readAsDataURL(file);
            } else if (file.type === 'application/pdf') {
                reader.readAsDataURL(file);
            } else {
                reader.readAsText(file);
            }
        });
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        recentPrompt,
        setRecentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        handleFileUpload,
        uploadedFile,
        setUploadedFile,
        chatTitles,  // Ensure this is included in contextValue
        setChatTitles  // Include the setter
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;