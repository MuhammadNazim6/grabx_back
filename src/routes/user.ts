import express from "express";
import { googleLogin, googleSignin, login, signup } from "../controllers/user";
const userRoute = express();


userRoute.post("/login", login)
userRoute.post("/signup", signup)
userRoute.post("/google-signin", googleSignin)


export default userRoute; 