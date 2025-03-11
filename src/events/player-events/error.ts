import { GuildQueueEvent, Player } from "discord-player";

export default (player: Player): void => {
  player.events.on(GuildQueueEvent.Error, async (queue, error) => {
    console.log(`General player error event: ${error.message}`);
    console.log(error);
  });
};
