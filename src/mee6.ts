import { GET_ID, Identifier } from "./main.js";

interface MEE6User {
  id: string;
  level: number;
  xp: {
    userXp: number;
    levelXp: number;
    totalXp: number;
  };
}

/**
 * Get a page of the leaderboard of a guild.
 * @param {Identifier} guild Guild to get the leaderboard from.
 * @param {number} limit Limit of users to fetch per page. Maximum 1000.
 * @param {number} page Number of pages to skip.
 * @returns {Promise<MEE6User[]>} Leaderboard page.
 */
async function getLeaderboardPage(
  guild: Identifier,
  limit: number = 1000,
  page: number = 0,
): Promise<MEE6User[]> {
  const guildId = GET_ID(guild);
  const response = await fetch(
    `https://mee6.xyz/api/plugins/levels/leaderboard/${guildId}?limit=${limit}&page=${page}`,
    { method: "GET" },
  );
  const j = (await response.json()) as any;
  if (response.status !== 200) {
    if (j.error && j.error.message)
      throw new Error(`${response.status}: ${j.error.message}`);
    else throw new Error(`${response.status}: ${response.statusText}`);
  }
  return j.players.map((user: any) => {
    const { id, level } = user;
    const [userXp, levelXp, totalXp] = user.detailed_xp;
    return {
      id,
      level,
      xp: { userXp, levelXp, totalXp },
    };
  });
}

/**
 * Get the leaderboard of a guild.
 * @param {Identifier} guild Guild to get the leaderboard from.
 * @returns {Promise<MEE6User[]>} Leaderboard of the guild.
 */
export async function MEE6GetLeaderboard(
  guild: Identifier,
): Promise<MEE6User[]> {
  const leaderboard = [];
  let pageNumber = 0;
  while (true) {
    const page = await getLeaderboardPage(guild, 1000, pageNumber);
    leaderboard.push(...page);
    if (page.length < 1000) break;
    pageNumber += 1;
  }
  return leaderboard;
}
