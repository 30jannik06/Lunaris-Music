import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { useQueue } from "discord-player";

export const data = new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Display the currently playing song")
    .setDescriptionLocalizations({
      de: "Anzeige des aktuell gespielten Titels",
      "en-US": "Display the currently playing song"
    })

export async function execute(interaction: ChatInputCommandInteraction) {
  const queue = useQueue();

  if (!queue) {
    const embed = new EmbedBuilder()
        .setTitle("Now Playing")
        .setDescription("This server does not have an active player session.")
        .setColor("Red")
        .setTimestamp();
    return interaction.reply({ embeds: [embed] });
  }

  const currentSong = queue.currentTrack;
  if (!currentSong) {
    const embed = new EmbedBuilder()
        .setTitle("Now Playing")
        .setDescription("No song is currently playing.")
        .setColor("Yellow")
        .setTimestamp();
    return interaction.reply({ embeds: [embed] });
  }

  const embed = new EmbedBuilder()
      .setTitle("Now Playing")
      .setDescription(`**[${currentSong.title}](${currentSong.url})**\nby ${currentSong.author}`)
      .setThumbnail(currentSong.thumbnail || "")
      .setColor("Blue")
      .setTimestamp();

  return interaction.reply({ embeds: [embed] });
}
