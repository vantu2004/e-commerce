import 'dotenv/config';
export const PORT = process.env.PORT || 8080;
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern_shop';
export const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';