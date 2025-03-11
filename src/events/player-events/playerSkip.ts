import {GuildQueueEvent, Player} from "discord-player";
import {EmbedBuilder, hyperlink} from "discord.js";

export default (player: Player): void => {
	player.events.on(GuildQueueEvent.PlayerSkip, async (queue, track) => {
		const channel = queue.metadata?.channel;
		if (!channel) {
			console.warn("Keine Metadata oder kein Channel in der Queue vorhanden.");
			return;
		}
		const embed = new EmbedBuilder()
			.setTitle("Song Übersprungen")
			.setDescription(`Der Song ${hyperlink(track.title, track.url)} wurde übersprungen.`)
			.setColor("Orange")
			.setTimestamp();

		await channel.send({embeds: [embed]});
	});
};
