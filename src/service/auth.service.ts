import { GuildMember } from "discord.js";
import { readFileSync } from "fs";
import { Config } from "../__shared/models/config.model";
import { GuildConfig } from "../__shared/models/guildConfig.model";

export async function authMember(member: GuildMember, guildConfig: GuildConfig): Promise<number | undefined> {
    if (member.id == (JSON.parse(readFileSync(`${__dirname}/../../config.json`, "utf-8"))as Config).ownerID) return 99;
    if(member.permissions.has('ADMINISTRATOR')) return 2;

    let superuser: boolean = false;
    guildConfig?.superusers?.forEach((superRole: string) => {
        if(member.roles.cache.some(role => superRole == role.id)) {
            superuser = true;
        }
    });
    if(superuser) return 2;

    let ignoredUser: boolean = false;
    guildConfig?.ignoredRoles?.forEach((ignoredRole: string) => {
        if(member.roles.cache.some(role => ignoredRole == role.id)) {
            ignoredUser = true;
        }
    });
    if(ignoredUser) return 1;
}