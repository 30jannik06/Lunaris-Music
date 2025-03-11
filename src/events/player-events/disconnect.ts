import { GuildQueueEvent, Player } from "discord-player";
import { EmbedBuilder } from "discord.js";

export default (player: Player): void => {
  player.events.on(GuildQueueEvent.Disconnect, async (queue) => {
    const timestamp = new Date().toLocaleString();
    const channel = queue.metadata?.channel;
    if (!channel) {
      console.warn(`[${timestamp}] WARN: Keine Metadata oder kein Channel in der Queue vorhanden.`);
      return;
    }
    const embed = new EmbedBuilder()
        .setTitle("Disconnected")
        .setDescription("Looks like my job here is done, leaving now!")
        .setColor("Orange")
        .setTimestamp();
    await channel.send({ embeds: [embed] });
  });
};
