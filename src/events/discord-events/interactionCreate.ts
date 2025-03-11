import { Client, MessageFlagsBitField } from "discord.js";
import { commands } from "../../commands";
import { useMainPlayer } from "discord-player";

export default (client: Client): void => {
  client.on("interactionCreate", async (interaction) => {
    // Autocomplete-Handling
    if (interaction.isAutocomplete()) {
      const command = commands[interaction.commandName as keyof typeof commands];
      if (command && typeof (command as any).autocompleteRun === 'function') {
        try {
          await (command as any).autocompleteRun(interaction);
        } catch (error) {
          console.error(`Error handling autocomplete for command ${interaction.commandName}`, error);
          // Bei einem Fehler leere Vorschläge zurückgeben
          await interaction.respond([]);
        }
      }
      return;
    }

    // Chat Input Command Handling
    if (interaction.isChatInputCommand()) {
      // Sicherstellen, dass die Interaktion in einem Server stattfindet
      if (!interaction.guild) {
        return interaction.reply({
          content: "Dieser Befehl kann nur innerhalb eines Servers verwendet werden.",
          flags: MessageFlagsBitField.Flags.Ephemeral,
        });
      }

      const { commandName } = interaction;
      const command = commands[commandName as keyof typeof commands];

      if (!command || typeof command.execute !== "function") {
        console.warn(`No command found for: ${commandName}`);
        return interaction.reply({
          content: "Dieser Befehl wurde nicht gefunden.",
          flags: MessageFlagsBitField.Flags.Ephemeral,
        });
      }

      try {
        // Hole die Hauptinstanz des Players und erstelle einen Kontext
        const player = useMainPlayer();
        const context = { guild: interaction.guild };
        await player.context.provide(context, () => command.execute(interaction));
      } catch (e) {
        console.error(`Error executing command ${commandName}`, e);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "Beim Ausführen des Befehls ist ein Fehler aufgetreten.",
            flags: MessageFlagsBitField.Flags.Ephemeral,
          });
        } else {
          await interaction.reply({
            content: `Beim Ausführen des Befehls ${commandName} ist ein Fehler aufgetreten.`,
            flags: MessageFlagsBitField.Flags.Ephemeral,
          });
        }
      }
    }
  });
};
