import type { UserLevels } from "./mod.ts";

/**
 * Get the leaderboard of a guild.
 *
 * @async
 * @param {(string | null)} tkn API token for Tatsu.
 * @param {string} guildId Guild to get the leaderboard from.
 * @returns {Promise<GuildRankings>} Leaderboard of the guild.
 */
export async function TATSUGetLeaderboard(
  tkn: string | null,
  guildId: string,
): Promise<UserLevels[]> {
  if (!tkn) throw new Error("No Tatsu API key provided. Cannot use Tatsu API.");
  const resp = await fetch(
    `https://api.tatsu.gg/v1/guilds/${guildId}/rankings/all`,
    {
      method: "GET",
      headers: {
        Authorization: tkn,
      },
    },
  );
  const result = (await resp.json()) as {
    rankings: { score: number; user_id: string }[];
  };
  if (!resp.ok) 
    throw new Error((result as unknown as { message: string }).message);
  

  return result.rankings.map((u) => {
    return {
      uid: u.user_id,
      current_xp: u.score,
    };
  });
}
