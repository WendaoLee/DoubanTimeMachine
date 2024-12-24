/**
 * @module src.constants.ENVIROMENT 存储环境变量的模块
 */

import dotenv from 'dotenv';
import { throwErrorIsEnvNotConfigured } from './utils.ts';

dotenv.config();

export const DOUBAN_API_KEY = throwErrorIsEnvNotConfigured(process.env.DOUBAN_API_KEY, 'DOUBAN_API_KEY');
export const DOUBAN_API_SECRET = throwErrorIsEnvNotConfigured(process.env.DOUBAN_API_SECRET, 'DOUBAN_API_SECRET');