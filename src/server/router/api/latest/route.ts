import { Router } from "express";
import { getLatestTopicInfoHandler } from "./handler.ts";

export const latestRouter = Router()

latestRouter.get('/api/latest', getLatestTopicInfoHandler)