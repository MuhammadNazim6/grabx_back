import express from "express";
import { googleLogin, googleSignin, login, signup } from "../controllers/userController";
import { addTask, deleteTask, editTask, getTasks, switchStatus } from "../controllers/taskController";
const userRoute = express();


userRoute.post("/signup", signup)
userRoute.post("/google-signin", googleSignin)
userRoute.post("/login", login)
userRoute.post("/google-login", googleLogin)
userRoute.get("/get-tasks", getTasks)
userRoute.post("/add-task", addTask)
userRoute.patch("/edit-task", editTask)
userRoute.delete("/delete-task", deleteTask)
userRoute.patch("/switch-status", switchStatus)



export default userRoute