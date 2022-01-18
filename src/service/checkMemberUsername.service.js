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
exports.checkMemberUsername = void 0;
var discord_js_1 = require("discord.js");
var fs_1 = require("fs");
var __1 = require("..");
var config = JSON.parse(fs_1.readFileSync(__dirname + "/../../config.json", "utf-8").toString());
function checkMemberUsername(member) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var guildConfigs, guildConfig, usernameList, adminLog, guildLog;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    guildConfigs = JSON.parse(fs_1.readFileSync(__dirname + "/../__shared/data/guilds.json").toString()), guildConfig = guildConfigs[member.guild.id];
                    if (!guildConfig.usernameCheckEnabled)
                        return [2 /*return*/];
                    usernameList = JSON.parse(fs_1.readFileSync(__dirname + "/../__shared/data/usernames.json").toString());
                    if (!usernameList.includes((_a = member.user) === null || _a === void 0 ? void 0 : _a.username)) return [3 /*break*/, 4];
                    return [4 /*yield*/, __1.client.channels.fetch(config.adminLogId)];
                case 1:
                    adminLog = _b.sent();
                    if (!guildConfig.guildLog) return [3 /*break*/, 3];
                    return [4 /*yield*/, __1.client.channels.fetch(guildConfig.guildLog)];
                case 2:
                    guildLog = _b.sent();
                    guildLog.send({ embeds: [new discord_js_1.MessageEmbed({
                                title: "⚠Action recommended!⚠",
                                description: "criticle User found: <@" + member.id + "> [" + member.user.tag + "]",
                                footer: {
                                    text: "ID: " + member.id,
                                    iconURL: member.user.displayAvatarURL({ dynamic: true })
                                }
                            })] });
                    _b.label = 3;
                case 3:
                    adminLog.send({ embeds: [new discord_js_1.MessageEmbed({
                                author: {
                                    name: member.guild.name,
                                    iconURL: member.guild.iconURL({ dynamic: true }) || ""
                                },
                                description: "criticle User found: " + member.user.tag,
                                footer: {
                                    text: "UserID: " + member.id + " | GuildID: " + member.guild.id
                                }
                            })] });
                    _b.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.checkMemberUsername = checkMemberUsername;
