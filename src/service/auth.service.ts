import { GuildMember } from "discord.js";
import { readFileSync } from "fs";
import { Config } from "../__shared/models/config.model";

export async function authMember(member: GuildMember): Promise<string | boolean> {
    if (!member) return false;

    if (member.id == (JSON.parse(readFileSync(`${__dirname}/../../config.json`, "utf-8"))as Config).ownerID) return "owner";
    if(member.permissions.has('ADMINISTRATOR')) return 'admin';

    return false;
}