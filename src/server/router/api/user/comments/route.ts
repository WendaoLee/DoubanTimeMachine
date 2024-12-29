import { Router } from "express";
import { getUserAllCommentsHandler } from "./handler.ts";

export const userCommentsRouter = Router()

userCommentsRouter.get('/api/user/comments',getUserAllCommentsHandler)