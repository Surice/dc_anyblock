import { Client, GuildMember, Message } from "discord.js";
import { readFileSync } from "fs";
import { checkMemberUsername } from "./service/checkMemberUsername.service";
import { checkMessageContent } from "./service/message.service";


const client: Client = new Client({});

export { client };

const config = JSON.parse(readFileSync(`${__dirname}/../config.json`, "utf-8").toString());

client.login(config.token);

client.on('ready', async () => {
    console.log(`Ready as ${client.user?.tag} \n`);
});


client.on('message', (msg: Message) => {
    checkMessageContent(msg);
});

client.on('guildMemberAdd', (member: GuildMember) => {
    // checkMemberUsername(member);
});