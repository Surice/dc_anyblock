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
exports.handleCommands = void 0;
var discord_js_1 = require("discord.js");
var fs_1 = require("fs");
var __1 = require("..");
function handleCommands(msg) {
    return __awaiter(this, void 0, void 0, function () {
        var content, confirm, links;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!authMember(msg.member)) {
                        msg.reply("Unathorized").catch(function (err) { return console.log(err); });
                        return [2 /*return*/];
                    }
                    content = msg.content.split(" ").slice(1).join(' ');
                    if (content.length <= 0) {
                        msg.reply("please provide Word or Link");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                            var checkFunction;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        checkFunction = function (interaction) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (!interaction.isButton())
                                                            return [2 /*return*/];
                                                        if (!(interaction.customId == "decline")) return [3 /*break*/, 3];
                                                        __1.client.removeListener("interactionCreate", checkFunction);
                                                        return [4 /*yield*/, __1.client.channels
                                                                .fetch(interaction.channelId)];
                                                    case 1: return [4 /*yield*/, (_a.sent()).messages
                                                            .fetch(interaction.message.id)];
                                                    case 2:
                                                        (_a.sent()).delete().catch(function (err) { });
                                                        resolve(false);
                                                        _a.label = 3;
                                                    case 3:
                                                        if (interaction.customId != "confirm")
                                                            return [2 /*return*/];
                                                        __1.client.removeListener("interactionCreate", checkFunction);
                                                        return [4 /*yield*/, __1.client.channels
                                                                .fetch(interaction.channelId)];
                                                    case 4: return [4 /*yield*/, (_a.sent()).messages
                                                            .fetch(interaction.message.id)];
                                                    case 5:
                                                        (_a.sent()).delete().catch(function (err) { });
                                                        resolve(true);
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); };
                                        return [4 /*yield*/, msg.channel.send({
                                                embeds: [new discord_js_1.MessageEmbed({
                                                        title: "Confirm new Entry",
                                                        description: "are you sure, that you want to add ```" + content + "``` to the blacklist?"
                                                    })],
                                                components: [new discord_js_1.MessageActionRow({
                                                        components: [new discord_js_1.MessageButton({
                                                                customId: "confirm",
                                                                style: "SUCCESS",
                                                                label: "Submit"
                                                            }), new discord_js_1.MessageButton({
                                                                customId: "decline",
                                                                style: "DANGER",
                                                                label: "Decline"
                                                            })]
                                                    })]
                                            }).catch(function (err) { return console.log(err); })];
                                    case 1:
                                        _a.sent();
                                        __1.client.addListener("interactionCreate", checkFunction);
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    confirm = _a.sent();
                    console.log(confirm);
                    if (!confirm)
                        return [2 /*return*/];
                    links = JSON.parse(fs_1.readFileSync(__dirname + "/../__shared/data/links.json", "utf-8").toString());
                    links.push(content);
                    fs_1.writeFileSync(__dirname + "/../__shared/data/links.json", JSON.stringify(links));
                    msg.react("<a:tick:878028360977113119>");
                    return [2 /*return*/];
            }
        });
    });
}
exports.handleCommands = handleCommands;
function authMember(member) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!member)
                return [2 /*return*/, false];
            if (member.permissions.has("ADMINISTRATOR"))
                return [2 /*return*/, true];
            if (member.id == JSON.parse(fs_1.readFileSync(__dirname + "/../../config.json", "utf-8")).ownerID)
                return [2 /*return*/, true];
            return [2 /*return*/, false];
        });
    });
}
