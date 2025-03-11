import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
	AutocompleteInteraction,
} from "discord.js";
import { Track, useMainPlayer, useQueue, QueryType } from "discord-player";
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

export const data = new SlashCommandBuilder()
	.setName("addsong")
	.setDescription("Add a song from a given URL or query to the queue")
	.setDescriptionLocalizations({
		de: "Füge einen Song von einer gegebenen URL oder Suchanfrage zur Warteschlange hinzu",
		"en-US": "Add a song from a given URL or query to the queue",
	})
	.addStringOption((option) =>
		option
			.setName("song")
			.setDescription("The song URL or search query")
			.setDescriptionLocalizations({
				de: "Die Song-URL oder Suchanfrage",
				"en-US": "The song URL or search query",
			})
			.setRequired(true)
			.setAutocomplete(true)
	);

export async function execute(interaction: ChatInputCommandInteraction) {
	// Defer Reply, um "Unknown interaction" zu vermeiden
	await interaction.deferReply();

	// Prüfe, ob der Benutzer in einem Voice-Channel ist
	if (
		!interaction.member ||
		!("voice" in interaction.member) ||
		!interaction.member.voice.channel
	) {
		return interaction.editReply(
			"Du musst in einem Sprachkanal sein, um Musik abzuspielen."
		);
	}
	const voiceChannel = interaction.member.voice.channel;

	// Nutze entweder die Guild-ID aus der Interaktion oder aus der Config
	const guildID = interaction.guild?.id || config.DISCORD_GUILD_ID;
	if (!guildID) {
		const embed = new EmbedBuilder()
			.setTitle("Fehler")
			.setDescription("Die Guild-ID ist nicht in der Config gesetzt.")
			.setColor("Red")
			.setTimestamp();
		return interaction.reply({ embeds: [embed] });
	}

	// Song-Query abrufen und bereinigen
	const query = interaction.options.getString("song", true)!;
	const safeQuery = cleanQuery(query);

	const player = useMainPlayer();

	// Falls bereits eine Queue existiert, aktualisiere das Metadata-Objekt
	const queue = useQueue(guildID);
	if (queue) {
		queue.metadata = { channel: interaction.channel };
		const isAlreadyQueued = queue.tracks.some(
			(track: Track) => track.url === safeQuery
		);
		const isCurrentlyPlaying =
			queue.currentTrack && queue.currentTrack.url === safeQuery;
		if (isAlreadyQueued || isCurrentlyPlaying) {
			return interaction.editReply(
				"Der Song ist bereits in der Queue oder wird gerade abgespielt."
			);
		}
	}

	try {
		// Füge den Song der Queue hinzu (player.play erstellt automatisch eine Queue, falls noch keine existiert)
		await player.play(voiceChannel, safeQuery, {
			metadata: { channel: interaction.channel },
		} as any);

		// Nach player.play(): Aktualisiere die Queue und greife auf den zuletzt hinzugefügten Track zu
		// Nach player.play() die aktualisierte Queue abrufen und sicherstellen, dass Metadata gesetzt ist
		const updatedQueue = useQueue(guildID);
		if (updatedQueue) {
			updatedQueue.metadata = { channel: interaction.channel };

			// Konvertiere die Queue-Tracks in ein Array
			const tracksArray: Track[] = (typeof updatedQueue.tracks.toArray === "function")
				? (updatedQueue.tracks as any).toArray()
				: Array.from(updatedQueue.tracks as any);

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
			return interaction.editReply(
				"Für den angegebenen Song konnte kein Ergebnis gefunden werden. Bitte überprüfe den Link oder den Suchbegriff."
			);
		}
		console.error("Error adding song:", error);
		return interaction.editReply(
			"Beim Hinzufügen des Songs zur Queue ist ein Fehler aufgetreten."
		);
	}
}

export async function autocompleteRun(interaction: AutocompleteInteraction) {
	const focusedValue = interaction.options.getFocused();

	// Sofortige Rückgabe, wenn die Eingabe leer ist
	if (!focusedValue || focusedValue.trim() === "") {
		return interaction.respond([]);
	}

	try {
		const player = useMainPlayer();
		const result = await player.search(focusedValue, {
			searchEngine: QueryType.AUTO, // Wähle den gewünschten Such-Engine-Typ
			requestedBy: interaction.user,
		});

		// Nimm z. B. die ersten 5 Treffer
		const tracks = result.tracks.slice(0, 5);
		const suggestions = tracks.map(track => ({
			name: track.title, // Sichtbar für den Nutzer
			value: track.url,  // Wert, der übergeben wird, wenn ausgewählt
		}));

		// Schnelle Antwort an Discord
		await interaction.respond(suggestions);
	} catch (error) {
		console.error("Autocomplete search error:", error);
		// Bei Fehler sofort leere Vorschläge senden
		await interaction.respond([]);
	}
}
