import { Message, MessageEmbed, TextChannel, User } from "discord.js";
import { readFileSync } from "fs";
import { client } from "..";
import { handleCommands } from "./command.service";


const config = JSON.parse(readFileSync(`${__dirname}/../../config.json`, "utf-8").toString());

export async function checkMessageContent(msg: Message): Promise<void> {
    if(msg.mentions.has(client.user as User)) {
        handleCommands(msg);

        return
    }

    const linkList: string[] = JSON.parse(readFileSync(`${__dirname}/../__shared/data/links.json`).toString());

    if(msg.content.includes("@everyone") && !msg.mentions.everyone) sanction(msg);

    msg.content.split(' ').forEach(item => {
        if (linkList.includes(item)) {
            sanction(msg);
        }
    });
}

function sanction(msg: Message) {
    msg.delete().then(async () => {
        const logChannel = await client.channels.fetch(config.logChannelId) as TextChannel;

        let embed: MessageEmbed = new MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Deleted message in <#${msg.channel.id}>`)
            .addField("Message Content:", msg.content)
            .setFooter(msg.author.id, "");

        logChannel.send({embeds: [embed]}).catch(err => {console.log("cannot send message")});
    });
}
