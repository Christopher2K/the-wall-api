declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: "development" | "production" | "test";
      readonly PORT: string;
      readonly DATABASE_URL: string;
      readonly SECRET_KEY: string;
    }
  }
}

export {};
