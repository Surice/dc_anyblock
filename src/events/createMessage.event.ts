import { Message, User, GuildMember } from "discord.js";
import { readFileSync } from "fs";
import { client, config } from "..";
import { authMember } from "../service/auth.service";
import { handleCommands } from "../service/command.service";
import { sanction } from "../service/message.service";
import { compareStrings } from "../service/response.service";
import { GuildConfigs } from "../__shared/models/guildConfig.model";

export async function messageCreate(msg: Message): Promise<void> {
  //check if development mode is active and ignore any other guild than "anybot - development"
  if (config.dev && msg.guild?.id != "828395681714536450") return;
  if (!msg.guild) return;

  //check if command is found
  if (
    msg.mentions.has(client.user as User) &&
    msg.mentions.users.first()?.id == client.user?.id &&
    msg.content.startsWith("<@")
  ) {
    await handleCommands(msg);
  }

  //fetch some important lists and data | global scamlink list, guild configurations
  const linkList: string[] = JSON.parse(
      readFileSync(`${__dirname}/../__shared/data/links.json`).toString()
    ),
    guildConfigs: GuildConfigs = JSON.parse(
      readFileSync(`${__dirname}/../__shared/data/guilds.json`).toString()
    ),
    guildConfig = guildConfigs[msg.guild.id];

  if (!guildConfig) return;

  const perms = await authMember(msg.member as GuildMember, guildConfig);
  if (perms) return;

  if (
    guildConfig.blockUnauthorizedEveryoneEnabled &&
    msg.content.includes("@everyone") &&
    !msg.mentions.everyone
  )
    sanction(msg, "unathorized everyone mention", guildConfig?.guildLog);

  msg.content.split(" ").forEach((item) => {
    if (guildConfig.scamlinkCheckEnabled) {
      if (compareStrings(item, linkList)) {
        sanction(msg, "blocked link was posted", guildConfig?.guildLog);
        return;
      }
    }

    if (
      guildConfig.linkBlacklist &&
      compareStrings(item, guildConfig.linkBlacklist)
    ) {
      sanction(msg, "blacklisted link posted", guildConfig.guildLog);
      return;
    }

    if (guildConfig.globalLinkBlockEnabled) {
      if (guildConfig.linkAllowedChannel?.includes(msg.channelId)) return;
      if (
        guildConfig.linkWhitelist &&
        compareStrings(item, guildConfig.linkWhitelist)
      )
        return;

      if (
        item.startsWith("https://") ||
        item.startsWith("http://") ||
        item.startsWith("www.") ||
        item.endsWith(".com") ||
        item.endsWith(".de") ||
        item.endsWith(".net") ||
        item.startsWith("discord.gg") ||
        item.startsWith(".gg/")
      ) {
        sanction(msg, "link posted", guildConfig.guildLog);
      }
    } else {
      if (
        guildConfig.linkBlockChannel &&
        guildConfig.linkBlockChannel?.includes(msg.channelId)
      ) {
        if (
          item.startsWith("https://") ||
          item.startsWith("http://") ||
          item.startsWith("www.") ||
          item.endsWith(".com") ||
          item.endsWith(".de") ||
          item.endsWith(".net") ||
          item.startsWith("discord.gg") ||
          item.startsWith(".gg/")
        )
          sanction(msg, "link posted", guildConfig.guildLog);
      }
    }
  });
}
