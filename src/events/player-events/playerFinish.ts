import { GuildQueueEvent, Player } from "discord-player";
import {EmbedBuilder, hyperlink} from "discord.js";
import {transcode} from "node:buffer";

export default (player: Player): void => {
	player.events.on(GuildQueueEvent.PlayerFinish, async (queue, track) => {
		const channel = queue.metadata?.channel;
		if (!channel) {
			console.warn("Keine Metadata oder kein Channel in der Queue vorhanden.");
			return;
		}

		const embed = new EmbedBuilder()
			.setTitle("Song Finished")
			.setDescription(`Finished playing: ${hyperlink(track.title, track.url)} (ID: ${track.id})`)
			.setColor("Blue")
			.setTimestamp();

		await channel.send({ embeds: [embed] });
	});
};
