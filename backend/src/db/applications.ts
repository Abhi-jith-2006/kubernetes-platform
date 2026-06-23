import { pool } from "./client";

export async function createApplication(
  name: string,
  image: string
) {
  await pool.query(
    `
    INSERT INTO applications(name, image)
    VALUES($1, $2)
    `,
    [name, image]
  );
}

export async function deleteApplication(
  name: string
) {
  await pool.query(
    `
    DELETE FROM applications
    WHERE name = $1
    `,
    [name]
  );
}

export async function getApplications() {
  const result = await pool.query(`
    SELECT *
    FROM applications
    ORDER BY created_at DESC
  `);

  return result.rows;
}