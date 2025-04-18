import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

export default async function processImageAndGenerateExplanation(imagePath) {
  try {
    const imageFile = fs.createReadStream(imagePath);
    const ocrApiUrl = 'https://api.ocr.space/parse/image';
    const ocrApiKey = process.env.OCR_SPACE_API_KEY; // OCR API Key


    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('apikey', ocrApiKey);

    // Call OCR API to extract text
    const ocrResponse = await axios.post(ocrApiUrl, formData, {
      headers: formData.getHeaders(),
    });

    if (ocrResponse.data.IsErroredOnProcessing) {
      throw new Error('Error occurred while processing the image.');
    }

    const extractedText = ocrResponse.data.ParsedResults[0].ParsedText.trim();
    console.log('OCR completed. Extracted text:', extractedText);

    if (!extractedText) {
      throw new Error('No text found in the image.');
    }

    // Generate explanation using OpenAI API
    console.log('Generating explanation for the extracted text...');
    const context = "you help the user understand what the writer is trying to say on the current page. the books content will be provided to you in text form."
    const explanation = await generateExplanation(extractedText,context);
    return explanation;
  } catch (error) {
    console.error('Error:', error.message);
    return 'Failed to process image and generate explanation.';
  }
}

export async function generateExplanation(extractedText,context) {
  const openAiApiKey = process.env.OPENAI_API_KEY
  try {
    const openAiApiUrl = 'https://api.openai.com/v1/chat/completions';
    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: context },
        { role: 'user', content: `\n\n${extractedText}` },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    };

    const response = await axios.post(openAiApiUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAiApiKey}`,
      },
    });

    const explanation = response.data.choices[0].message.content.trim() || 'No explanation available.';
    console.log('Explanation generated successfully:', explanation);

    return explanation;
  } catch (error) {
    console.error('Error generating explanation:', error.message);
    return 'Failed to generate explanation.';
  }
}
