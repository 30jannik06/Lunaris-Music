import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { useMainPlayer, useQueue, Track } from "discord-player";
import { config } from "../config";

function cleanQuery(query: string): string {
	try {
		const url = new URL(query);
		url.search = ""; // Entfernt alle Query-Parameter
		return url.toString();
	} catch (error) {
		return query;
	}
}

// Helper: Konvertiert die Queue-Tracks in ein Array von Tracks.
function getTracksArray(queueTracks: any): Track[] {
	if (typeof queueTracks.toArray === "function") {
		return queueTracks.toArray();
	}
	if (typeof queueTracks.values === "function") {
		return Array.from(queueTracks.values());
	}
	return [];
}

export const data = new SlashCommandBuilder()
	.setName("addplaylist")
	.setDescription("Add a song from a given URL or query to the queue")
	.addStringOption((option) =>
		option
			.setName("song")
			.setDescription("The song URL or search query")
			.setRequired(true)
	);

export async function execute(interaction: ChatInputCommandInteraction) {
	// Sofortige deferReply, um "Unknown interaction" zu vermeiden
	await interaction.deferReply();

	// Prüfe, ob der Benutzer in einem Voice-Channel ist
	if (
		!interaction.member ||
		!("voice" in interaction.member) ||
		!interaction.member.voice.channel
	) {
		return interaction.editReply("Du musst in einem Sprachkanal sein, um Musik abzuspielen.");
	}
	const voiceChannel = interaction.member.voice.channel;

	// Nutze entweder die Guild-ID aus der Interaktion oder aus der Config
	const guildID = interaction.guild?.id || config.DISCORD_GUILD_ID;
	if (!guildID) {
		return interaction.editReply("Die Guild-ID ist nicht in der Config gesetzt.");
	}

	// Song-Query abrufen und bereinigen
	const query = interaction.options.getString("song", true)!;
	const safeQuery = cleanQuery(query);

	const player = useMainPlayer();

	// Falls bereits eine Queue existiert, aktualisiere das Metadata-Objekt
	const queue = useQueue(guildID);
	if (queue) {
		queue.metadata = { channel: interaction.channel };
	}

	try {
		// Füge den Song der Queue hinzu. player.play erstellt automatisch eine Queue, falls noch keine existiert.
		await player.play(voiceChannel, safeQuery, { metadata: { channel: interaction.channel } } as any);

		// Nach player.play() die aktualisierte Queue abrufen und sicherstellen, dass Metadata gesetzt ist
		const updatedQueue = useQueue(guildID);
		if (updatedQueue) {
			updatedQueue.metadata = { channel: interaction.channel };
			// Konvertiere die Queue-Tracks in ein Array
			const tracksArray: Track[] = getTracksArray(updatedQueue.tracks);
			const lastTrack: Track | undefined = tracksArray.length > 0 ? tracksArray[tracksArray.length - 1] : undefined;
			const addedTrack: Track | undefined = (lastTrack || updatedQueue.currentTrack) ?? undefined;
			if (addedTrack) {
				const embed = new EmbedBuilder()
					.setTitle(addedTrack.title)
					.setURL(addedTrack.url)
					.setDescription("Song wurde der Queue hinzugefügt!")
					.setFooter({ text: `Requested by ${interaction.user.tag}` })
					.setColor("Green")
					.setTimestamp();
				if (addedTrack.thumbnail && addedTrack.thumbnail.trim().length > 0) {
					embed.setThumbnail(addedTrack.thumbnail);
				}
				return interaction.editReply({ embeds: [embed] });
			}
		}

		// Fallback, falls kein Track-Objekt verfügbar ist
		return interaction.editReply(`Song wurde der Queue hinzugefügt: ${safeQuery}`);
	} catch (error: any) {
		if (error.code === "ERR_NO_RESULT") {
			return interaction.editReply("Für den angegebenen Song konnte kein Ergebnis gefunden werden. Bitte überprüfe den Link oder den Suchbegriff.");
		}
		console.error("Error adding song:", error);
		return interaction.editReply("Beim Hinzufügen des Songs zur Queue ist ein Fehler aufgetreten.");
	}
}
