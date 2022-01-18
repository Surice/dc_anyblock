import { GuildMember, Interaction, Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import { readFileSync, writeFileSync } from "fs";
import { client } from "..";
import { adminMain } from "../commands/admin.command";
import { authMember } from "./auth.service";

export async function handleCommands(msg: Message): Promise<void> {
    if(!msg.guild) return;
    if (!await authMember(msg.member as GuildMember)) {
        msg.reply("Unathorized").catch(err => console.log(err));
        return;
    }
    const content: string[] = msg.content.split(" ").slice(1);

    if(content[0] == "admin" && await authMember(msg.member as GuildMember) == "owner") {
        adminMain(msg, content.slice(1));
        return;
    }


}