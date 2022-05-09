import { GuildMember, Message, MessageEmbed, TextChannel, User } from "discord.js";
import { readFileSync } from "fs";
import { client, config } from "..";
import { GuildConfigs } from "../__shared/models/guildConfig.model";
import { authMember } from "./auth.service";
import { handleCommands } from "./command.service";
import { compareStrings } from "./response.service";


export function sanction(msg: Message, reason: string, guildLogId?: string) {
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
