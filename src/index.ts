import express from 'express';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import userRoute from './routes/user';
import cors from 'cors';
import { connectToDatabase } from './db';
import productRoute from './routes/product';
import cartRoute from './routes/cart';
import wishlistRoute from './routes/wishlist';

dotenv.config();
connectToDatabase()
const app = express();
const port = process.env.PORT || 3000


app.use(cors({
  origin: [process.env.CORS_URL1 as string, process.env.CORS_URL2 as string],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(morgan('dev')); 


app.get('/',(req,res)=>{
  res.send('This is Taskit backend')
})
app.use("/auth", userRoute);
app.use("/product", productRoute);
app.use("/cart", cartRoute);
app.use("/wishlist", wishlistRoute);



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});