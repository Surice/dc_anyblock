import { Interaction, TextChannel, MessageEmbed, MessageActionRow, MessageButton, Message, ContextMenuInteraction } from "discord.js";
import { client } from "..";

export async function verification(channel: TextChannel, content: string): Promise<boolean> {
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
                description: content
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

export async function checkResponse(inMessage: Message, message: string): Promise<string | undefined> {
    let answer: string | undefined = await new Promise(async resolve => {
        await inMessage.channel.send(message);

        let checkFunction = async (answerMsg: Message) => {
            if (answerMsg.channel.id != inMessage.channel.id) return;
            if (answerMsg.author.id != inMessage.author.id) return;

            resolve(answerMsg.content);
            client.removeListener("messageCreate", checkFunction);
        };

        client.addListener("messageCreate", checkFunction);
        setTimeout(() => {
            client.removeListener("messageCreate", checkFunction);
            resolve(undefined);
        }, 60000);
    });

    return answer;
}