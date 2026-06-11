import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
    })
  : null;

export async function getRecentAgentActivity(
  limit = 5,
) {
  if (!pool) {
    throw new Error(
      "DATABASE_URL is not set. Add a PostgreSQL connection string to use this tool.",
    );
  }

  const safeLimit = Math.max(1, Math.min(limit, 20));

  const result = await pool.query(
    `
      select
        created_at,
        role,
        content
      from agent_activity
      order by created_at desc
      limit $1
    `,
    [safeLimit],
  );

  return {
    table: "agent_activity",
    limit: safeLimit,
    rows: result.rows,
  };
}

export async function recordAgentActivity(
  role: "user" | "assistant" | "tool",
  content: string,
) {
  if (!pool) {
    throw new Error(
      "DATABASE_URL is not set. Add a PostgreSQL connection string to use this tool.",
    );
  }

  await pool.query(
    `
      insert into agent_activity (role, content)
      values ($1, $2)
    `,
    [role, content],
  );
}
