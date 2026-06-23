import { Pool } from "pg";

export const pool = new Pool({
  user: "abhiiths",
  host: "localhost",
  database: "k8s_platform",
  password: "",
  port: 5432,
});