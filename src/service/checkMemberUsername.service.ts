import { GuildMember, MessageEmbed, TextChannel } from "discord.js";
import { readFileSync } from "fs";
import { client } from "..";

const config = JSON.parse(readFileSync(`${__dirname}/../../config.json`, "utf-8").toString());

export async function checkMemberUsername(member: GuildMember): Promise<void> {
    const usernameList: string[] = JSON.parse(readFileSync(`${__dirname}/../__shared/data/usernames.json`).toString());

    if(usernameList.includes(member.user?.username)) {
        if(!member.bannable) return;

        const logChannel = await client.channels.fetch(config.logChannelId) as TextChannel;
        

        member.ban().then(async (member: GuildMember) => {
            logChannel.send(`banned: ${member.user.tag}`);
        });
    }
}