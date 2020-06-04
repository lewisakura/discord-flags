const flags = {
    DISCORD_EMPLOYEE: {
        description: 'User is a Discord employee.',
        number: 1 << 0
    },
    DISCORD_PARTNER: {
        description: 'User is a Discord partner.',
        number: 1 << 1
    },
    HYPESQUAD_EVENTS: {
        description: 'User is a HypeSquad Events member.',
        number: 1 << 2
    },
    BUG_HUNTER_LEVEL_1: {
        description: 'User is a Bug Hunter.',
        number: 1 << 3
    },
    MFA_SMS: {
        description: 'User has SMS 2FA enabled.',
        number: 1 << 4,
        undocumented: true
    },
    PREMIUM_PROMO_DISMISSED: {
        description: 'Unknown. Presumably some sort of Discord Nitro promotion that the user dismissed.',
        number: 1 << 5,
        undocumented: true
    },
    HOUSE_BRAVERY: {
        description: 'User is part of HypeSquad Bravery.',
        number: 1 << 6
    },
    HOUSE_BRILLIANCE: {
        description: 'User is part of HypeSquad Brilliance.',
        number: 1 << 7
    },
    HOUSE_BALANCE: {
        description: 'User is a part of HypeSquad Balance.',
        number: 1 << 8
    },
    EARLY_SUPPORTER: {
        description: 'User is an <a href="https://support.discord.com/hc/en-us/articles/360017949691-Grandfathered-Nitro-Classic-FAQ">Early Supporter</a>.',
        number: 1 << 9
    },
    TEAM_USER: {
        description: 'Account is a Team account.',
        number: 1 << 10
    },
    ONE_ELEVEN: {
        description: 'Unknown flag. <a href="https://github.com/LewisTehMinerz/discord-flags/issues/1">Join the hunt!</a>',
        number: 1 << 11,
        undocumented: true
    },
    SYSTEM: {
        description: 'Account is a Discord system account.',
        number: 1 << 12
    },
    HAS_UNREAD_URGENT_MESSAGES: {
        description: 'User has unread messages from Discord.',
        number: 1 << 13
    },
    BUG_HUNTER_LEVEL_2: {
        description: 'User has the gold Bug Hunter badge.',
        number: 1 << 14
    },
    UNDERAGE_DELETED: {
        description: 'Unused. User was deleted for being underage.',
        number: 1 << 15,
        undocumented: true
    },
    VERIFIED_BOT: {
        description: 'User is a verified bot.',
        number: 1 << 16
    },
    VERIFIED_BOT_DEVELOPER: {
        description: 'User is a verified bot developer.',
        number: 1 << 17
    }
};

function _checkFlags(flagNumber) {
    let results = [];

    for (let i = 0; i <= 30; i++) {
        const bitwise = (1 << i);

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
    return ((Math.log10(flag & -flag)) / Math.log10(2));
}

function calculate(e) {
    e.preventDefault();

    const result = document.getElementById('result');
    result.innerHTML = 'N/A';

    const flagNum = parseInt(document.getElementById('flags').value);

    if (isNaN(flagNum)) {
        result.innerHTML = 'Bad flag number (NaN)';
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
for (const flag of Object.keys(flags)) {
    const value = flags[flag].number;

    const row = table.insertRow(-1);
    const flagName = row.insertCell(0);
    const flagValue = row.insertCell(1);
    const flagDesc = row.insertCell(2);

    const bitshift = `(1 << ${_getShiftValue(value)})`;

    flagName.innerHTML = flag;

    if (flags[flag].undocumented)
        flagName.innerHTML += undocumented;

    flagValue.innerHTML = `${value} ${bitshift}`;
    flagDesc.innerHTML = flags[flag].description;
}

document.getElementById('flagForm').addEventListener('submit', calculate);

document.getElementById('helpLink').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('helpModal').classList.add('is-active');
});
document.getElementById('closeHelpModal').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('helpModal').classList.remove('is-active');
});
