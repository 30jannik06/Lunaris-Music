import { GuildQueueEvent, Player } from "discord-player";

export default (player: Player): void => {
  player.events.on(GuildQueueEvent.EmptyChannel, async (queue) => {
    const { channel } = queue.metadata;

    await channel.send("Leaving because no vc activity for the past 5 minutes");
  });
};
