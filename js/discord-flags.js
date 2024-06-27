/*!
 * discord-flags.js - Part of the discord-flags project
 * https://github.com/lewisakura/discord-flags
 *
 * Copyright (c) 2024 Lewis Akura
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

(async function () {
    const userFlagsJson = await fetch("https://raw.githubusercontent.com/lewisakura/discord-flags/master/flags/user.json").then(r => r.json());
    const applicationFlagsJson = await fetch("https://raw.githubusercontent.com/lewisakura/discord-flags/master/flags/application.json").then(r => r.json());
    const DiscordFlags = {
        flags: { userFlags: userFlagsJson, applicationFlags: applicationFlagsJson },
        _checkFlags: function (flags, flagNumber) {
            let results = [];
            for (let i = 0; i <= 64; i++) {
                const bitwise = 1n << BigInt(i);
                if (flagNumber & bitwise) {
                    const flag = Object.entries(flags).find((f) => f[1].shift === i)?.[0] || `UNKNOWN_FLAG_${i}`;
                    results.push(flag);
                }
            }
            return results.join(", ") || "NONE";
        },
        getFlags: function (number, type = "both") {
            let flagNum, resp = {};
            try {
                flagNum = BigInt(number);
            } catch (e) {
                console.warn(e);
                return "Bad flag number";
            }
            resp.user = this._checkFlags(this.flags.userFlags, flagNum);
            resp.application = this._checkFlags(this.flags.applicationFlags, flagNum);
            switch (type) {
                case "user":
                    return resp.user;
                case "application":
                    return resp.application;
                case "both":
                default:
                    return resp;
            }
        }
    };
    window.DiscordFlags = DiscordFlags;
})();