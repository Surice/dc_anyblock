import { GuildMember, Message } from "discord.js";
import { readFileSync, writeFileSync } from "fs";

export async function handleCommands(msg: Message): Promise<void> {
    if(!authMember(msg.member)) return;

    const content: string = msg.content.split(" ")[1];

    let links: string[] = JSON.parse(readFileSync(`${__dirname}/../__shared/data/links.json`, "utf-8").toString());

    links.push(content);

    writeFileSync(`${__dirname}/../__shared/data/links.json`, JSON.stringify(links));

    msg.react("<a:tick:878028360977113119>");
}


async function authMember(member: GuildMember | null): Promise<boolean> {
    if(!member) return false;

    if(member.permissions.has("ADMINISTRATOR")) return true;
    if(member.id == JSON.parse(readFileSync(`${__dirname}/../../config.json`, "utf-8")).ownerID) return true;

    return false;
}