import { AMARIGetLeaderboard } from "./amari.js";
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
  return typeof id === "string" ? id : id.id;
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
 * A user's leveling information, in a common format **with levels**.
 *
 * @interface StandardUserLevels
 */
export interface StandardUserLevels extends BaseUserLevels {
  /** Current level. */
  lvl: number;
}

/**
 * A user's leveling information, in a common format **with levels and level rewards**.
 *
 * @interface StandardUserLevels
 * @deprecated Internal only.
 */
export interface FullUserLevels extends StandardUserLevels {
  /** Level rewards. Each rewards is defined as `[required level, reward type, reward content]`.
   */
  rewards: [number, SupportedRewards, string][];
}

/** Type-guards if you're on MEE6, basically. */
export function SUPPORTS_LEVELS(
  a: BaseUserLevels | StandardUserLevels,
): a is StandardUserLevels {
  return "lvl" in a && a.lvl !== undefined && typeof a.lvl === "number";
}

/**
 * Supported Discord bots
 *
 * ```ts
 * MEE6 = 0,
 * TATSU = 1,
 * LURKR = 2,
 * AMARI = 3,
 * ```
 * @enum {number}
 */
export enum SupportedBots {
  MEE6 = 0,
  TATSU = 1,
  LURKR = 2,
  AMARI = 3,
}

/**
 * @deprecated Internal only.
 */
enum SupportedRewards {
  CHANNEL,
  ROLE,
}

export class Leveler {
  private guild: string;
  private tatsu_api: string | null = null;
  private lurkr_api: string | null = null;
  private amari_api: string | null = null;

  /**
   * Creates an instance of a Leveler, with which you'll be able to import leveling data from supported bots.
   *
   * @constructor
   * @param {string} guild Guild ID.
   * @param {?string} tatsu_api If importing from Tatsu, you need to bring in your own API key. This is free and pretty easy to get from the Tatsu bot itself.
   * @param {?string} lurkr_api If importing from Lurkr, you need to bring in your own API key. This is free and pretty easy to get from the Lurkr dashboard.
   * @param {?string} amari_api If importing from Amari, you need to bring in your own API key. This is honestly inconvenient to get, you need to request it in their Discord server.
   */
  constructor(options: {
    guild: string;
    tatsu_api?: string;
    lurkr_api?: string;
    amari_api?: string;
  }) {
    this.guild = options.guild;
    if (options.tatsu_api) this.tatsu_api = options.tatsu_api;
    if (options.lurkr_api) this.lurkr_api = options.lurkr_api;
    if (options.amari_api) this.amari_api = options.amari_api;
  }

  /** Gets the whole server leaderboard from a supported bot. Throws if unable to get it. */
  public async GetLeaderboard(
    target: SupportedBots,
  ): Promise<BaseUserLevels[] | StandardUserLevels[]> {
    if (target == SupportedBots.MEE6) {
      const levels = await MEE6GetLeaderboard(this.guild);
      return levels.map((u) => {
        return {
          uid: u.id,
          lvl: u.level,
          current_xp: u.xp.totalXp,
        };
      });
    } else if (target === SupportedBots.LURKR) {
      const levels = await LURKRGetLeaderboard(this.lurkr_api, this.guild);
      return levels.map((u) => {
        return {
          uid: u.userId,
          lvl: u.level,
          current_xp: u.xp,
        };
      });
    } else if (target === SupportedBots.AMARI) {
      const levels = await AMARIGetLeaderboard(this.amari_api, this.guild);
      return levels.map((u) => {
        return {
          uid: u.id,
          lvl: u.level,
          current_xp: Number(u.exp),
        };
      });
    } else {
      const levels = await TATSUGetLeaderboard(this.tatsu_api, this.guild);
      return levels.map((u) => {
        return {
          uid: u.user_id,
          current_xp: u.score,
        };
      });
    }
  }
}
