import {ChatInputCommandInteraction, hyperlink, MessageFlagsBitField, SlashCommandBuilder} from "discord.js";
import {useQueue} from "discord-player";

export const data = new SlashCommandBuilder()
	.setName("grab")
	.setDescription("Send you the currently played song via DM")
	.setDescriptionLocalizations({
		de: "Schicke dir den aktuell gespielten Song per DM",
		"en-US": "Send you the currently played song via DM"
	})

export async function execute(interaction: ChatInputCommandInteraction) {
	const queue = useQueue();

	if (!queue) {
		return interaction.reply({
			content: "Auf diesem Server läuft derzeit keine aktive Musiksitzung.",
			flags: MessageFlagsBitField.Flags.Ephemeral
		});
	}

	const currentSong = queue.currentTrack;

	if (!currentSong) {
		return interaction.reply({
			content: "Momentan wird kein Song abgespielt.",
			flags: MessageFlagsBitField.Flags.Ephemeral
		});
	}

	// Sende die Song-Details per DM an den Nutzer
	await interaction.user.send(
		`Aktuell läuft: **${currentSong.title}**\n` +
		`${hyperlink("Klicke hier, um den Song anzuhören", currentSong.url)}`
	);

	return interaction.reply({
		content: "Ich habe dir die Details des aktuell gespielten Songs per DM gesendet!",
		flags: MessageFlagsBitField.Flags.Ephemeral
	});
}
