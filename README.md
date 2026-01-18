<div align="center">
<br><h1>Discord Level Importer</h1>
  <br>An open, JavaScript-based library for importing leveling data from MEE6 and other bots.<br>
  <br><br><a href="https://www.hokki.app"><img height="100" src="https://github.com/hokkiai/djs-level-importer/blob/master/assets/sokoraXhokki.png?raw=true"></a>
  <br>Made jointly by the <a href="https://sokora.org">Sokora</a> and <a href="https://www.hokki.app">Hokki</a> Discord bots.
</div>
<br>
<br>
<br>

## Usage

Install `@hokkiai/djs-level-importer` with your package manager of choice. It should work in any JavaScript runtime.

```bash
bun install @hokkiai/djs-level-importer
```

Instantiate the `Leveler` class (exported by this package) providing the ID of the guild you want to import data from. Then, call the `GetLeaderboard` method, passing, for example, a `0` for MEE6 (more onto this later on).

```ts
import { Leveler } from "@hokkiai/djs-level-importer";

const leveler = new Leveler({
  guild: "903852579837059113", // your server's ID
});

const leveling_data = await leveler.GetLeaderboard(0);
```

You will be given an array of objects matching either of these interfaces:

```ts
export interface BaseUserLevels {
  /** User ID. */
  uid: string;
  /** Current XP **in total**. */
  current_xp: number;
}

export interface FullUserLevels extends BaseUserLevels {
  /** Current XP **relative to the level**.
   *
   * Not all APIs return this, therefore it's optional.
   */
  current_lvl_xp?: number;
  /** Current level. */
  lvl: number;
  /** XP required to level up. */
  next_lvl_xp: number;
}
```

> [!IMPORTANT]
> You'll be returned **`BaseUserLevels`** objects when importing data from **Tatsu** and **`FullUserLevels`** ones when importing from **MEE6** or **Lurkr**.

This interface division is not the most intuitive, but the best thing we can do to provide you with all _possible_ data despite Tatsu not providing these extra fields that other bots provide.

**Bear in mind that extensions to bot support may or may not result in breaking changes to these interfaces** (we'll try to avoid them as much as we can).

> [!CAUTION]
> About already planned breaking changes:
>
> - The `current_lvl_xp` property wasn't too well thought and we'll probably remove it (by the next major, to comply with SemVer). Avoid depending on it.

## Bot support

As of now, MEE6, Lurkr, and Tatsu are supported. Most bots don't document their APIs and it's therefore difficult to add new bots, so no guarantees are made; however we do try to add new bots to this library.

**Bots are selected using integers** when calling `GetLeaderboard`. You can check int-bot associations by looking at the exported `SupportedBots` enum. Or just look at it here:

```ts
export enum SupportedBots {
  MEE6 = 0,
  TATSU = 1,
  LURKR = 2,
  AMARI = 3,
}
```

### Per bot requirements

You need to take some actions before using the importer.

#### MEE6

You need to enable leaderboard visibility from your dashboard. Open the leaderboard settings in the MEE6 dashboard and enable the option `Make my server's leaderboard public`. Otherwise data cannot be imported.

#### Tatsu

You need an API key, obtained from [this link](https://dev.tatsu.gg/api/reference#authentication) and passed to the constructor via the `tatsu_api` parameter.

```ts
new Leveler({ guild: "...", tatsu_api: "123ABC..." });
```

#### Lurkr

You need an API key, obtained from [this link](https://lurkr.gg/docs/api#authentication) and passed to the constructor via the `lurkr_api` parameter.

```ts
new Leveler({ guild: "...", lurkr_api: "123ABC..." });
```

Additionally, you need to grant specific permissions for the server you want to import from. Check the same link, it describes this immediately after explaining how to get your API key.

Lastly, you need to manually change `Choose the visibility for the web leaderboard` in Lurkr's dashboard to `Public`.

<!-- #### Atlas

Nothing is required. -->

#### Amari

You need an API key, obtained by manually requesting it from Amari's Discord server at [this link](https://amaribot.com/support) and passed to the constructor via the `amari_api` parameter.

```ts
new Leveler({ guild: "...", amari_api: "123ABC..." });
```

> It's worth noting we tried to get it ourselves to test and were told that they're currently not issuing API keys as they're redoing the system or something like that.

## Credits and license

Originally made by [ZakaHaceCosas](https://zakahacecosas.github.io/) for the [Hokki](https://www.hokki.app) and [Sokora](https://sokora.org) Discord bots. Made open source under the MIT license for everyone to use, so long as our work is attributed (which'd make us really happy as reverse engineering some APIs was a true pain, to be fair).

---

Copyright (c) 2025 ZakaHaceCosas

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
