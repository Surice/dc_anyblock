import { GuildMember, MessageEmbed, TextChannel } from "discord.js";
import { readFileSync } from "fs";
import { client } from "..";
import { Config } from "../__shared/models/config.model";
import { GuildConfigs } from "../__shared/models/guildConfig.model";

const config: Config = JSON.parse(readFileSync(`${__dirname}/../../config.json`, "utf-8").toString());

export async function checkMemberUsername(member: GuildMember): Promise<void> {
    const guildConfigs: GuildConfigs = JSON.parse(readFileSync(`${__dirname}/../__shared/data/guilds.json`).toString()),
        guildConfig = guildConfigs[member.guild.id];

    if(!guildConfig.usernameCheckEnabled) return;

    const usernameList: string[] = JSON.parse(readFileSync(`${__dirname}/../__shared/data/usernames.json`).toString());

    if(usernameList.includes(member.user?.username)) {
        const adminLog: TextChannel = await client.channels.fetch(config.adminLogId) as TextChannel;

        if(guildConfig.guildLog) {
            const guildLog: TextChannel = await client.channels.fetch(guildConfig.guildLog) as TextChannel;

            guildLog.send({embeds: [new MessageEmbed({
                title: "⚠Action recommended!⚠",
                description: `criticle User found: <@${member.id}> [${member.user.tag}]`,
                footer: {
                    text: `ID: ${member.id}`,
                    iconURL: member.user.displayAvatarURL({dynamic: true})
                }
            })]});
        }
        
        adminLog.send({embeds: [new MessageEmbed({
            author: {
                name: member.guild.name,
                iconURL: member.guild.iconURL({dynamic: true}) || ""
            },
            description: `criticle User found: ${member.user.tag}`,
            footer: {
                text: `UserID: ${member.id} | GuildID: ${member.guild.id}`
            }
        })]});
    }
}