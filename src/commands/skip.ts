import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder,} from "discord.js";
import {useQueue} from "discord-player";

export const data = new SlashCommandBuilder()
	.setName("skip")
	.setDescription("Skip the currently playing song")
	.setDescriptionLocalizations({
		de: "Überspringen des aktuell gespielten Titels",
		"en-US": "Skip the currently playing song"
	})

export async function execute(interaction: ChatInputCommandInteraction) {
	const queue = useQueue();

	if (!queue) {
		const embed = new EmbedBuilder()
			.setTitle("Player Error")
			.setDescription("This server does not have an active player session.")
			.setColor("Red")
			.setTimestamp();
		return interaction.reply({embeds: [embed]});
	}

	if (!queue.isPlaying()) {
		const embed = new EmbedBuilder()
			.setTitle("No Track Playing")
			.setDescription("There is no track playing.")
			.setColor("Yellow")
			.setTimestamp();
		return interaction.reply({embeds: [embed]});
	}

	queue.node.skip();

	const embed = new EmbedBuilder()
		.setTitle("Track Skipped")
		.setDescription("The current song has been skipped.")
		.setColor("Green")
		.setTimestamp();

	return interaction.reply({embeds: [embed]});
}
