"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMessage = void 0;
var discord_js_1 = require("discord.js");
var fs_1 = require("fs");
var __1 = require("..");
var command_service_1 = require("./command.service");
var config = JSON.parse(fs_1.readFileSync(__dirname + "/../../config.json", "utf-8").toString());
function handleMessage(msg) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var linkList, guildConfigs, guildConfig;
        return __generator(this, function (_c) {
            if (!msg.guild)
                return [2 /*return*/];
            if (msg.mentions.has(__1.client.user) && ((_a = msg.mentions.users.first()) === null || _a === void 0 ? void 0 : _a.id) == ((_b = __1.client.user) === null || _b === void 0 ? void 0 : _b.id) && msg.content.startsWith("<@")) {
                command_service_1.handleCommands(msg);
                return [2 /*return*/];
            }
            linkList = JSON.parse(fs_1.readFileSync(__dirname + "/../__shared/data/links.json").toString()), guildConfigs = JSON.parse(fs_1.readFileSync(__dirname + "/../__shared/data/guilds.json").toString()), guildConfig = guildConfigs[msg.guild.id];
            if (guildConfig.blockUnauthorizedEveryoneEnabled && msg.content.includes("@everyone") && !msg.mentions.everyone)
                sanction(msg, "unathorized everyone mention", guildConfig.guildLog);
            msg.content.split(' ').forEach(function (item) {
                var _a, _b, _c, _d, _e;
                if (guildConfig.scamlinkCheckEnabled) {
                    if (linkList.includes(item)) {
                        sanction(msg, "blocked link was posted", guildConfig.guildLog);
                    }
                }
                if (guildConfig.globalLinkBlockEnabled && !((_a = guildConfig.linkAllowedChannel) === null || _a === void 0 ? void 0 : _a.includes(msg.channelId))) {
                    if (!((_b = guildConfig.linkWhitelist) === null || _b === void 0 ? void 0 : _b.includes(item)))
                        sanction(msg, "link posted", guildConfig.guildLog);
                }
                else if ((_c = guildConfig.linkBlockChannel) === null || _c === void 0 ? void 0 : _c.includes(msg.channelId)) {
                    if (!((_d = guildConfig.linkWhitelist) === null || _d === void 0 ? void 0 : _d.includes(item)))
                        sanction(msg, "link posted", guildConfig.guildLog);
                }
                else {
                    if ((_e = guildConfig.linkBlacklist) === null || _e === void 0 ? void 0 : _e.includes(item))
                        sanction(msg, "blacklisted link posted", guildConfig.guildLog);
                }
            });
            return [2 /*return*/];
        });
    });
}
exports.handleMessage = handleMessage;
function sanction(msg, reason, guildLogId) {
    var _this = this;
    msg.delete().then(function () { return __awaiter(_this, void 0, void 0, function () {
        var adminLog, guildLog, embed;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, __1.client.channels.fetch(config.adminLogId)];
                case 1:
                    adminLog = _c.sent();
                    if (!guildLogId) return [3 /*break*/, 3];
                    return [4 /*yield*/, __1.client.channels.fetch(guildLogId)];
                case 2:
                    guildLog = _c.sent();
                    guildLog.send({ embeds: [new discord_js_1.MessageEmbed({
                                title: "Action executed!",
                                author: {
                                    name: msg.author.tag + " - " + msg.author.id,
                                    iconURL: msg.author.displayAvatarURL({ dynamic: true })
                                },
                                description: "**Type: " + reason + "**",
                                fields: [{ name: "Message", value: msg.content }],
                                footer: {
                                    text: "channel: " + msg.channel.name + " | ID: " + msg.channel.id,
                                    iconURL: (_a = __1.client.user) === null || _a === void 0 ? void 0 : _a.displayAvatarURL({ dynamic: true })
                                }
                            })] });
                    _c.label = 3;
                case 3:
                    embed = new discord_js_1.MessageEmbed()
                        .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
                        .setDescription("Deleted message on " + ((_b = msg.guild) === null || _b === void 0 ? void 0 : _b.name) + " in " + msg.channel.name)
                        .addField("Message Content:", msg.content)
                        .setFooter(msg.author.id, "");
                    adminLog.send({ embeds: [embed] }).catch(function (err) { console.log("cannot send message"); });
                    return [2 /*return*/];
            }
        });
    }); });
}
