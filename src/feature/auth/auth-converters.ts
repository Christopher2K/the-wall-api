import { DbUser } from "#root/db";

export const serializeDbUser = ({
  id,
  username,
  insertedAt,
  updatedAt,
}: DbUser) => {
  return {
    id,
    username,
    insertedAt,
    updatedAt,
  };
};
