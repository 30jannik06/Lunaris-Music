import {GuildQueueEvent, Player} from "discord-player";

export default (player: Player): void => {
	player.events.on(GuildQueueEvent.Error, async (queue, error) => {

		console.log(`Player error event: ${error.message}`);
		console.log(error);
	})
}
