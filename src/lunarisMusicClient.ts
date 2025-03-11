import { Client, GatewayIntentBits } from "discord.js";
import { Player } from "discord-player";
import { DefaultExtractors } from "@discord-player/extractor";
import { config } from "./config";
import { discordEvents } from "./events/discord-events";
import { playerEvents } from "./events/player-events";

export class LunarisMusicClient {
  public client: Client;
  public player: Player;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });
    this.player = new Player(this.client);
  }

  public async init(): Promise<void> {
    // Lade die Standard-Extractors
    await this.player.extractors.loadMulti(DefaultExtractors);

    // Leere alle vorhandenen Queues, um alte Daten zu entfernen
    this.player.nodes.cache.forEach((queue) => {
      queue.clear();
    });

    // Registriere Discord-Events
    for (const discordEventHandler of Object.values(discordEvents)) {
      discordEventHandler(this.client);
    }

    // Registriere Player-Events
    for (const playerEventHandler of Object.values(playerEvents)) {
      playerEventHandler(this.player);
    }

    // Melde den Bot an
    await this.client.login(config.DISCORD_TOKEN);
  }
}
