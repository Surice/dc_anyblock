import { Message, TextChannel } from "discord.js";
import { access, readFileSync, writeFileSync } from "fs";
import { checkResponse, verification } from "../service/response.service";
import {
  GuildConfig,
  GuildConfigs,
} from "../__shared/models/guildConfig.model";

export async function config(msg: Message, content: string[]): Promise<void> {
  let error: boolean = false,
    guildconfigs: GuildConfigs = JSON.parse(
      readFileSync(`${__dirname}/../__shared/data/guilds.json`).toString()
    ),
    guildConfig = guildconfigs[msg.guild?.id as string];

  switch (content[0]) {
    case "log":
      guildConfig.guildLog = await checkResponse(
        msg,
        "Post the channelID for the Logchannel!"
      );
      break;

    case "usernamecheck":
      guildConfig.usernameCheckEnabled = await verification(
        msg.channel as TextChannel,
        "Would you like to enable username check when a user join the server?"
      );
      break;

    case "blockscamlinks":
      guildConfig.scamlinkCheckEnabled = await verification(
        msg.channel as TextChannel,
        "Would you like to enable the scamlink filter?"
      );
      break;

    case "blocklinks":
      guildConfig.globalLinkBlockEnabled = await verification(
        msg.channel as TextChannel,
        "Should i globaly block links?"
      );
      break;

    case "blockeveryone":
      guildConfig.blockUnauthorizedEveryoneEnabled = await verification(
        msg.channel as TextChannel,
        "Should it be allowed to mention everyone without the required permissions? (blocks as well scammessages)"
      );
      break;

    case "linkwhitelist":
        guildConfig.linkWhitelist = await changeList(msg, guildConfig.linkWhitelist, content[1]);
        break;

    case "linkblacklist":
      if (!guildConfig.linkBlacklist) guildConfig.linkBlacklist = new Array();
      guildConfig.linkBlacklist.push(
        (await checkResponse(msg, "Post the domain for the blacklist")) || ""
      );
      break;

    case "allowedChannel":
      if (!guildConfig.linkAllowedChannel)
        guildConfig.linkAllowedChannel = new Array();
      guildConfig.linkAllowedChannel.push(
        (await checkResponse(
          msg,
          "Post the channelID for the allowed channel"
        )) || ""
      );
      break;

    case "blockedChannel":
      if (!guildConfig.linkBlockChannel)
        guildConfig.linkBlockChannel = new Array();
      guildConfig.linkBlockChannel.push(
        (await checkResponse(
          msg,
          "Post the channelID for the blocked channel"
        )) || ""
      );
      break;

    case "superroles":
      if (!guildConfig.superusers) guildConfig.superusers = new Array();
      guildConfig.superusers.push(
        (await checkResponse(msg, "Post the ID of the superusers role")) || ""
      );
      break;

    case "ignoreroles":
      if (!guildConfig.ignoredRoles) guildConfig.ignoredRoles = new Array();
      guildConfig.ignoredRoles.push(
        (await checkResponse(
          msg,
          "Post the ID of the role wich shouldnt be sanctioned"
        )) || ""
      );
      break;

    default:
      msg.reply("unknown config property");
      error = true;
      break;
  }

  if (error) return;

  //save to file
  let guildConfigs: GuildConfigs = JSON.parse(
    readFileSync(`${__dirname}/../__shared/data/guilds.json`).toString()
  );
  guildConfigs[msg.guild?.id as string] = guildConfig;
  writeFileSync(
    `${__dirname}/../__shared/data/guilds.json`,
    JSON.stringify(guildConfigs)
  );

    let res = await msg.reply("Successfully changed <a:tick_purple:839863280506896404>");
    setTimeout(() => res.delete(), 5000);
}



async function changeList(msg: Message, list: Array<string> | undefined, action: string): Promise<string[]> {
    if (!list) list = new Array();
    if(action == "add") {
        list.push(
          await checkResponse(msg, "Post the domain for the whitelist") || ""
        );
    }
    else if(action == "rm" || action == "remove") {
        const item = await checkResponse(msg, "Post the domain for the whitelist");
        if(!item) return list;

        let index = list.indexOf(item);
        list.splice(index, 1);
    }else {
        msg.reply("invalid action!");
    }

  return list;
}
