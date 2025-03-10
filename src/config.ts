import dotenv from "dotenv";

dotenv.config();

const {DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID} = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !DISCORD_GUILD_ID) {
	throw new Error("Missing envirment variable");
}

export const config = {
	DISCORD_TOKEN,
	DISCORD_CLIENT_ID,
	DISCORD_GUILD_ID
}
