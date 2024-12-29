import { Router } from "express";
import { getTopicDeatilsByTopicIdHandler } from "./handler.ts";

export const topicRouter = Router()

topicRouter.get('/api/topic/:topicId', getTopicDeatilsByTopicIdHandler)