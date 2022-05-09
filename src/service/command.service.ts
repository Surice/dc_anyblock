import { GuildMember, Message } from "discord.js";
import { readFileSync } from "fs";
import { adminMain } from "../commands/admin.command";
import { config } from "../commands/config.command";
import { help } from "../commands/help.command";
import { info } from "../commands/info.command";
import { setup } from "../commands/setup.command";
import { GuildConfigs } from "../__shared/models/guildConfig.model";
import { authMember } from "./auth.service";

export async function handleCommands(msg: Message): Promise<void> {
    const guildConfigs: GuildConfigs = JSON.parse(
        readFileSync(`${__dirname}/../__shared/data/guilds.json`).toString()
      ),
      guildConfig = guildConfigs[msg.guild?.id ||""];

    const perms = await authMember(msg.member as GuildMember, guildConfig);

    if(!msg.guild) return;
    if (!perms || perms < 2) {
        msg.reply("Unathorized").catch(err => console.log(err));
        return;
    }
    const content: string[] = msg.content.split(" ").slice(1);

    if(content[0] == "admin" && perms == 99) {
        adminMain(msg, content.slice(1));
        return;
    }

    switch (content[0]) {
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

        case "config":
            config(msg, content.slice(1));
            break;
            
        default:
            msg.reply("Commmand not found!");
            break;
    }
}