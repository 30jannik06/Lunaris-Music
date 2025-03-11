import {ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, MessageFlagsBitField} from "discord.js";
import { useMainPlayer, useQueue } from "discord-player";
import { config } from "../config";

export const data = new SlashCommandBuilder()
	.setName("connect")
	.setDescription("Connect the bot to your voice channel")
	.setDescriptionLocalizations({
		de: "Verbinden Sie den Bot mit Ihrem Sprachkanal",
		"en-US": "Connect the bot to your voice channel"
	})

export async function execute(interaction: ChatInputCommandInteraction) {
	// Defer die Antwort (ephemeral, damit nur der Nutzer sie sieht)
	await interaction.deferReply({ flags: MessageFlagsBitField.Flags.Ephemeral });

	// Prüfe, ob der Benutzer in einem Voice-Channel ist
	if (
		!interaction.member ||
		!("voice" in interaction.member) ||
		!interaction.member.voice.channel
	) {
		return interaction.editReply("Du musst in einem Sprachkanal sein, um diesen Befehl zu nutzen.");
	}
	const voiceChannel = interaction.member.voice.channel;

	// Stelle sicher, dass wir in einem Guild-Kontext arbeiten
	if (!interaction.guild) {
		return interaction.editReply("Dieser Befehl kann nur innerhalb eines Servers verwendet werden.");
	}

	const player = useMainPlayer();
	const guildID = interaction.guild.id;

	// Versuche, eine bestehende Queue zu erhalten
	const queue = useQueue(guildID);
	if (queue && queue.connection) {
		// Wenn der Bot bereits in einem Voice-Channel verbunden ist...
		if (queue.connection.joinConfig.channelId === voiceChannel.id) {
			return interaction.editReply("Ich bin bereits in deinem Sprachkanal verbunden.");
		} else {
			return interaction.editReply("Ich bin bereits in einem anderen Sprachkanal verbunden.");
		}
	}

	try {
		// Erstelle eine neue Queue, falls noch keine existiert, mithilfe von player.nodes.create
		const newQueue = useQueue(guildID) || player.nodes.create(interaction.guild, {
			metadata: { channel: interaction.channel }
		});

		await newQueue.connect(voiceChannel);

		const embed = new EmbedBuilder()
			.setTitle("Connected")
			.setDescription(`Ich habe mich mit **${voiceChannel.name}** verbunden!`)
			.setColor("Green")
			.setTimestamp();

		return interaction.editReply({ embeds: [embed]});
	} catch (error) {
		console.error("Error connecting to voice channel:", error);
		return interaction.editReply("Beim Verbinden mit deinem Sprachkanal ist ein Fehler aufgetreten.");
	}
}
