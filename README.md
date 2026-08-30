<div align="center">
<br><h1>HonLvlImport</h1>
  <br>An open-source JavaScript library for importing leveling data from MEE6 and other bots.<br>
  <br><br><img height="100" src="https://raw.githubusercontent.com/sokoradesu/honlvlimport/refs/heads/master/assets/sokoraXhokki.png?raw=true">
  <br>Made jointly by the <a href="https://sokora.org">Sokora</a> and <a href="https://bot.hokki.app">Hokki</a> Discord bots.
</div>
<br>
<br>

## Usage

Install `@subetedesu/honlvlimport` from JSR (not npm!) with your package manager
of choice. It should work in any JavaScript runtime and, if transpiled to JS, in
your browser too.

```bash
pnpm install jsr:@subetedesu/honlvlimport
```

Instantiate the `Leveler` class (exported by this package) providing the ID of
the guild you want to import data from. Then, call the `GetLeaderboard` method,
passing, for example, a `0` for MEE6 (more onto this later on).

```ts
import { Leveler, Supported } from "@subetedesu/honlvlimport";

const leveler = new Leveler({
  guild: "903852579837059113", // your server's ID
});

const leveling_data = await leveler.GetLeaderboard(Supported.LURKR);
```

You will be given an array of objects matching this interface:

```ts
export interface UserLevels {
  /** User ID. */
  uid: string;
  /** Current XP **in total**. */
  current_xp: number;
  /** Current level. Might be `undefined` on minimal leveling bots (i.e. Tatsu). */
  lvl?: number;
}
```

> [!IMPORTANT]
> `UserLevels.lvl` will be `undefined` for Tatsu.

After that, you might want to import level rewards too. Use `GetRewards` for
that.

```ts
const rewards = await leveler.GetRewards(SupportedAndRewarded.MEE6);
```

> [!IMPORTANT]
> `GetRewards()` takes a different enum `SupportedAndRewarded`, which matches
> integers with `Supported` but is a subset of this, including fewer bots. Not
> everyone has level rewards.

You'll be returned an array of these:

```ts
export interface LevelRewards {
  /** Level at which the reward is granted. */
  lvl: number;
  /** Role IDs. */
  roles: string[];
  /** Channel IDs. */
  channels: string[];
}
```

> [!IMPORTANT]
> In practice don’t expect channels to work yet (you’ll always get an empty
> array), as only MEE6 supports getting level rewards and it doesn't have
> channel rewards that we know of. This will most likely change as we improve
> bot support.

## Bot support

As of now, MEE6, Lurkr, Tatsu and Amari are supported. Most bots don't document
their APIs and it's therefore difficult to add new bots, so no guarantees are
made; however we do try to add new bots to this library. You can check
[`TODO.md`](./TODO.md) at the root of this repo for a list of planned (or
discarded) bots, and you may suggest any bot you know about that isn't listed
there by opening an issue.

**Bots are selected using integers** when calling `GetLeaderboard` and
`GetRewards`. You can check integer-bot associations by looking at the exported
`Supported` and `SupportedAndRewarded` TypeScript enums respectively.

Level rewards support is much more limited, for which only MEE6 works as of now.

### Per bot requirements

You need to take some actions before using the importer.

#### MEE6

You need to enable leaderboard visibility from your dashboard. Open the
leaderboard settings in the MEE6 dashboard and enable the option
`Make my server's leaderboard public`. Otherwise data cannot be imported.

#### Tatsu

You need an API key, obtained from
[dev.tatsu.gg](https://dev.tatsu.gg/api/reference#authentication) and passed to
the constructor via the `tatsu_api` parameter.

```ts
new Leveler({ guild: "...", tatsu_api: "123ABC..." });
```

#### Lurkr

You need an API key, obtained from
[lurkr.gg](https://lurkr.gg/docs/api#authentication) and passed to the
constructor via the `lurkr_api` parameter.

```ts
new Leveler({ guild: "...", lurkr_api: "123ABC..." });
```

Additionally, you need to grant specific permissions for the server you want to
import from. Check the same link, it describes this immediately after explaining
how to get your API key.

Lastly, you need to manually change
`Choose the visibility for the web leaderboard` in Lurkr's dashboard to
`Public`.

#### Amari

You need an API key, obtained by manually requesting it from Amari's Discord
server at [this link](https://amaribot.com/support) and passed to the
constructor via the `amari_api` parameter.

```ts
new Leveler({ guild: "...", amari_api: "123ABC..." });
```

> [!NOTE]
> It's worth noting we tried to get it ourselves to test and were told that
> they're currently not issuing API keys as they're redoing the system or
> something like that.

## FAQ

### How to contribute?

By achieving to properly fetch leveling data from any Discord bot that supports
it via HTTP, that’s really it. There isn’t any hard requirement on code quality,
so long as you don’t do anything atrocious.

Improving the existing code is also a great way to help, be it making it of
higher quality or more performant, or fixing issues we weren’t aware of. If
fixing stuff is too much for you but at least you’re aware of an issue and can
properly explain it, raising an issue alone is already enough help.

You’ll be credited for any contribution you make.

### What’s up with the name?

Replace `Hon` with `Lib`, `Lvl` with `Level` and it might make more sense to
you. We internally called this `liblevels` and the name resulted into this. Hon
means “book”, which is close enough to Lib(rary) in meaning, and is what we at
Subete use for code libraries by convention.

### License? Who to credit?

Originally made by [ZakaHaceCosas](https://me.zhc.es/) for the
[Sokora](https://sokora.org) and [Hokki](https://bot.hokki.app) Discord bots.
Made open source under the MIT license for everyone to use, so long as our work
is attributed (which'd make us really happy as reverse engineering some APIs was
a true pain, to be fair).

---

Copyright (c) 2025 Zakaria B. ("@ZakaHaceCosas")

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
