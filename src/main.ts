import { AMARIGetLeaderboard } from "./amari.js";
import { LURKRGetLeaderboard } from "./lurkr.js";
import { MEE6GetLeaderboard, MEE6GetRewards } from "./mee6.js";
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
 * A user's leveling information, in a common format **with levels**.
 *
 * @interface UserLevels
 */
export interface UserLevels {
  /** User ID. */
  uid: string;
  /** Current XP **in total**. */
  current_xp: number;
  /** Current level. Might be `undefined` on minimal leveling bots (i.e. Tatsu). */
  lvl?: number;
}

/**
 * A server's level rewards in a common format.
 *
 * @interface LevelRewards
 */
export interface LevelRewards {
  /** Level at which the reward is granted. */
  lvl: number;
  /** Role IDs. */
  roles: string[];
  /** Channel IDs.
   * IMPORTANT: This is always empty.
   */
  channels: string[];
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
export const enum Supported {
  MEE6 = 0,
  TATSU = 1,
  LURKR = 2,
  AMARI = 3,
}

/**
 * Supported Discord bots for which you may also get level rewards
 *
 * ```ts
 * MEE6 = 0
 * ```
 */
export const enum SupportedAndRewarded {
  MEE6 = 0,
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
  public async GetLeaderboard(target: Supported): Promise<UserLevels[]> {
    if (target == Supported.MEE6) {
      const levels = await MEE6GetLeaderboard(this.guild);
      return levels.map((u) => {
        return {
          uid: u.id,
          lvl: u.level,
          current_xp: u.xp.totalXp,
        };
      });
    } else if (target === Supported.LURKR) {
      const levels = await LURKRGetLeaderboard(this.lurkr_api, this.guild);
      return levels.map((u) => {
        return {
          uid: u.userId,
          lvl: u.level,
          current_xp: u.xp,
        };
      });
    } else if (target === Supported.AMARI) {
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

  /** Gets the server's level rewards from a supported bot. Throws if unable to get them. */
  public async GetRewards(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _target: SupportedAndRewarded,
  ): Promise<LevelRewards[]> {
    const rewards = await MEE6GetRewards(this.guild);

    return rewards.map((r) => {
      return {
        lvl: r.rank,
        roles: [r.role.id],
        channels: [],
      };
    });
  }
}
