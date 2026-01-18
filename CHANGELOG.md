# DJS Level Importer changelog

## 1.2.0

- Added bots:
  - **Amari** (grants `BaseUserLevels`, including `current_xp`)
  - (We probably will rework the way data is returned in a future release)

## 1.1.0

- Added bots:
  - **Lurkr** (grants `FullUserLevels`, omitting `current_lvl_xp`)
- Changed:
  - Marked `current_lvl_xp` as deprecated and discouraged its use. It's not changed, though.
  - The `GetLeaderboard()` method no longer uses overloads, as a fix for its typing.

## 1.0.0 to 1.0.2

Initial release. Needed a few patches just to fix publishing, no changes were made.
