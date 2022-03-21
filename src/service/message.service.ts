import { GuildMember, Message, MessageEmbed, TextChannel, User } from "discord.js";
import { readFileSync } from "fs";
import { client } from "..";
import { GuildConfigs } from "../__shared/models/guildConfig.model";
import { authMember } from "./auth.service";
import { handleCommands } from "./command.service";
import { compareStrings } from "./_default.service";


const config = JSON.parse(readFileSync(`${__dirname}/../../config.json`, "utf-8").toString());

export async function handleMessage(msg: Message): Promise<void> {
    if (config.dev && msg.guild?.id != "828395681714536450") return;
    if (!msg.guild) return;

    if (msg.mentions.has(client.user as User) && msg.mentions.users.first()?.id == client.user?.id && msg.content.startsWith("<@")) {
        await handleCommands(msg);
    }


    const linkList: string[] = JSON.parse(readFileSync(`${__dirname}/../__shared/data/links.json`).toString()),
        guildConfigs: GuildConfigs = JSON.parse(readFileSync(`${__dirname}/../__shared/data/guilds.json`).toString()),
        guildConfig = guildConfigs[msg.guild.id];

    const perms = await authMember(msg.member as GuildMember, guildConfig);
    if(perms) return;

    if (guildConfig?.blockUnauthorizedEveryoneEnabled && msg.content.includes("@everyone") && !msg.mentions.everyone) sanction(msg, "unathorized everyone mention", guildConfig?.guildLog);


    msg.content.split(' ').forEach(item => {
        if (!guildConfig) return;

        if (guildConfig.scamlinkCheckEnabled) {
            if (compareStrings(item, linkList)) {
                sanction(msg, "blocked link was posted", guildConfig?.guildLog);
                return;
            }
        }

        if (guildConfig.linkBlacklist && compareStrings(item, guildConfig.linkBlacklist)) {
            sanction(msg, "blacklisted link posted", guildConfig.guildLog);
            return;
        }

        if (guildConfig.globalLinkBlockEnabled) {
            if (guildConfig.linkAllowedChannel?.includes(msg.channelId)) return;
            if (guildConfig.linkWhitelist && compareStrings(item, guildConfig.linkWhitelist)) return;

            console.log(item);
            if (item.startsWith("https://") || item.startsWith("http://") || item.startsWith("www.") || item.endsWith(".com") || item.endsWith(".de") || item.startsWith("discord.gg") || item.startsWith(".gg/")) {
                sanction(msg, "link posted", guildConfig.guildLog);
            }
        } else {
            if (guildConfig.linkBlockChannel && guildConfig.linkBlockChannel?.includes(msg.channelId)) sanction(msg, "link posted", guildConfig.guildLog);
        }
    });
}


function sanction(msg: Message, reason: string, guildLogId?: string) {
    msg.delete().then(async (message) => {
        const adminLog = await client.channels.fetch(config.adminLogId) as TextChannel;

        if (guildLogId) {
            const guildLog = await client.channels.fetch(guildLogId) as TextChannel;


            guildLog.send({
                embeds: [new MessageEmbed({
                    title: "Action executed!",
                    author: {
                        name: `${message.author.tag} - ${message.author.id}`,
                        iconURL: message.author.displayAvatarURL({ dynamic: true })
                    },
                    description: `**Type:** ${reason}`,
                    fields: [{ name: "Message", value: message.content }],
                    footer: {
                        text: `channel: ${(message.channel as TextChannel).name} | ID: ${message.channel.id}`,
                        iconURL: client.user?.displayAvatarURL({ dynamic: true })
                    }
                })]
            });
        }
        let embed: MessageEmbed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`Deleted message on ${message.guild?.name} in ${(message.channel as TextChannel).name}`)
            .addField("Message Content:", message.content)
            .setFooter(`Author ID: ${message.author.id}`, "");

        adminLog.send({ embeds: [embed] }).catch(err => { console.log("cannot send message") });
    }).catch(err => { console.log(err) });
}
