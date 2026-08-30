import type { UserLevels } from "./mod.ts";

/** Lurkr API docs have a "copy TypeScript definitions" for this */
export interface LURKRResponse {
  guild: {
    icon: string | null;
    id: string;
    memberCount: number;
    name: string;
  };
  isManager: boolean;
  levels: {
    level: number;
    messageCount: number;
    nextLevelXp: number;
    progress: number;
    rank: number;
    user: {
      accentColour: string | null;
    };
    userId: string;
    xp: number;
  }[];
  multipliers: {
    id: string;
    multiplier: number;
    targets: unknown[];
    type: "Channel" | "Role";
  }[];
  roleRewards: {
    id: string;
    level: number;
    roles: unknown[];
  }[];
  vanity: string | null;
  /**
   * The cooldown period for XP gain in seconds
   */
  xpGainInterval: number;
  xpGlobalMultiplier: number;
  /**
   * Maximum XP to gain per message
   */
  xpPerMessageMax: number;
  /**
   * Minimum XP to gain per message
   */
  xpPerMessageMin: number;
}

/**
 * Get the leaderboard of a guild.
 *
 * @async
 * @param {(string | null)} tkn API token for Lurkr.
 * @param {string} guildId Guild to get the leaderboard from.
 * @returns {Promise<LURKRResponse["levels"]>} Leaderboard of the guild.
 */
export async function LURKRGetLeaderboard(
  tkn: string | null,
  guildId: string,
): Promise<UserLevels[]> {
  if (!tkn) throw new Error("No Lurkr API key provided. Cannot use Lurkr API.");
  const leaderboard: LURKRResponse["levels"] = [];
  let pageNumber = 1;
  while (true) {
    const page = await fetch(
      `https://api.lurkr.gg/v2/levels/${guildId}?page=${pageNumber}`,
      {
        method: "GET",
      },
    );
    const content = (await page.json()) as LURKRResponse;
    if (!page.ok) 
      throw new Error(
        `Failed to import from Lurkr: ${
          (content as unknown as { message: string }).message
        }`,
      );
    

    leaderboard.push(...content.levels);
    if (content.levels.length < 1000) break;
    pageNumber += 1;
  }
  return leaderboard.map((u) => {
    return {
      uid: u.userId,
      lvl: u.level,
      current_xp: u.xp,
    };
  });
}
