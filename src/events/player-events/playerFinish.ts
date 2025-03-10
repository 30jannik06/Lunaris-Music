import { GuildQueueEvent, Player } from "discord-player";

export default (player: Player): void => {
	player.events.on(GuildQueueEvent.PlayerFinish, async (queue, track) => {
		const channel = queue.metadata?.channel;
		if (!channel) {
			console.warn("Keine Metadata oder kein Channel in der Queue vorhanden.");
			return;
		}
		await channel.send(`Finished playing **${track.id}**`);
	});
};
