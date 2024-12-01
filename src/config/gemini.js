import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = "AIzaSyBD74WICdmvxs4IbzOlWMR9Mfb4Mx6F22I";
const genAI = new GoogleGenerativeAI(apiKey);

// Use Gemini Pro Vision for multimodal support
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Function to parse file content based on type
const parseFileContent = (fileContent, fileType) => {
  // For image types, return as-is (base64)
  if (fileType.startsWith('image/')) {
    return { inlineData: { mimeType: fileType, data: fileContent.split(',')[1] } };
  }

  // For text-based files, return as text
  if (fileType === 'text/plain' || 
      fileType === 'text/csv' || 
      fileType.includes('word') || 
      fileType === 'application/pdf') {
    return fileContent;
  }

  return null;
};

async function runChat(prompt, fileContent = null, fileType = null) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    let parts = [{ text: prompt }];

    // Add file content if present
    if (fileContent) {
      if (fileType.startsWith('image/') || fileType === 'application/pdf') {
        // For images and PDFs
        parts.push({
          inlineData: {
            mimeType: fileType,
            data: fileContent.split(',')[1] // Remove base64 prefix
          }
        });
      }
    }

    const result = await chatSession.sendMessage(parts);
    const response = await result.response.text();
    
    return response;
  } catch (error) {
    console.error('Error in Gemini API call:', error);
    throw error;
  }
}

export default runChat;