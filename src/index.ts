import { Client, GuildMember, Message } from "discord.js";
import { readFileSync } from "fs";
import { checkMemberUsername } from "./service/checkMemberUsername.service";
import { handleMessage } from "./service/message.service";
import { Config } from "./__shared/models/config.model";


const client: Client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"]});

export { client };

const config: Config = JSON.parse(readFileSync(`${__dirname}/../config.json`, "utf-8").toString());
client.login(config.token);

client.on('ready', async () => {
    console.log(`Ready as ${client.user?.tag}`);
});


client.on('messageCreate', handleMessage);

client.on('guildMemberAdd', (member: GuildMember) => {
    if(config.dev && member.guild.id != "828395681714536450") return;

    checkMemberUsername(member);
});