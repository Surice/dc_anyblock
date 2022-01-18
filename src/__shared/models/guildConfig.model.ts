export class GuildConfig {
    usernameCheckEnabled?: boolean;
    scamlinkCheckEnabled?: boolean;
    globalLinkBlockEnabled?: boolean;
    blockUnauthorizedEveryoneEnabled?: boolean;

    guildLog?: string;

    linkBlockChannel?: string[];
    linkAllowedChannel?: string[];
    linkWhitelist?: string[];
    linkBlacklist?: string[];
}

export class GuildConfigs {
    [guildId: string]: GuildConfig;
}