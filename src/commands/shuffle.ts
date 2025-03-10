import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { useQueue } from "discord-player";
import { config } from "../config";

export const data = new SlashCommandBuilder()
	.setName("shuffle")
	.setDescription("Shuffle the tracks in the queue");

export async function execute(interaction: ChatInputCommandInteraction) {
	// Nutze entweder die Guild-ID aus der Interaktion oder aus der Config
	const guildID = interaction.guild?.id || config.DISCORD_GUILD_ID;
	if (!guildID) {
		const embed = new EmbedBuilder()
			.setTitle("Fehler")
			.setDescription("Die Guild-ID ist nicht in der Config gesetzt.")
			.setColor("Red")
			.setTimestamp();
		return interaction.reply({ embeds: [embed] });
	}

	const queue = useQueue(guildID);
	if (!queue) {
		const embed = new EmbedBuilder()
			.setTitle("Player Error")
			.setDescription("This server does not have an active player session.")
			.setColor("Red")
			.setTimestamp();
		return interaction.reply({ embeds: [embed] });
	}

	if (queue.tracks.size < 2) {
		const embed = new EmbedBuilder()
			.setTitle("Shuffle Error")
			.setDescription("There are not enough tracks in the queue to shuffle.")
			.setColor("Yellow")
			.setTimestamp();
		return interaction.reply({ embeds: [embed] });
	}

	queue.tracks.shuffle();

	const embed = new EmbedBuilder()
		.setTitle("Queue Shuffled")
		.setDescription(`Shuffled ${queue.tracks.size} tracks!`)
		.setColor("Green")
		.setTimestamp();

	return interaction.reply({ embeds: [embed] });
}
