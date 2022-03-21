import { Message, MessageEmbed } from "discord.js";
import { readFileSync } from "fs";
import { client } from "..";
import { GuildConfigs } from "../__shared/models/guildConfig.model";

export async function info(msg: Message, content: string[]): Promise<void> {
    let guildConfigs: GuildConfigs = JSON.parse(readFileSync(`${__dirname}/../__shared/data/guilds.json`).toString()),
    gc = guildConfigs[msg.guild?.id as string];

    if(!gc) {
        msg.reply("there is no configuration. \nPlease run `<@"+client.user?.id+"> setup`");
        return;
    }

    let embed = new MessageEmbed()
        .setTitle("Setup - Info")
        .setFooter(client.user?.tag as string, client.user?.displayAvatarURL())
        .setAuthor(`Log: ${gc.guildLog}`)
        .setDescription(`Check Usernames: ${toggle(gc.usernameCheckEnabled)} \n Scamlink block: ${toggle(gc.scamlinkCheckEnabled)} \nBlock links: ${toggle(gc.globalLinkBlockEnabled)} \nBlock unauthorized everyone: ${toggle(gc.blockUnauthorizedEveryoneEnabled)}`)
        .addFields([{
            name: "Link blocked channels", value: gc.linkBlockChannel?.join(', ') || "- none- ", inline: true
        },{
            name: "Link allowed channels", value: gc.linkAllowedChannel?.join(', ') || "- none -", inline: true
        },{
            name: "\u200b", value: "\u200b"
        },{
            name: "Super roles", value: gc.superusers?.map(roleId => {return `<@&${roleId}>`}).join(', ') || "- none -", inline: true
        },{
            name: "Ignored roles", value: gc.ignoredRoles?.map(roleId => {return `<@&${roleId}>`}).join(', ') || "- none -", inline: true
        },{
            name: "\u200b", value: "\u200b"
        },{
            name: "Link whitelist", value: gc.linkWhitelist?.join(', ') || "- none -", inline: true
        },{
            name: "Link blacklist", value: gc.linkBlacklist?.join(', ') || "- none -", inline: true
        }]);

    msg.reply({embeds: [embed]});
}


function toggle(key?: boolean): string {
    if(key) return "<:onbutton:932764368398086204>";
    else return "<:offbutton:932764368406458448>";
}