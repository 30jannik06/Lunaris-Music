# Lunaris-Music

## Description
Lunaris-Music is a powerful and feature-rich Discord music bot that provides high-quality audio streaming from various sources, including YouTube and Spotify.

## Features
- High-quality music streaming
- Supports YouTube, Spotify, and SoundCloud
- Queue system with playlist support
- User-friendly commands for playback control
- Volume control and filters (bass boost, nightcore, etc.)
- Slash command support
- Auto-reconnect and seamless playback

## Folder Structure
```
Lunaris-Music/
│-- .idea/
│-- node_modules/
│-- src/
│   ├── commands/
│   │   ├── addsong.ts
│   │   ├── clearqueue.ts
│   │   ├── index.ts
│   │   ├── loop.ts
│   │   ├── nowplaying.ts
│   │   ├── pause.ts
│   │   ├── ping.ts
│   │   ├── play.ts
│   │   ├── queue.ts
│   │   ├── resume.ts
│   │   ├── shuffle.ts
│   │   ├── skip.ts
│   ├── events/
│   │   ├── discord-events/
│   │   │   ├── index.ts
│   │   │   ├── interactionCreate.ts
│   │   │   ├── ready.ts
│   │   ├── player-events/
│   │   │   ├── audioTrackAdd.ts
│   │   │   ├── disconnect.ts
│   │   │   ├── emptyChannel.ts
│   │   │   ├── emptyQueue.ts
│   │   │   ├── error.ts
│   │   │   ├── index.ts
│   │   │   ├── playerError.ts
│   │   │   ├── playerFinish.ts
│   │   │   ├── playerSkip.ts
│   │   │   ├── playerStart.ts
│   ├── config.ts
│   ├── deploy-commands.ts
│   ├── index.ts
│-- .env
│-- .env.example
│-- .eslintrc
│-- .gitignore
│-- .ciattributes
```

## Commands
- `addsong` - Adds a song to the queue
- `clearqueue` - Clears the current queue
- `loop` - Toggles loop mode
- `nowplaying` - Displays the currently playing song
- `pause` - Pauses the current song
- `ping` - Checks the bot's latency
- `play` - Plays a song from a URL or search term
- `queue` - Displays the current song queue
- `resume` - Resumes paused music
- `shuffle` - Shuffles the current queue
- `skip` - Skips the current song

## Scripts
```json
{
  "dev": "tsx watch src/index.ts",
  "start": "node .",
  "build": "tsup src/index.ts --minify",
  "format": "prettier --write \"**/*.{json,ts}\"",
  "lint": "eslint . --ext ts --fix"
}
```

## Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/lunaris-music.git

# Navigate into the directory
cd lunaris-music

# Install dependencies
npm install  # Install required packages
```

## Usage
```bash
# Start the bot
npm run start
```

## Configuration
1. Create a `.env` file and configure the following environment variables:
   ```env
   DISCORD_TOKEN=
   DISCORD_CLIENT_ID=
   DISCORD_GUILD_ID=
   FFMPEG_PATH=
   ```
2. Obtain a bot token from the Discord Developer Portal.
3. Enable necessary intents in the bot settings.

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a pull request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
For any inquiries, please contact [your email or GitHub profile].

