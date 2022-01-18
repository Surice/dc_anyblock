import { Interaction, Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import { readFileSync, writeFileSync } from "fs";
import { client } from "..";
import { verification } from "../service/response.service";

export async function adminMain(msg: Message, content: string[]): Promise<void> {
    switch (content[0]) {
        case "addUser":
            if(!content[1]) {
                msg.reply("please provide more parameters").catch(err => console.log(err));
                return;
            }
        
            //verification
            let confirmUsername = verification(msg.channel as TextChannel, "are you sure, that you want to add ```" + content[1] + "```"+` to the critical usernames?`);
            if (!confirmUsername) return;
        
            let usernames: string[] = JSON.parse(readFileSync(`${__dirname}/../__shared/data/usernames.json`, "utf-8").toString());
        
            usernames.push(content.slice(1).join(' '));
        
            writeFileSync(`${__dirname}/../__shared/data/usernames.json`, JSON.stringify(usernames));
        
            msg.react("<a:tick_purple:839863280506896404>");
            break;

        case "addLink":
            if(!content[1]) {
                msg.reply("please provide more parameters").catch(err => console.log(err));
                return;
            }
        
            //verification
            let confirmLink = verification(msg.channel as TextChannel, "are you sure, that you want to add ```" + content[1] + "```"+` to the scamlink list`);
            if (!confirmLink) return;
        
            let links: string[] = JSON.parse(readFileSync(`${__dirname}/../__shared/data/usernames.json`, "utf-8").toString());
        
            links.push(content.slice(1).join(' '));
        
            writeFileSync(`${__dirname}/../__shared/data/usernames.json`, JSON.stringify(links));
        
            msg.react("<a:tick_purple:839863280506896404>");
            break;
    
        default:
            msg.reply(`admin command ${content[0]} not found!`);
            break;
    }
}