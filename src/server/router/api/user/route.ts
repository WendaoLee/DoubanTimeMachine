import { Router } from "express";
import { getUserInfoByDoubanUIDHandler } from "./handler.ts";

export const userRouter = Router()

userRouter.get('/api/user',getUserInfoByDoubanUIDHandler)

