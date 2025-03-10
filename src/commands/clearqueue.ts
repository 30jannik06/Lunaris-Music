import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {useQueue} from "discord-player";
import {config} from "../config";

export const data = new SlashCommandBuilder()
	.setName("clearqueue")
	.setDescription("Clear all upcoming songs while keeping the current track");

export async function execute(interaction: ChatInputCommandInteraction) {
	// Sofortige DeferReply, um "Unknown interaction" zu vermeiden
	await interaction.deferReply();

	// Nutze entweder die Guild-ID aus der Interaktion oder aus der Config
	const guildID = interaction.guild?.id || config.DISCORD_GUILD_ID;
	if (!guildID) {
		return interaction.editReply("Die Guild-ID ist nicht in der Config gesetzt.");
	}

	// Hole die Queue für den Server
	const queue = useQueue(guildID);
	if (!queue) {
		const embed = new EmbedBuilder()
			.setTitle("Player Error")
			.setDescription("This server does not have an active player session.")
			.setColor("Red")
			.setTimestamp();
		return interaction.editReply({embeds: [embed]});
	}

	// Anzahl der anstehenden Songs speichern und dann die Queue (außer den aktuell laufenden Song) leeren
	const upcomingCount = queue.tracks.size;
	queue.tracks.clear();

	const embed = new EmbedBuilder()
		.setTitle("Queue Cleared")
		.setDescription(`Es wurden **${upcomingCount}** anstehende Songs entfernt.\nAktuell läuft: **${queue.currentTrack ? queue.currentTrack.title : "Kein Song"}**`)
		.setColor("Green")
		.setTimestamp();

	return interaction.editReply({embeds: [embed]});
}
