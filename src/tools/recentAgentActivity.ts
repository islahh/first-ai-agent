import { getRecentAgentActivity } from "../services/postgress.service.js";

export async function getRecentAgentActivityTool(
  limit?: number,
) {
  return await getRecentAgentActivity(limit);
}
