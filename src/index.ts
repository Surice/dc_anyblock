import { Client, GuildMember, Message } from "discord.js";
import { readFileSync } from "fs";
import { messageCreate } from "./events/createMessage.event";
import { checkMemberUsername } from "./service/checkMemberUsername.service";
import { Config } from "./__shared/models/config.model";


const client: Client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"]});

const config: Config = JSON.parse(readFileSync(`${__dirname}/../config.json`, "utf-8").toString());

export { client, config };

client.login(config.token);

client.on('ready', async () => {
    console.log(`Ready as ${client.user?.tag}`);
});


client.on('messageCreate', messageCreate);

client.on('guildMemberAdd', (member: GuildMember) => {
    if(config.dev && member.guild.id != "828395681714536450") return;

    checkMemberUsername(member);
});