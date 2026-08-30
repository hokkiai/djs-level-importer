# HonLvlImport

## 2.0.0 (unreleased)

- Breaking changes:
  - Migrated to a new package name, owner and registry (SubeteDesu/HonLvlImport
    at JSR.io).
  - Reworked a bit the data return types. Breaking. Now everything returns the
    same `UserLevels` interface.
- Added:
  - Level rewards import from MEE6.
- Changed:
  - Now the package is zero-dependency while still supporting all bots. Install
    ~75% smaller.

## 1.2.0

- Added bots:
  - **Amari** (grants `BaseUserLevels`, including `current_xp`)
  - (We probably will rework the way data is returned in a future release)

## 1.1.0

- Added bots:
  - **Lurkr** (grants `FullUserLevels`, omitting `current_lvl_xp`)
- Changed:
  - Marked `current_lvl_xp` as deprecated and discouraged its use. It's not
    changed, though.
  - The `GetLeaderboard()` method no longer uses overloads, as a fix for its
    typing.

## 1.0.0 to 1.0.2

Initial release. Needed a few patches just to fix publishing, no changes were
made.
