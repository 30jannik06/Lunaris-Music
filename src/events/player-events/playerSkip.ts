import { GuildQueueEvent, Player } from "discord-player";

export default (player: Player): void => {
	player.events.on(GuildQueueEvent.PlayerSkip, async (queue, track) => {
		const channel = queue.metadata?.channel;
		if (!channel) {
			console.warn("Keine Metadata oder kein Channel in der Queue vorhanden.");
			return;
		}
		await channel.send(`Skipping **${track.title}** due to an issue!`);
	});
};
