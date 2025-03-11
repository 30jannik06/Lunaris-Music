import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder,} from "discord.js";
import {Track, useQueue} from "discord-player";

export const data = new SlashCommandBuilder()
	.setName("queue")
	.setDescription("Display the current queue")
	.setDescriptionLocalizations({
		de: "Anzeige der aktuellen Warteschlange",
		"en-US": "Display the current queue"
	})

export async function execute(interaction: ChatInputCommandInteraction) {
	// Queue abrufen
	const queue = useQueue();

	if (!queue) {
		const embed = new EmbedBuilder()
			.setTitle("Queue")
			.setDescription("This server does not have an active player session.")
			.setColor("Red")
			.setTimestamp();
		return interaction.reply({embeds: [embed]});
	}

	// Aktuell gespielter Track
	const currentTrack = queue.currentTrack;
	const nowPlaying = currentTrack
		? `[${currentTrack.title}](${currentTrack.url}) - ${currentTrack.author}`
		: "Nothing playing";

	// Nächste Tracks (max. 5) abrufen
	const upcomingTracks: Track[] = queue.tracks.toArray().slice(0, 5);
	let upcoming = "None";
	if (upcomingTracks.length > 0) {
		upcoming = upcomingTracks
			.map(
				(track, index) =>
					`${index + 1}. [${track.title}](${track.url}) - ${track.author}`,
			)
			.join("\n");
	}

	const embed = new EmbedBuilder()
		.setTitle("Current Queue")
		.addFields(
			{name: "Now Playing", value: nowPlaying, inline: false},
			{name: "Upcoming Tracks", value: upcoming, inline: false},
		)
		.setColor("Blue")
		.setTimestamp();

	return interaction.reply({embeds: [embed]});
}
