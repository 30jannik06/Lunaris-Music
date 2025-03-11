import { GuildQueueEvent, Player } from "discord-player";
import { TextChannel } from "discord.js";

export default (player: Player): void => {
  player.events.on(GuildQueueEvent.PlayerStart, async (queue, track) => {
    const timestamp = new Date().toLocaleString();

    // Falls metadata oder channel nicht gesetzt ist, versuche einen Default-Channel zu finden.
    if (!queue.metadata || !queue.metadata.channel) {
      const defaultChannel = queue.guild.channels.cache.find(
        (ch) =>
          ch.isTextBased() &&
          (ch as TextChannel)
            .permissionsFor(queue.guild.members.me!)
            ?.has("SendMessages"),
      ) as TextChannel | undefined;

      if (defaultChannel) {
        queue.metadata = { channel: defaultChannel };
        console.log(
          `[${timestamp}] INFO: Default metadata set with channel: ${defaultChannel.id}`,
        );
      } else {
        console.warn(
          `[${timestamp}] WARN: Keine Metadata oder kein Channel in der Queue vorhanden, und kein Default gefunden.`,
        );
        return;
      }
    }

    //console.log(`[${timestamp}] INFO: Now playing: "${track.title}"`);
  });
};
