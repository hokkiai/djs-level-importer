<!-- markdownlint-disable md024 -->
<!-- preserve old changelogs here -->

# Sokora Changelog

## 0.3.2

## Changed

- User can't use any commands in DMs (thanks @userandaname)
- You can use /user info for people outside of the server

## Fixed

- Top.gg reminders are fixed once more, now they should send **only** when you didn't vote
- Attempt to fix tempbans not unbanning the user due to Sokora not finding them through the cache (by fetching the ban list instead)
- "Unknown guild" error in serverboard

## Removed

- Executor in message delete events

## 0.3.1

## Changed

- Made /help, /about, /changelog, /credits, /ping, /settings and /user settings ephemeral (only visible to you)
- Sokora alerts server owners if they enable but misconfigure showing a server invite in serverboard

## Fixed

- Fixed issues with timestamps
- Fixed some moderation commands "failing" (even though they did the job)
- Fixed invites for serverboard sometimes silently failing to create or crashing /serverboard
- Fixed topgg reminders
- Some internal fixes

## 0.3.0

### Added

- New commands.
  - Added a new `/games` category.
    - Added `/games rps` to play Rock, Paper, Scissors.
    - Added `/games coin` to flip a coin.
  - Added a new `/math` category.
    - Added `/math graph` to graphically represent a function.
    - Added `/math calc` to execute a mathematical expression.
  - Added `/help variables` to show help with _Dynamic (variables)_.
  - Added `/ping` to view bot ping and latency.
- Dynamic (variables)
  - Gave a proper name to replaceable variables (`Dynamic (variables)`), and added more options:
  - - `(serverowner)` - Server owner's name
  - - `(currentdate)` - Current date in the 'July 10, 2025' format
  - - `(currentdate, simple)` - Current date in the '7/10/25' format
  - - `(currentdate, detailed)` - Current date in the 'July 10, 2025, at 1:11 PM' format
- User settings
  - Added user settings as a feature.
    - Added TopGG reminders setting.
- Moderation
  - Added the ability to clear messages for a single user.
  - Added reason field to `/moderation unmute`.
  - Added the ability to silently perform moderation actions.
  - Added the ability to view all cases of a server, and to filter by case type.
- Other additions
  - Added a starboard. It can be configured from `/settings starboard`.
  - Added unique member count to `/about`.
  - Added the ability for server owners to display an invite link to their servers from the serverboard.
- Easter eggs
  - Added two new easter eggs.
- Settings
  - Enable/disable specific easter eggs.
  - Enable easter eggs in specific channels only.
  - Give roles to users when they join.
  - Now you can set different channels for join and leave messages.
  - Whether to show an invite to your server or not in serverboard.
    - What channel the invite should point to.
  - Whether all moderation actions should be silent or not.
  - What kind of moderation events should be logged.
  - Settings for the new starboard feature.
    - Channel to send starred messages to, emoji to be reacted, and reaction threshold.

### Changed

- Settings were rebuilt into completely new settings panes that allow to change settings from the own embed, without using commands.

### Fixed

- News
  - Fixed not being able to delete the first new you create.
- Moderation
  - Fixed the bot crashing because of too large messages being deleted.
  - Fixed a `Jump to message` option being shown on deleted messages (you cannot jump to a deleted message).
  - Fixed the bot showing "Application didn't respond" when unmuting someone muted by another bot.
  - Fixed the bot unable to send a moderation log when a deleted / edited message is too large. It will instead upload two text files containing old and new messages.
- _Many other fixes were made, not all of them are tracked._

### Removed

- Moderation
  - Removed the ability to add notes on users.
- Settings
  - Commands to change settings. Use the new embeds to change settings from there.
- Changelog
  - Changelog itself won't be shown in embeds anymore (it's too long). `/changelog` will show a link to this file.

---

## 0.2.0

### Added

#### Commands

- `/changelog`
- `/credits`
- `/moderation notes`

### Changed

- The bot will remove levels when an admin changed the leveling difficulty
- Now `/leaderboard` shows 6 users per page instead of 5
- When you add the bot, it sends a message in the system channel
- Remade the message logs
- Edit logs will let you jump to the message that got edited

#### /settings

- Autocompletes with channels/users/roles (you don't have to copy IDs now :tada:)
- In the embed it will show links to channels/users/roles instead of showing IDs

#### /about

- Vote button added
- Moved credits into a different command to reduce the height of the embed

### Fixed

#### News

- Major issue related to the database, where the guild wasn't provided to ensure that news would be unique to every server, **thank you @Golem642!!!!**
- `/news` edit's modal errored when sending

#### Moderation commands

- `/moderation clear` removed one more message than the user provided
- `/moderation unban` errored internally (it should send an error embed) when the user didn\'t have the "Ban Members" permission

### Typos

- warn mentions in `/moderation warn` are now warning to be more consistent
- Removed old markdown remnants from `/moderation slowdown`

## 0.1.0

### Initial release :)
