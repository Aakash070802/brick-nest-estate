import dotenv from "dotenv";
dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT is not defined at ENV file.");
}
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined at ENV file.");
}
if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined at ENV file.");
}
if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET is not defined at ENV file.");
}
if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error("CLOUDINARY_API_SECRET is not defined at ENV file.");
}
if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error("CLOUDINARY_API_KEY is not defined at ENV file.");
}
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error("CLOUDINARY_CLOUD_NAME is not defined at ENV file.");
}
if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV is not defined at ENV file.");
}

const config = {
  PORT: process.env.PORT || 3000,
  MONGO: process.env.MONGO_URI,
  ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_SECRET,
  CLOUD_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUD_API: process.env.CLOUDINARY_API_KEY,
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  NODE_ENV: process.env.NODE_ENV,
};

export { config };
