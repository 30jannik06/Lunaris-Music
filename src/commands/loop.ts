import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder,} from "discord.js";
import {QueueRepeatMode, useQueue} from "discord-player";

export const data = new SlashCommandBuilder()
	.setName("loop")
	.setDescription("Loop the queue in different modes")
	.setDescriptionLocalizations({
		de: "Schleife in der Warteschlange in verschiedenen Modi",
		"en-US": "Loop the queue in different modes"
	})
	.addNumberOption((option) =>
		option
			.setName("mode")
			.setDescription("The loop mode")
			.setDescriptionLocalizations({
				de: "Der Schleifenmodus",
				"en-US": "The loop mode",
			})
			.setRequired(true)
			.addChoices(
				{
					name: "off",
					value: QueueRepeatMode.OFF,
				},
				{
					name: "Track",
					value: QueueRepeatMode.TRACK,
				},
				{
					name: "Queue",
					value: QueueRepeatMode.QUEUE,
				},
				{
					name: "Autoplay",
					value: QueueRepeatMode.AUTOPLAY,
				},
			),
	);

export async function execute(interaction: ChatInputCommandInteraction) {
	const queue = useQueue();

	if (!queue) {
		return interaction.reply({
			content: "This server does not have an active player session",
			ephemeral: true,
		});
	}

	// Hol den Wert; da das Option-Feld "required" ist, wird hier ein Wert geliefert.
	const loopMode = interaction.options.getNumber("mode")!;
	queue.setRepeatMode(loopMode as QueueRepeatMode);

	// Erstelle ein Mapping für die Namen der Repeat-Modi
	const repeatModeNames: Record<QueueRepeatMode, string> = {
		[QueueRepeatMode.OFF]: "off",
		[QueueRepeatMode.TRACK]: "track",
		[QueueRepeatMode.QUEUE]: "queue",
		[QueueRepeatMode.AUTOPLAY]: "autoplay",
	};

	// Erstelle ein Embed mit den Ergebnissen
	const embed = new EmbedBuilder()
		.setTitle("Loop Mode Updated")
		.setDescription(
			`Loop mode set to **${repeatModeNames[loopMode as QueueRepeatMode]}**`,
		)
		.setColor("Blue")
		.setTimestamp();

	return interaction.reply({embeds: [embed]});
}
