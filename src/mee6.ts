import {
  GET_ID,
  type Identifier,
  type LevelRewards,
  type UserLevels,
} from "./mod.ts";

interface MEE6User {
  id: string;
  level: number;
  xp: {
    userXp: number;
    levelXp: number;
    totalXp: number;
  };
}

interface API_MEE6User {
  id: string;
  level: number;
  detailed_xp: [number, number, number];
  message_count: number;
  xp: number;
}

interface API_MEE6Reward {
  rank: number;
  role: {
    id: string;
  };
}

async function fetchMee6(
  guild: Identifier,
  limit = 1000,
  page = 0,
): Promise<{
  error?: { message?: string };
  players: API_MEE6User[];
  role_rewards: API_MEE6Reward[];
}> {
  const guildId = GET_ID(guild);
  const response = await fetch(
    `https://mee6.xyz/api/plugins/levels/leaderboard/${guildId}?limit=${limit}&page=${page}`,
    { method: "GET" },
  );
  const index = (await response.json()) as {
    error?: { message?: string };
    players: API_MEE6User[];
    role_rewards: API_MEE6Reward[];
  };
  if (response.status !== 200) {
    const error = index.error?.message
      ? new Error(`${response.status}: ${index.error.message}`)
      : new Error(`${response.status}: ${response.statusText}`);
    throw error;
  }
  return index;
}

async function getLeaderboardPage(
  guild: Identifier,
  limit = 1000,
  page = 0,
): Promise<MEE6User[]> {
  const index = await fetchMee6(guild, limit, page);
  return index.players.map((user): MEE6User => {
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
): Promise<UserLevels[]> {
  const leaderboard = [];
  let pageNumber = 0;
  while (true) {
    const page = await getLeaderboardPage(guild, 1000, pageNumber);
    leaderboard.push(...page);
    if (page.length < 1000) break;
    pageNumber += 1;
  }
  return leaderboard.map((u) => {
    return {
      uid: u.id,
      lvl: u.level,
      current_xp: u.xp.totalXp,
    };
  });
}

/**
 * Get the level rewards of a guild.
 * @param {Identifier} guild Guild to get the leaderboard from.
 * @returns {Promise<API_MEE6Reward[]>} Leaderboard of the guild.
 */
export async function MEE6GetRewards(
  guild: Identifier,
): Promise<LevelRewards[]> {
  const index = await fetchMee6(guild, 1, 1);
  return index.role_rewards.map((r) => {
    return {
      lvl: r.rank,
      roles: [r.role.id],
      channels: [],
    };
  });
}
