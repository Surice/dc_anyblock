import { GuildMember, Message } from "discord.js";
import { adminMain } from "../commands/admin.command";
import { help } from "../commands/help.command";
import { info } from "../commands/info.command";
import { setup } from "../commands/setup.command";
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

    switch (content[0].split(".")[0]) {
        case "setup":
            let cache = content[0].split(".")
            content[0] = (cache.length >= 2) ? cache.slice(1).join(' ') : cache.join(' ');

            setup(msg, content);
            break;

        case "info":
            info(msg, content.slice(1));
            break;

        case "help":
            help(msg, content.slice(1));
            break;
            
        default:
            msg.reply("Commmand not found!");
            break;
    }
}