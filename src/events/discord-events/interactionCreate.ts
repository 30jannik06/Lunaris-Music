// src/events/interactionCreate.ts
import { Client } from "discord.js";
import { commands } from "../../commands";
import { useMainPlayer } from "discord-player";

export default (client: Client): void => {
	client.on("interactionCreate", async (interaction) => {
		// Prüfe, ob es sich um einen ChatInputCommand handelt (Slash Command)
		if (!interaction.isChatInputCommand()) return;

		// Wenn keine Guild vorhanden ist, gib eine Fehlermeldung zurück.
		if (!interaction.guild) {
			return interaction.reply({
				content: "Dieser Befehl kann nur innerhalb eines Servers verwendet werden.",
				ephemeral: true,
			});
		}

		const { commandName } = interaction;
		const command = commands[commandName as keyof typeof commands];

		if (!command) {
			console.warn(`No command found for: ${commandName}`);
			return;
		}

		try {
			// Hole die Hauptinstanz des Players
			const player = useMainPlayer();
			// Da wir bereits geprüft haben, dass interaction.guild nicht null ist, können wir es direkt verwenden.
			const context = { guild: interaction.guild };
			// Führe den Command innerhalb des bereitgestellten Kontextes aus
			await player.context.provide(context, () => command.execute(interaction));
		} catch (e) {
			console.error(`Error executing command ${commandName}`, e);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: "There was an error executing that command.",
					ephemeral: true,
				});
			} else {
				await interaction.reply({
					content: `There was an error executing that command ${commandName}`,
					ephemeral: true,
				});
			}
		}
	});
};
