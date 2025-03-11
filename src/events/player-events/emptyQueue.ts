import {GuildQueueEvent, Player} from "discord-player";

export default (player: Player): void => {
	player.events.on(GuildQueueEvent.EmptyQueue, async (queue) => {
		const channel = queue.metadata?.channel;
		if (!channel) {
			console.warn("Keine Metadata oder kein Channel in der Queue vorhanden.");
			return;
		}
		console.log("Queue finished");
	});
};
