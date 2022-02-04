const flags = {
    DISCORD_EMPLOYEE: {
        description: 'User is a Discord employee.',
        number: 1n << 0n
    },
    DISCORD_PARTNER: {
        description: 'User is a Discord partner.',
        number: 1n << 1n
    },
    HYPESQUAD_EVENTS: {
        description: 'User is a HypeSquad Events member.',
        number: 1n << 2n
    },
    BUG_HUNTER_LEVEL_1: {
        description: 'User is a Bug Hunter.',
        number: 1n << 3n
    },
    MFA_SMS: {
        description: 'User has SMS 2FA enabled.',
        number: 1n << 4n,
        undocumented: true
    },
    PREMIUM_PROMO_DISMISSED: {
        description: 'Unknown. Presumably some sort of Discord Nitro promotion that the user dismissed.',
        number: 1n << 5n,
        undocumented: true
    },
    HOUSE_BRAVERY: {
        description: 'User is part of HypeSquad Bravery.',
        number: 1n << 6n
    },
    HOUSE_BRILLIANCE: {
        description: 'User is part of HypeSquad Brilliance.',
        number: 1n << 7n
    },
    HOUSE_BALANCE: {
        description: 'User is a part of HypeSquad Balance.',
        number: 1n << 8n
    },
    EARLY_SUPPORTER: {
        description:
            'User is an <a href="https://support.discord.com/hc/en-us/articles/360017949691-Grandfathered-Nitro-Classic-FAQ">Early Supporter</a>.',
        number: 1n << 9n
    },
    TEAM_PSEUDO_USER: {
        description: 'Account is a Team account.',
        number: 1n << 10n
    },
    INTERNAL_APPLICATION: {
        description:
            'An internal flag accidentally leaked to the client\'s private flags. <a href="https://cdn.discordapp.com/attachments/734022007771103237/734699443818987570/Screenshot_20200720-101245.jpg">Relates to partner/verification applications</a> but nothing else is known.',
        number: 1n << 11n,
        undocumented: true
    },
    SYSTEM: {
        description: 'Account is a Discord system account.',
        number: 1n << 12n,
        undocumented: true
    },
    HAS_UNREAD_URGENT_MESSAGES: {
        description: 'User has unread messages from Discord.',
        number: 1n << 13n,
        undocumented: true
    },
    BUG_HUNTER_LEVEL_2: {
        description: 'User has the gold Bug Hunter badge.',
        number: 1n << 14n
    },
    UNDERAGE_DELETED: {
        description: 'Unused. User was deleted for being underage.',
        number: 1n << 15n,
        undocumented: true
    },
    VERIFIED_BOT: {
        description: 'User is a verified bot.',
        number: 1n << 16n
    },
    VERIFIED_BOT_DEVELOPER: {
        description: 'User is a verified bot developer.',
        number: 1n << 17n
    },
    CERTIFIED_MODERATOR: {
        description: 'User is a Discord certified moderator.',
        number: 1n << 18n
    },
    BOT_HTTP_INTERACTIONS: {
        description: 'Bot is an HTTP interaction.',
        number: 1n << 19n
    },
    SPAMMER: {
        description: 'User is marked as a spammer.',
        number: 1n << 20n,
        undocumented: true
    },
    UNKNOWN_FLAG_37: {
        description: 'User has a premium discriminator',
        number: 1n << 37n,
        undocumented: true
    },
    UNKNOWN_FLAG_38: {
        description: 'User has used the desktop client',
        number: 1n << 38n,
        undocumented: true
    },
    UNKNOWN_FLAG_39: {
        description: 'User has used the web client',
        number: 1n << 39n,
        undocumented: true
    },
    UNKNOWN_FLAG_40: {
        description: 'User has used the mobile client',
        number: 1n << 40n,
        undocumented: true
    },
    DISABLED: {
        description: 'User is currently temporarily or permanently disabled.',
        number: 1n << 41n,
        undocumented: true
    },
    UNKNOWN_FLAG_43: {
        description: 'User has a verified email',
        number: 1n << 43n,
        undocumented: true
    }
};
const misc = 'This flag is currently not known but is potentially used. If you have information about this flag, submit your information at the bottom of the page!';

function _checkFlags(flagNumber) {
    let results = [];

    for (let i = 0n; i <= 64n; i++) {
        const bitwise = 1n << i;

        if (flagNumber & bitwise) {
            const flag = _getKeyByValue(flags, bitwise) || `UNKNOWN_FLAG_${i}`;
            results.push(flag);
        }
    }

    return results.join(', ') || 'NONE';
}

function _getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key].number === value);
}

function _getShiftValue(flag) {
    let shifted = 0;
    while (flag > 0n) {
        flag = flag >> 1n;
        shifted++;
    }
    return shifted - 1;
}

function calculate(e) {
    e.preventDefault();

    const result = document.getElementById('result');
    result.innerHTML = 'N/A';

    let flagNum;

    try {
        flagNum = BigInt(document.getElementById('flags').value);
    } catch (e) {
        result.innerHTML = 'Bad flag number';
        console.warn(e);
        return;
    }

    result.innerHTML = _checkFlags(flagNum);
}

const undocumented = `<span class="icon">
    <span class="fa-stack" style="font-size: 8px;" data-tooltip="This flag is undocumented.">
        <i class="fas fa-file fa-stack-2x"></i>
        <i class="fas fa-times fa-stack-1x fa-inverse" style="padding-top: 2px;"></i>
    </span>
</span>`;

const table = document.getElementById('knownFlags');
const flagsGoUpTo = 43;
const seenFlags = [];

function insertFlag(flag, flagData) {
    const row = table.insertRow(-1);
    const flagName = row.insertCell(0);
    const flagValue = row.insertCell(1);
    const flagDesc = row.insertCell(2);

    flagName.innerHTML = flag;

    if (flagData.undocumented) flagName.innerHTML += undocumented;

    flagValue.innerHTML = `${flagData.value} (1 << ${flagData.bitshift})`;
    flagDesc.innerHTML = flagData.description;
}

for (const flag of Object.keys(flags)) {
    const value = flags[flag].number;
    const shift = _getShiftValue(value);

    // if a flag is missing...
    if (shift > 0 && !seenFlags.includes(shift - 1)) {
        // loop over until we hit a seen flag
        let missingFlagStart = shift;
        do {
            missingFlagStart--;
        } while (!seenFlags.includes(missingFlagStart));
        missingFlagStart++; // because the loop ends when we hit a seen flag

        // now add all the missing flags with placeholder data
        for (let i = missingFlagStart; i < shift; i++) {
            insertFlag(`UNKNOWN_FLAG_${i}`, {
                description: misc,
                bitshift: i,
                value: 1n << BigInt(i),
                undocumented: true
            });

            seenFlags.push(i);
        }
    }

    insertFlag(flag, {
        description: flags[flag].description,
        bitshift: shift,
        value: value,
        undocumented: flags[flag].undocumented
    });

    seenFlags.push(shift);
}

for (let i = 0; i <= flagsGoUpTo; i++) {
    if (seenFlags.includes(i)) continue;

    insertFlag(`UNKNOWN_FLAG_${i}`, {
        description: misc,
        bitshift: i,
        value: 1n << BigInt(i),
        undocumented: true
    });

    seenFlags.push(i);
}

document.getElementById('flagForm').addEventListener('submit', calculate);

document.getElementById('helpLink').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('helpModal').classList.add('is-active');
});
document.getElementById('closeHelpModal').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('helpModal').classList.remove('is-active');
});
