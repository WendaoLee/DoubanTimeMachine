import { Router } from "express";
import { getUserLatestTopicInfoHandler } from "./handler.ts";

export const userTopicsRouter = Router()

userTopicsRouter.get('/api/user/topics',getUserLatestTopicInfoHandler)
