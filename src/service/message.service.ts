import { Message, MessageEmbed, TextChannel, User } from "discord.js";
import { readFileSync } from "fs";
import { client } from "..";
import { GuildConfigs } from "../__shared/models/guildConfig.model";
import { handleCommands } from "./command.service";


const config = JSON.parse(readFileSync(`${__dirname}/../../config.json`, "utf-8").toString());

export async function handleMessage(msg: Message): Promise<void> {
    if(config.dev && msg.guild?.id != "828395681714536450") return;

    if(!msg.guild) return;

    if(msg.mentions.has(client.user as User) && msg.mentions.users.first()?.id == client.user?.id && msg.content.startsWith("<@")) {
        await handleCommands(msg);
        return;
    }

    
    const linkList: string[] = JSON.parse(readFileSync(`${__dirname}/../__shared/data/links.json`).toString()),
        guildConfigs: GuildConfigs = JSON.parse(readFileSync(`${__dirname}/../__shared/data/guilds.json`).toString()),
        guildConfig = guildConfigs[msg.guild.id];


    if(guildConfig?.blockUnauthorizedEveryoneEnabled && msg.content.includes("@everyone") && !msg.mentions.everyone) sanction(msg, "unathorized everyone mention", guildConfig?.guildLog);
    

    msg.content.split(' ').forEach(item => {
        if(guildConfig?.scamlinkCheckEnabled) {
            if (linkList.includes(item)) {
                sanction(msg, "blocked link was posted", guildConfig?.guildLog);
            }
        }

        if(guildConfig?.globalLinkBlockEnabled && !guildConfig?.linkAllowedChannel?.includes(msg.channelId)) {
            if(!guildConfig?.linkWhitelist?.includes(item)) sanction(msg, "link posted", guildConfig?.guildLog);
        }
        else if(guildConfig?.linkBlockChannel?.includes(msg.channelId)) {
            if(!guildConfig?.linkWhitelist?.includes(item)) sanction(msg, "link posted", guildConfig?.guildLog);
        }
        else {
            if(guildConfig?.linkBlacklist?.includes(item)) sanction(msg, "blacklisted link posted", guildConfig?.guildLog);
        }

    });
}


function sanction(msg: Message, reason: string, guildLogId?: string) {
    msg.delete().then(async () => {
        const adminLog = await client.channels.fetch(config.adminLogId) as TextChannel;

        if(guildLogId) {
            const guildLog = await client.channels.fetch(guildLogId) as TextChannel;

            
            guildLog.send({embeds: [new MessageEmbed({
                title: "Action executed!",
                author: {
                    name: `${msg.author.tag} - ${msg.author.id}`,
                    iconURL: msg.author.displayAvatarURL({dynamic: true})
                },
                description: `**Type: ${reason}**`,
                fields: [{name: "Message", value: msg.content}],
                footer: {
                    text: `channel: ${(msg.channel as TextChannel).name} | ID: ${msg.channel.id}`,
                    iconURL: client.user?.displayAvatarURL({dynamic: true})
                }
            })]});
        }
        let embed: MessageEmbed = new MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Deleted message on ${msg.guild?.name} in ${(msg.channel as TextChannel).name}`)
            .addField("Message Content:", msg.content)
            .setFooter(msg.author.id, "");

        adminLog.send({embeds: [embed]}).catch(err => {console.log("cannot send message")});
    });
}
