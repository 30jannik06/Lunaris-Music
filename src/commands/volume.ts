import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {useQueue} from "discord-player";

export const data = new SlashCommandBuilder()
	.setName("volume")
	.setDescription("Setzt die Lautstärke des Musikplayers")
	.setDescriptionLocalizations({
		de: "Setzt die Lautstärke des Musikplayers",
		"en-US": "Sets the volume of the music player"
	})
	.addIntegerOption(option =>
		option
			.setName("level")
			.setDescription("Volume between 1 and 100")
			.setDescriptionLocalizations({
				de: "Lautstärke zwischen 1 und 100",
				"en-US": "Volume between 1 and 100",
			})
			.setRequired(true)
	);

export async function execute(interaction: ChatInputCommandInteraction) {
	// Stelle sicher, dass der Befehl in einem Server ausgeführt wird
	if (!interaction.guildId) {
		return interaction.reply("Dieser Befehl kann nur in einem Server verwendet werden.");
	}

	// Versuche, die aktive Queue zu erhalten
	const queue = useQueue(interaction.guildId);
	if (!queue) {
		const embed = new EmbedBuilder()
			.setTitle("Keine aktive Sitzung")
			.setDescription("Es läuft keine aktive Musiksitzung auf diesem Server.")
			.setColor("Red")
			.setTimestamp();
		return interaction.reply({embeds: [embed]});
	}

	// Hole die gewünschte Lautstärke (zwischen 1 und 100)
	const level = interaction.options.getInteger("level", true);
	if (level < 1 || level > 100) {
		const embed = new EmbedBuilder()
			.setTitle("Ungültige Lautstärke")
			.setDescription("Bitte gib eine Lautstärke zwischen 1 und 100 an.")
			.setColor("Yellow")
			.setTimestamp();
		return interaction.reply({embeds: [embed]});
	}

	try {
		// Setze die Lautstärke
		queue.node.setVolume(level);

		const embed = new EmbedBuilder()
			.setTitle("Lautstärke gesetzt")
			.setDescription(`Die Lautstärke wurde auf **${level}** gesetzt.`)
			.setColor("Green")
			.setTimestamp();
		return interaction.reply({embeds: [embed]});
	} catch (error) {
		console.error("Error setting volume:", error);
		const embed = new EmbedBuilder()
			.setTitle("Fehler")
			.setDescription("Beim Einstellen der Lautstärke ist ein Fehler aufgetreten.")
			.setColor("Red")
			.setTimestamp();
		return interaction.reply({embeds: [embed]});
	}
}
