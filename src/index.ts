import { Client, GuildMember, Message } from "discord.js";
import { readFileSync } from "fs";
import { checkMessageContent } from "./service/message.service";


const client: Client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"]});

export { client };

const config = JSON.parse(readFileSync(`${__dirname}/../config.json`, "utf-8").toString());

client.login(config.token);

client.on('ready', async () => {
    console.log(`Ready as ${client.user?.tag}`);
});


client.on('messageCreate', (msg: Message) => {
    console.log("msg in");
    checkMessageContent(msg);
});

client.on('guildMemberAdd', (member: GuildMember) => {
    // checkMemberUsername(member);
});