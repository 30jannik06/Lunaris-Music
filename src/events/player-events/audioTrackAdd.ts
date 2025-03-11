import { GuildQueueEvent, Player } from "discord-player";

export default (player: Player): void => {
  player.events.on(GuildQueueEvent.AudioTrackAdd, (queue, track) => {
    const timestamp = new Date().toLocaleString();
    const channel = queue.metadata?.channel;
    if (!channel) {
      console.warn(
        `[${timestamp}] WARN: Keine Metadata oder kein Channel in der Queue vorhanden.`,
      );
      return;
    }
    //console.log(`[${timestamp}] INFO: Track "${track.title}" wurde der Queue hinzugefügt!`);
  });
};
