import { throwErrorIsEnvNotConfigured } from "./utils.ts";
import dotenv from "dotenv"

dotenv.config()


export const DATABASE_TYPE = throwErrorIsEnvNotConfigured(process.env.DATABASE_TYPE, "DATABASE_TYPE")
export const DATABASE_HOST = throwErrorIsEnvNotConfigured(process.env.DATABASE_HOST, "DATABASE_HOST")
export const DATABASE_PORT = throwErrorIsEnvNotConfigured(process.env.DATABASE_PORT, "DATABASE_PORT")
export const DATABASE_USERNAME = throwErrorIsEnvNotConfigured(process.env.DATABASE_USERNAME, "DATABASE_USERNAME")
export const DATABASE_PASSWORD = throwErrorIsEnvNotConfigured(process.env.DATABASE_PASSWORD, "DATABASE_PASSWORD")
export const DATABASE_NAME = throwErrorIsEnvNotConfigured(process.env.DATABASE_NAME, "DATABASE_NAME")
