# anko-bot

A Discord bot written in Node.js using discord.js. Provides modular command and event handling plus background workers for reminders, giveaways, unmute checks, and Twitter monitoring. Designed to be extended by adding command modules under `commands/` and background workers under `functions/`.
(Last edit in 2023)

## Stack

- **Language:** JavaScript (Node.js)
- **Runtime / Framework:** Node.js + discord.js
- **Notable libraries:** discord.js, dotenv

## Features

- Auto-loading command handler (commands are discovered at runtime by folder)
- Event handler loader for Discord events
- Background workers for:
  - Twitter monitoring
  - Unmute checks
  - Giveaway checks
  - Reminder checks
- Simple filesystem-based command organization for easy extension

## Repository Layout

    index.js                  # Main entry: initializes Discord client, starts background functions, loads handlers
    handlers/
      command_handler.js      # Loads commands from commands/<category> and registers on client.commands
      event_handler.js        # Loads event handlers and registers them on the client
    commands/                 # Add command categories and .js command files here
    functions/                # Background tasks and utilities (twitter, checks, reminders, etc.)
    events/                   # Event-specific handlers (if present)
    database/                 # Persistence layer / DB files (if used)
    assets/                   # Static assets (images, etc.)
    Procfile                 # Process configuration for some deployment platforms
    package.json              # Dependency manifest
    package-lock.json         # Lockfile
    node_modules/             # Vendored dependencies (may be present)
    .gitignore

## Quick Start (Local)

1. Clone the repository:

       git clone https://github.com/thecloakmaster/anko-bot.git
       cd anko-bot

2. Install dependencies:

       npm install

3. Create a `.env` file in the project root and add at minimum:

       token=YOUR_DISCORD_BOT_TOKEN

   `index.js` calls `client.login(process.env.token)`, so the environment variable must be named `token`.

4. Start the bot:

       node index.js

## Configuration / Environment Variables

### Required

- `token` — Discord bot token

### Twitter

Likely required if Twitter features are enabled. Check files under `functions/` for exact names:

- `TWITTER_CONSUMER_KEY`
- `TWITTER_CONSUMER_SECRET`
- `TWITTER_ACCESS_TOKEN`
- `TWITTER_ACCESS_SECRET`

Database connection strings or other service credentials may be required depending on what is used in `database/` or `functions/`.

## Adding Commands and Events

### Commands

Place command files under:

    commands/<category>/

Each command file should export a `name` and an `execute` function, and optionally `description`, `usage`, `aliases`, etc.

Minimal example:

    // commands/util/ping.js

    module.exports = {
        name: 'ping',
        description: 'Replies with Pong!',

        async execute(message, args) {
            await message.channel.send('Pong!');
        }
    };

The command handler automatically registers commands on startup.

### Events

Add event handler files under `events/` or follow the pattern used by `handlers/event_handler.js` to load and register event callbacks.

## Deployment

A `Procfile` is present for platforms that support it, such as Heroku and some process managers.

Ensure all required environment variables are configured in the target environment before starting the bot.

## Troubleshooting

- **Bot fails to login:** Check that `token` is set and correct.
- **Background workers crash:** Check console logs. `index.js` prints unhandled rejection errors.
- **Commands not loaded:** Ensure commands live in a subfolder inside `commands/` and export the expected shape.

## Contributing

- Open issues or PRs describing the change.
- Follow the repository's CommonJS style (`require` / `module.exports`).
- Add tests or examples for new command modules where possible.
