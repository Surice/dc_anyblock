import { GuildMember, Interaction, Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import { readFileSync, writeFileSync } from "fs";
import { client } from "..";

export async function handleCommands(msg: Message): Promise<void> {
    if (!authMember(msg.member)) {
        msg.reply("Unathorized").catch(err => console.log(err));
        return;
    }

    const content: string = msg.content.split(" ").slice(1).join(' ');

    if(content.length <= 0) {
        msg.reply("please provide Word or Link").catch(err => console.log(err));

        return;
    }

    const confirm: boolean = await new Promise(async (resolve) => {
        let checkFunction = async (interaction: Interaction) => {
            if (!interaction.isButton()) return;
            if (interaction.customId == "decline") {
                client.removeListener("interactionCreate", checkFunction);

                (await
                    (await client.channels
                        .fetch(interaction.channelId as string) as TextChannel).messages
                        .fetch(interaction.message.id)).delete().catch(err => { });

                resolve(false);
            }

            if (interaction.customId != "confirm") return;

            client.removeListener("interactionCreate", checkFunction);

            (await
                (await client.channels
                    .fetch(interaction.channelId as string) as TextChannel).messages
                    .fetch(interaction.message.id)).delete().catch(err => { });

            resolve(true);
        }

        await msg.channel.send({
            embeds: [new MessageEmbed({
                title: "Confirm new Entry",
                description: "are you sure, that you want to add ```" + content + "``` to the blacklist?"
            })],
            components: [new MessageActionRow({
                components: [new MessageButton({
                    customId: "confirm",
                    style: "SUCCESS",
                    label: "Submit"
                }), new MessageButton({
                    customId: "decline",
                    style: "DANGER",
                    label: "Decline"
                })]
            })]
        }).catch(err => console.log(err));

        client.addListener("interactionCreate", checkFunction);
    });
    console.log(confirm);
    if (!confirm) return;

    let links: string[] = JSON.parse(readFileSync(`${__dirname}/../__shared/data/links.json`, "utf-8").toString());

    links.push(content);

    writeFileSync(`${__dirname}/../__shared/data/links.json`, JSON.stringify(links));

    msg.react("<a:tick:878028360977113119>");
}


async function authMember(member: GuildMember | null): Promise<boolean> {
    if (!member) return false;

    if (member.permissions.has("ADMINISTRATOR")) return true;
    if (member.id == JSON.parse(readFileSync(`${__dirname}/../../config.json`, "utf-8")).ownerID) return true;

    return false;
}