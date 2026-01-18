type LeaderboardEntry = {
  id: string;
  username: string;
  exp: string;
  level: number;
};

/**
 * Get the leaderboard of a guild.
 *
 * @async
 * @param {(string | null)} tkn API token for Tatsu.
 * @param {string} guildId Guild to get the leaderboard from.
 * @returns {Promise<GuildRankings>} Leaderboard of the guild.
 */
export async function AMARIGetLeaderboard(
  tkn: string | null,
  guildId: string,
): Promise<LeaderboardEntry[]> {
  let pg = 0;
  const values: LeaderboardEntry[] = [];
  if (!tkn) throw "No Amari API key provided. Cannot use Amari API.";
  while (true) {
    const resp = await fetch(
      `https://amaribot.com/api/v1/guild/leaderboard/${guildId}?page=${pg}&limit=200`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tkn}`,
        },
      },
    );
    const json = (await resp.json()) as {
      data: LeaderboardEntry[];
      count: number;
      total_count: number;
    };
    values.push(...json.data);
    if (values.length == json.total_count) break;
    pg += 1;
  }

  return values;
}
