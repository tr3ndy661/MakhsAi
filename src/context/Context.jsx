import React, { createContext, useState, useEffect } from "react";
import runChat from "../config/gemini";
// import { extendContextWithSpeech } from './yourSpeechExtensionFile';

export const Context = createContext();

export const ContextProvider = (props) => {
    // states
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [chatTitles, setChatTitles] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
    
    // Add new state for stop generation
    const [stopGeneration, setStopGeneration] = useState(false);
    // states for session management
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [chatSessions, setChatSessions] = useState({});

    // Function to create a new chat session
    const createNewSession = async () => {
        const sessionId = `session_${Date.now()}`;
        setChatSessions(prev => ({
            ...prev,
            [sessionId]: {
                messages: [],
                recentPrompt: "",
                resultData: "",
                uploadedFile: null,
                chatTitle: ""
            }
        }));
        setCurrentSessionId(sessionId);
        return sessionId;
    };

    // Function to switch to an existing session
    const switchToSession = (sessionId) => {
        if (chatSessions[sessionId]) {
            const session = chatSessions[sessionId];
            setCurrentSessionId(sessionId);
            setRecentPrompt(session.recentPrompt);
            setResultData(session.resultData);
            setUploadedFile(session.uploadedFile);
            setShowResult(!!session.resultData);
        }
    };
    

    // Initialize with a first session on mount
    useEffect(() => {
        createNewSession();
    }, []);

    // Existing methods with modifications to support session management
    const generateChatTitle = async (prompt) => {
        try {
            const titlePrompt = `Generate a concise, descriptive title (max 5 words) for a conversation starting with: "${prompt}"`;
            const titleResponse = await runChat(titlePrompt);
            
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
            // Check if generation should stop
            if (!stopGeneration) {
                setResultData(prev => prev + nextWord);
            }
        }, 75 * index);
    }

        // Add stop generating function
        const stopGenerating = () => {
            setStopGeneration(true);
            setLoading(false);
        };

    const newChat = () => {
        createNewSession();
        setLoading(false);
        setShowResult(false);
        setResultData("");
        setRecentPrompt("");
        setUploadedFile(null);
    }

    const onSent = async (prompt) => {
        // Ensure we have a current session
        if (!currentSessionId) {
            await createNewSession();
        }

        setResultData("");
        setLoading(true);
        setShowResult(true);
               // Reset stop generation flag
        setStopGeneration(false);

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
            let chatTitle = "";
            if (!recentPrompt) {
                chatTitle = await generateChatTitle(prompt);
                setChatTitles(prev => [chatTitle, ...prev.slice(0, 9)]);
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
                if (stopGeneration) break; // Stop if generation is cancelled
                const nextWord = newResponseArray[i];
                delayPara(i, nextWord + " ");
            }

            // Update current session
            setChatSessions(prev => ({
                ...prev,
                [currentSessionId]: {
                    messages: [
                        ...(prev[currentSessionId]?.messages || []),
                        { role: 'user', content: prompt },
                        { role: 'assistant', content: response }
                    ],
                    recentPrompt: prompt,
                    resultData: newResponse2,
                    uploadedFile,
                    chatTitle: chatTitle || prev[currentSessionId]?.chatTitle
                }
            }));

        } catch (error) {
            console.error("Error getting response:", error);
            setResultData("Sorry, there was an error getting the response.");
        } finally {
            setLoading(false);
            setInput("");
        }
    }

    // Existing file handling methods remain the same
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Existing file validation logic
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

            // Update current session's uploaded file
            if (currentSessionId) {
                setChatSessions(prev => ({
                    ...prev,
                    [currentSessionId]: {
                        ...prev[currentSessionId],
                        uploadedFile: file
                    }
                }));
            }
        }
    }

    // Read file content method remains the same
    const readFileContent = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                const content = event.target.result;
                
                // Determine content type and processing
                if (file.type.startsWith('image/')) {
                    resolve({
                        type: 'image',
                        content: content,
                        mimeType: file.type
                    });
                } else if (file.type === 'application/pdf') {
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

    // Get recent chat sessions
    const getRecentChats = () => {
        return Object.entries(chatSessions)
            .map(([id, session]) => ({
                id,
                title: session.chatTitle || session.recentPrompt || `Chat on ${new Date(parseInt(id.split('_')[1])).toLocaleDateString()}`,
                date: new Date(parseInt(id.split('_')[1]))
            }))
            .filter(chat => chat.title)
            .sort((a, b) => b.date - a.date)
            .slice(0, 10);
    };

    const contextValue = {
        ...{
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
            chatTitles,
            setChatTitles,
            stopGenerating, // Add the stop generating function
        },
        // New session management methods
        currentSessionId,
        chatSessions,
        createNewSession,
        switchToSession,
        getRecentChats
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;