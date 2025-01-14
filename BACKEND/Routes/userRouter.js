import express from 'express'
import { registerUser, loginUser, verifyEmailOtp, forgot_password, reset_password } from '../Controllers/userControllers.js'

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/verify_otp/:email", verifyEmailOtp)
userRouter.post("/forgot_password", forgot_password)
userRouter.post("/reset_password/:token", reset_password)

export default userRouter