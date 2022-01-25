import { Message, MessageEmbed } from "discord.js";

export async function help(msg: Message, content: string[]): Promise<void> {
    msg.reply({embeds: [new MessageEmbed({
        title: "Comming soon...",
        description: "This page will display all functions and explain them"
    })]});
}