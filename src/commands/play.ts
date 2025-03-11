import {AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {QueryType, Track, useMainPlayer, useQueue} from "discord-player";
import {config} from "../config";

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
	.setName("play")
	.setDescription("Play a song from a given URL or query")
	.setDescriptionLocalizations({
		de: "Einen Song von einer bestimmten URL oder Abfrage abspielen",
		"en-US": "Play a song from a given URL or query"
	})
	.addStringOption(option =>
		option
			.setName("song")
			.setDescription("The song URL or search query")
			.setDescriptionLocalizations({
				de: "Die Lied-URL oder Suchanfrage",
				"en-US": "The song URL or search query",
			})
			.setRequired(true)
			.setAutocomplete(true)
	);

export async function execute(interaction: ChatInputCommandInteraction) {
	// Sofortige DeferReply, um "Unknown interaction" zu vermeiden
	await interaction.deferReply();

	// Prüfe, ob der Benutzer in einem Voice-Channel ist
	if (
		!interaction.member ||
		!("voice" in interaction.member) ||
		!interaction.member.voice.channel
	) {
		return interaction.editReply(
			"Du musst in einem Sprachkanal sein, um Musik abzuspielen.",
		);
	}
	const voiceChannel = interaction.member.voice.channel;

	// Nutze eine statische Guild-ID aus der Config, falls dein Bot nur in einem Server arbeitet
	const guildID = interaction.guild?.id || config.DISCORD_GUILD_ID;
	if (!guildID) {
		const embed = new EmbedBuilder()
			.setTitle("Fehler")
			.setDescription("Die Guild-ID ist nicht in der Config gesetzt.")
			.setColor("Red")
			.setTimestamp();
		return interaction.reply({embeds: [embed]});
	}

	// Song-Query abrufen und bereinigen
	const query = interaction.options.getString("song", true)!;
	const safeQuery = cleanQuery(query);

	const player = useMainPlayer();

	// Vorhandene Queue abrufen und, falls vorhanden, das Metadata-Objekt aktualisieren
	const existingQueue = useQueue(guildID);
	if (existingQueue) {
		// Aktualisiere die Queue mit dem aktuellen Channel
		existingQueue.metadata = {channel: interaction.channel};
		const isAlreadyQueued = existingQueue.tracks.some(
			(track: Track) => track.url === safeQuery,
		);
		const isCurrentlyPlaying =
			existingQueue.currentTrack &&
			existingQueue.currentTrack.url === safeQuery;
		if (isAlreadyQueued || isCurrentlyPlaying) {
			return interaction.editReply(
				"Der Song ist bereits in der Queue oder wird gerade abgespielt.",
			);
		}
	}

	try {
		// Übergib den Voice-Channel, den bereinigten Query und Metadata
		await player.play(voiceChannel, safeQuery, {
			metadata: {channel: interaction.channel},
		} as any);

		// Direkt nach player.play() die (neue) Queue abrufen und das Metadata aktualisieren
		const newQueue = useQueue(guildID);
		if (newQueue) {
			newQueue.metadata = {channel: interaction.channel};
		}

		// Versuche, auf den aktuell gespielten Track zuzugreifen
		const track = newQueue?.currentTrack;
		if (track) {
			// Erstelle ein Embed mit den Track-Informationen
			const embed = new EmbedBuilder()
				.setTitle(track.title)
				.setURL(track.url)
				.setDescription("Song wurde der Queue hinzugefügt!")
				.setThumbnail(track.thumbnail) // Achte darauf, dass track.thumbnail existiert
				.setFooter({text: `Requested by ${interaction.user.tag}`});
			return interaction.editReply({embeds: [embed]});
		} else {
			// Falls kein Track verfügbar ist
			return interaction.editReply(
				`Füge den Song zur Queue hinzu: ${safeQuery}`,
			);
		}
	} catch (error: any) {
		if (error.code === "ERR_NO_RESULT") {
			return interaction.editReply(
				"Für den angegebenen Song konnte kein Ergebnis gefunden werden. Bitte überprüfe den Link oder den Suchbegriff.",
			);
		}
		console.error("Error playing song:", error);
		return interaction.editReply(
			"Beim Abspielen des Songs ist ein Fehler aufgetreten.",
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
