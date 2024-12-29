import express from "express";
import cors from "cors";
import { router } from "./router/index.ts";

export const app = express();

app.use(cors())
app.use(express.json({
    limit:'30mb'
}))
app.use(express.urlencoded({ extended: true }))
app.use(router)