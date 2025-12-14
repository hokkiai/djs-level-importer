import { LURKRGetLeaderboard } from "./lurkr.js";
import { MEE6GetLeaderboard } from "./mee6.js";
import { TATSUGetLeaderboard } from "./tatsu.js";

/** A user/guild ID. MEE6 has a slightly inconsistent way of telling you this, as far as I know. */
export type Identifier = string | { id: string };

/**
 * Resolves a user/guild ID from the MEE6 (or any) API.
 *
 * @param {Identifier} id ID
 * @returns {string} Resolved ID
 */
export function GET_ID(id: Identifier): string {
  if (typeof id === "string") return id;
  else if (typeof id.id === "string") return id.id;
  else throw new Error("Invalid Identifier specified: " + id);
}

/**
 * A user's leveling information, in a common format **with minimal data**. Required for compat with lesser capable bots like Tatsu.
 *
 * @interface BaseUserLevels
 */
export interface BaseUserLevels {
  /** User ID. */
  uid: string;
  /** Current XP **in total**. */
  current_xp: number;
}

/**
 * A user's leveling information, in a common format **with levels and rank up**.
 *
 * @interface FullUserLevels
 */
export interface FullUserLevels extends BaseUserLevels {
  /** Current XP **relative to the level**.
   *
   * Not all APIs return this, therefore it's optional.
   *
   * @deprecated Should've thought about this when initially designing the API. Next major release will probably just remove this property entirely, as it's not that useful anyway. Try not to depend on it.
   */
  current_lvl_xp?: number;
  /** Current level. */
  lvl: number;
  /** XP required to level up. */
  next_lvl_xp: number;
}

/** Type-guards if you're on MEE6, basically. */
export function SUPPORTS_LEVELS(a: any): a is FullUserLevels {
  return a.lvl && a.lvl !== undefined && typeof a.lvl === "number";
}

/**
 * Supported Discord bots
 *
 * ```ts
 * MEE6 = 0,
 * TATSU = 1,
 * LURKR = 2,
 * ```
 * @enum {number}
 */
export enum SupportedBots {
  MEE6 = 0,
  TATSU = 1,
  LURKR = 2,
}

export class Leveler {
  private guild: string;
  private tatsu_api: string | null = null;
  private lurkr_api: string | null = null;

  /**
   * Creates an instance of a Leveler, with which you'll be able to import leveling data from supported bots.
   *
   * @constructor
   * @param {string} guild Guild ID.
   * @param {?string} tatsu_api If importing from Tatsu, you need to bring in your own API key. This is free and pretty easy to get from the Tatsu bot itself.
   * @param {?string} lurkr_api If importing from Tatsu, you need to bring in your own API key. This is free and pretty easy to get from the Tatsu bot itself.
   */
  constructor(options: {
    guild: string;
    tatsu_api?: string;
    lurkr_api?: string;
  }) {
    this.guild = options.guild;
    if (options.tatsu_api) this.tatsu_api = options.tatsu_api;
    if (options.lurkr_api) this.lurkr_api = options.lurkr_api;
  }

  /** Gets the whole server leaderboard from a supported bot. Throws if unable to get it. */
  public async GetLeaderboard(
    target: SupportedBots,
  ): Promise<BaseUserLevels[] | FullUserLevels[]> {
    if (target === SupportedBots.MEE6) {
      const levels = await MEE6GetLeaderboard(this.guild);
      return levels.map((u) => {
        return {
          uid: u.id,
          lvl: u.level,
          current_xp: u.xp.totalXp,
          current_lvl_xp: u.xp.userXp,
          next_lvl_xp: u.xp.levelXp,
        };
      });
    } else if (target === SupportedBots.LURKR) {
      const levels = await LURKRGetLeaderboard(this.lurkr_api, this.guild);
      return levels.map((u) => {
        return {
          uid: u.userId,
          lvl: u.level,
          current_xp: u.xp,
          next_lvl_xp: u.nextLevelXp,
        };
      });
    } else {
      const levels = await TATSUGetLeaderboard(this.tatsu_api, this.guild);
      return levels.rankings.map((u) => {
        return {
          uid: u.user_id,
          current_xp: u.score,
        };
      });
    }
  }
}
