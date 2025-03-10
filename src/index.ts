import { LunarisMusicClient } from "./lunarisMusicClient";

const client = new LunarisMusicClient();
client.init().catch(console.error);
