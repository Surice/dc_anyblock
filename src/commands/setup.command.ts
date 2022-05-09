import { Message, TextChannel } from "discord.js";
import { fstat, readFileSync, writeFileSync } from "fs";
import { client } from "..";
import { checkResponse, verification } from "../service/response.service";
import { GuildConfig, GuildConfigs } from "../__shared/models/guildConfig.model";

export async function setup(msg: Message, content: string[]): Promise<void> {
    let guildConfig: GuildConfig = {};
    guildConfig.guildLog = await checkResponse(msg, "Post the channelID for the Logchannel!");

    guildConfig.usernameCheckEnabled = await verification(msg.channel as TextChannel, "Would you like to enable username check when a user join the server?");
    guildConfig.scamlinkCheckEnabled = await verification(msg.channel as TextChannel, "Would you like to enable the scamlink filter?");
    guildConfig.globalLinkBlockEnabled = await verification(msg.channel as TextChannel, "Should i globaly block links?");
    guildConfig.blockUnauthorizedEveryoneEnabled = await verification(msg.channel as TextChannel, "Should it be allowed to mention everyone without the required permissions? (blocks as well scammessages)");


    let guildConfigs: GuildConfigs = JSON.parse(readFileSync(`${__dirname}/../__shared/data/guilds.json`).toString());
    guildConfigs[msg.guild?.id as string] = guildConfig;
    writeFileSync(`${__dirname}/../__shared/data/guilds.json`, JSON.stringify(guildConfigs));

    msg.reply("Setup completed <a:tick_purple:839863280506896404>");
}