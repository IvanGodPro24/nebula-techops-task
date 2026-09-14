import dotenv from "dotenv";

dotenv.config();

const getEnvVar = (name: string, defaultValue: string = "") => {
  const value = process.env[name];

  if (value) return value;

  if (defaultValue) return defaultValue;

  throw new Error(`Missing: process.env['${name}'].`);
};

export const env = {
  PORT: Number(getEnvVar("PORT", "3001")),
  OPENROUTER_API_KEY: getEnvVar("OPENROUTER_API_KEY"),
};
