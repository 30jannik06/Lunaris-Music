import { GuildQueueEvent, Player } from "discord-player";

export default (player: Player): void => {
	player.events.on(GuildQueueEvent.Disconnect, async (queue) => {
		const channel = queue.metadata?.channel;
		if (!channel) {
			console.warn("Keine Metadata oder kein Channel in der Queue vorhanden.");
			return;
		}
		await channel.send('Looks like my job here is done, leaving now!');
	});
};
