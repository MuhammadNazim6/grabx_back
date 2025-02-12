import express from 'express';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import userRoute from './routes/userRoutes';
import cors from 'cors';
import { connectToDatabase } from './db';

dotenv.config();
connectToDatabase()
const app = express();
const port = process.env.PORT || 3000


app.use(cors({
  origin: process.env.CORS_URL, 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
  res.send('This is Taskit backend')
})
app.use("/", userRoute);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});