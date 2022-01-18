import { Interaction, Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import { readFileSync, writeFileSync } from "fs";
import { client } from "..";
import { verification } from "../service/verification.service";

export async function adminMain(msg: Message, content: string[]): Promise<void> {
    switch (content[0]) {
        case "addUser":
            if(!content[1]) {
                msg.reply("please provide more parameters").catch(err => console.log(err));
                return;
            }
        
            //verification
            let confirm = verification(msg.channel as TextChannel, content[1], "blocked links");
            if (!confirm) return;
        
            let links: string[] = JSON.parse(readFileSync(`${__dirname}/../__shared/data/links.json`, "utf-8").toString());
        
            links.push(content.join(' '));
        
            writeFileSync(`${__dirname}/../__shared/data/links.json`, JSON.stringify(links));
        
            msg.react("<a:tick_purple:839863280506896404>");
            break;

        case "addLink":

            break;
    
        default:
            break;
    }
}