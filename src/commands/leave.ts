import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, MessageFlagsBitField } from "discord.js";
import { useQueue } from "discord-player";

export const data = new SlashCommandBuilder()
	.setName("leave")
	.setDescription("Disconnect the bot from your voice channel and clear the queue")
	.setDescriptionLocalizations({
		de: "Trennen Sie den Bot von Ihrem Sprachkanal und löschen Sie die Warteschlange",
		"en-US": "Disconnect the bot from your voice channel and clear the queue"
	})

export async function execute(interaction: ChatInputCommandInteraction) {
	// Sicherstellen, dass der Befehl in einem Server ausgeführt wird
	if (!interaction.guildId) {
		return interaction.reply("Dieser Befehl kann nur innerhalb eines Servers verwendet werden.");
	}

	// Versuche, die Queue zu holen
	const queue = useQueue(interaction.guildId);
	if (!queue || !queue.connection) {
		const embed = new EmbedBuilder()
			.setTitle("Not Connected")
			.setDescription("Ich bin aktuell in keinem Sprachkanal verbunden.")
			.setColor("Yellow")
			.setTimestamp();
		return interaction.reply({ embeds: [embed] });
	}

	try {
		// queue.destroy() leert die Queue und trennt die Verbindung zum Voice-Channel
		queue.clear();

		queue.connection.disconnect()

		const embed = new EmbedBuilder()
			.setTitle("Disconnected")
			.setDescription("Ich habe den Sprachkanal verlassen und die Queue geleert.")
			.setColor("Green")
			.setTimestamp();
		return interaction.reply({ embeds: [embed], flags: MessageFlagsBitField.Flags.Ephemeral });
	} catch (error: any) {
		console.error("Error leaving voice channel:", error);
		const embed = new EmbedBuilder()
			.setTitle("Error")
			.setDescription("Beim Verlassen des Sprachkanals ist ein Fehler aufgetreten.")
			.setColor("Red")
			.setTimestamp();
		return interaction.reply({ embeds: [embed], flags: MessageFlagsBitField.Flags.Ephemeral });
	}
}
