import dotenv from "dotenv";
dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT is not defined at ENV file.");
}
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined at ENV file.");
}

const config = {
  PORT: process.env.PORT || 3000,
  MONGO: process.env.MONGO_URI,
};

export { config };
