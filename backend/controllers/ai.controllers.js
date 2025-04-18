import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import processImageAndGenerateExplanation, { generateExplanation } from '../services/AI.js';

export const handleImagePrompts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imagePath = req.file.path; 
    const explanation = await processImageAndGenerateExplanation(imagePath);
    await fs.unlink(imagePath);
    res.status(200).json({ message: 'success', result: explanation });
  } catch (error) {
    if (req.file && req.file.path) {
      await fs.unlink(req.file.path);
    }
    res.status(500).json({ message: 'Error processing image', error: error.message });
  }
};
export const handleReviewPrompts = async(req,res)=>{
  try{
    const {prompt} = req.body;
    if(!prompt){
      res.status(400).json({message:"empty prompt"}).end()
    }
    const response = await generateExplanation(prompt)
    if(!response){
      res.status(400).json({message:"error processing the prompt"}).end()
    }
    res.status(200).json({message:"success",response})
  }catch(err){
    console.log(err.message)
    res.status(500).json({error:"Internal server error"})
  }

}

 

