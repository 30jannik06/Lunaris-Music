import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { useTimeline } from "discord-player";

export const data = new SlashCommandBuilder()
	.setName("pause")
	.setDescription("Pause the currently playing song");

export async function execute(interaction: ChatInputCommandInteraction) {
	const timeline = useTimeline();

	if (!timeline) {
		const embed = new EmbedBuilder()
			.setTitle("Player Error")
			.setDescription("This server does not have an active player session.")
			.setColor("Red")
			.setTimestamp();
		return interaction.reply({ embeds: [embed] });
	}

	if (!timeline.paused) {
		timeline.pause();
		const embed = new EmbedBuilder()
			.setTitle("Paused")
			.setDescription("The player is now paused.")
			.setColor("Blue")
			.setTimestamp();
		return interaction.reply({ embeds: [embed] });
	} else {
		const embed = new EmbedBuilder()
			.setTitle("Already Paused")
			.setDescription("The player is already paused.")
			.setColor("Yellow")
			.setTimestamp();
		return interaction.reply({ embeds: [embed] });
	}
}
