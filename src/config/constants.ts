import dotenv from 'dotenv';
dotenv.config();

export const DEFAULT_FARM_ID = process.env.DEFAULT_FARM_ID || 'a0000000-0000-0000-0000-000000000001';
export const PORT = process.env.PORT || 3000;