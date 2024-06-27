// THIS FUNCTION DOES NOT WORK, it is used as a reference for the actual function in discord-flags.js

const DiscordFlags = {
    flags: { userFlags, applicationFlags },
    _checkFlags: function (flags, flagNumber) {
        let results = [];
        for (let i = 0; i <= 64; i++) {
            const bitwise = 1n << BigInt(i);
            if (flagNumber & bitwise) {
                const flag = Object.entries(flags).find((f) => f[1].shift === i)?.[0] || `UNKNOWN_FLAG_${i}`;
                results.push(flag);
            };
        };
        return results.join(", ") || "NONE";
    },
    getFlags: function (number, type = "both") {
        let flagNum, resp = {};
        try {
            flagNum = BigInt(number);
        } catch (e) {
            console.warn(e);
            return "Bad flag number";
        };
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