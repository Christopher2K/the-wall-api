import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const queryClient = postgres(process.env.DATABASE_URL, {
  onnotice(notice) {
    console.debug("DB Notice", notice);
  },
  onclose(connId) {
    console.debug("DB close connection", connId);
  },
});
export const db = drizzle(queryClient, { schema });
export * from "./schema";
