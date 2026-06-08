import { getRecentAgentActivity } from "../services/postgres.service.js";

export async function getRecentAgentActivityTool(
  limit?: number,
) {
  return await getRecentAgentActivity(limit);
}
