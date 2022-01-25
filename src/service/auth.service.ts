import { GuildMember } from "discord.js";
import { readFileSync } from "fs";
import { Config } from "../__shared/models/config.model";
import { GuildConfig } from "../__shared/models/guildConfig.model";

export async function authMember(member: GuildMember, guildConfig?: GuildConfig): Promise<string | boolean> {
    if (!member) return false;

    if (member.id == (JSON.parse(readFileSync(`${__dirname}/../../config.json`, "utf-8"))as Config).ownerID) return "owner";
    if(member.permissions.has('ADMINISTRATOR')) return 'admin';

    let superuser: boolean = false;
    guildConfig?.superusers?.forEach((superRole: string) => {
        if(member.roles.cache.some(role => superRole == role.id)) {
            superuser = true;
        }
    });
    if(superuser) return "admin";

    let ignoredUser: boolean = false;
    guildConfig?.ignoredRoles?.forEach((ignoredRole: string) => {
        if(member.roles.cache.some(role => ignoredRole == role.id)) {
            ignoredUser = true;
        }
    });
    if(ignoredUser) return "ignoredUser";

    return false;
}