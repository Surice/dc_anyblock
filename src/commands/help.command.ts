import { Message, MessageEmbed } from "discord.js";

export async function help(msg: Message, content: string[]): Promise<void> {
    msg.reply({embeds: [new MessageEmbed({
        title: "Help Page",
        description: "Parameters with `<>` are required. `[]` is an optional parameter and `|` seperates posibilities for properties. It menas an 'or'",
        fields: [{
            name: "Help",
            value: "Displays this help page \n**Syntax:** `<mention> help`"
        },{
            name: "Info",
            value: "Displays all Infos about the current configuration \n**Syntax:** `<mention> help`"
        },{
            name: "Setup",
            value: "The command to run the default setup to use this bot \n**Syntax:** `<mention> setup`"
        },{
            name: "Config",
            value: "With this command you can edit some properties and lists \n**Syntax:** `<mention> config <log | usernamecheck | blockscamlinks | blocklinks | blockeveryone | linkwhitelist | linkblacklist | allowedChannel | blockedChannel | superroles | ignoreroles> [add | remove] [channel id | role id]`"
        },]
    })]});
}