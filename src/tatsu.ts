// thanks tatsu for caring to make a package
import { GuildRankings, Tatsu } from "tatsu";

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
): Promise<GuildRankings> {
  if (!tkn) throw "No Tatsu API key provided. Cannot use Tatsu API.";
  const tatsu = new Tatsu(tkn);
  return await tatsu.getGuildRankings(guildId);
}
