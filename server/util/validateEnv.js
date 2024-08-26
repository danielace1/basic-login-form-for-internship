import { cleanEnv, str, port } from "envalid";

export default cleanEnv(process.env, {
  MONGODB_CONNECTION_URL: str(),
  PORT: port(),
});
