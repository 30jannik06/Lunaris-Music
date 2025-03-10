import { Client, GatewayIntentBits } from "discord.js";
import { config } from "./config";


import { Player } from "discord-player";
import { DefaultExtractors } from "@discord-player/extractor";
import {playerEvents} from "./events/player-events";
import {discordEvents} from "./events/discord-events";

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildVoiceStates,
	]
});

export const player = new Player(client);

(async () => {
	await player.extractors.loadMulti(DefaultExtractors);

	for (const discordEventHandler of Object.values(discordEvents)) {
		discordEventHandler(client);
	}

	for (const playerEventHandler of Object.values(playerEvents)) {
		playerEventHandler(player);
	}

	// Melde dich beim Client an
	await client.login(config.DISCORD_TOKEN);
})();
