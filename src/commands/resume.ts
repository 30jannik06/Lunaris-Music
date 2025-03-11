import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder,} from "discord.js";
import {useTimeline} from "discord-player";

export const data = new SlashCommandBuilder()
	.setName("resume")
	.setDescription("Resume the currently playing song")
	.setDescriptionLocalizations({
		de: "Fortsetzen des aktuell gespielten Titels",
		"en-US": "Resume the currently playing song"
	})

export async function execute(interaction: ChatInputCommandInteraction) {
	const timeline = useTimeline();

	if (!timeline) {
		const embed = new EmbedBuilder()
			.setTitle("Player Error")
			.setDescription("This server does not have an active player session.")
			.setColor("Red")
			.setTimestamp();
		return interaction.reply({embeds: [embed]});
	}

	if (timeline.paused) {
		timeline.resume();
		const embed = new EmbedBuilder()
			.setTitle("Resumed")
			.setDescription("The player is now playing.")
			.setColor("Blue")
			.setTimestamp();
		return interaction.reply({embeds: [embed]});
	} else {
		const embed = new EmbedBuilder()
			.setTitle("Already Playing")
			.setDescription("The player is already playing.")
			.setColor("Yellow")
			.setTimestamp();
		return interaction.reply({embeds: [embed]});
	}
}
