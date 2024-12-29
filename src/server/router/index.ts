import { Router } from "express";
import { latestRouter } from "./api/latest/route.ts";
import { topicRouter } from "./api/topic/route.ts";
import { userRouter } from "./api/user/route.ts";
import { userCommentsRouter } from "./api/user/comments/route.ts";
import { userTopicsRouter } from "./api/user/topics/route.ts";

export const router = Router();

router.use(latestRouter)
router.use(topicRouter)
router.use(userRouter)
router.use(userCommentsRouter)
router.use(userTopicsRouter)