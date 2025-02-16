import express from "express";
import { googleLogin, googleSignin, login, signup } from "../controllers/user";
const userRoute = express();


userRoute.post("/login", login)
userRoute.post("/signup", signup)
userRoute.post("/google-signin", googleSignin)
userRoute.post("/google-login", googleLogin)


export default userRoute; 