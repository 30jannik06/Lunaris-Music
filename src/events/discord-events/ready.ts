import {Client} from "discord.js";
import {deployCommands} from "../../deploy-commands";
import {config} from "../../config";

export default (client: Client): void => {
	client.once("ready", async () => {
		console.log("Discord bot is Ready!");
		//await deployCommands({ guildId: config.DISCORD_GUILD_ID });
	});
};
