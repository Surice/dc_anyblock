import { Interaction, TextChannel, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { client } from "..";

export async function verification(channel: TextChannel, link: string, type: string): Promise<boolean> {
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

        await channel.send({
            embeds: [new MessageEmbed({
                title: "Confirm new Entry",
                description: "are you sure, that you want to add ```" + link + "```"+` to the ${type}?`
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

    return confirm;
}