import bookRouter from './routes/book.routes.js' 
import userRouter from './routes/user.routes.js'
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import AIRouter from './routes/ai.routes.js'
import processImageAndGenerateExplanation from './services/AI.js'
const app = express();
dotenv.config();
app.use(express.json())
const port = process.env.PORT || 5000
console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);

const CONNECT_TO_DATABASE = async()=>{
    try {
        const connected = await mongoose.connect(process.env.CONNECTION_STRING)
        console.log('connected to the database')
    } catch (error) {
        console.log('Error connecting to the database')
    }
}

CONNECT_TO_DATABASE()
app.use('/api/books',bookRouter)
app.use('/api/user',userRouter)

app.use('/api/AI',AIRouter)
app.get('/',(req,res)=>{
    res.send("<h1>API for the book sphere app</h1>")
})
//await processImageAndGenerateExplanation('./public/test.jpeg')
//console.log(process.env.OPENAI_API_KEY)
app.listen(port,()=>{
    console.log('server listening to port: ',port)
})
export default (req, res) => {
    app(req, res); 
  };

