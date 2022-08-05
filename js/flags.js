const misc =
    'This flag is currently not known but is potentially used. If you have information about this flag, submit your information at the bottom of the page!';

let userFlags;
let applicationFlags;

function _checkFlags(flags, flagNumber) {
    let results = [];

    for (let i = 0; i <= 64; i++) {
        const bitwise = 1n << BigInt(i);

        if (flagNumber & bitwise) {
            const flag = Object.entries(flags).find(f => f[1].shift === i)?.[0] || `UNKNOWN_FLAG_${i}`;
            results.push(flag);
        }
    }

    return results.join(', ') || 'NONE';
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

    result.innerHTML = `<b>User:</b> ${_checkFlags(userFlags, flagNum)}<br><b>Application:</b> ${_checkFlags(
        applicationFlags,
        flagNum
    )}`;
}

const undocumented = `<span class="icon">
    <span class="fa-stack" style="font-size: 8px;" data-tooltip="This flag is undocumented.">
        <i class="fas fa-file fa-stack-2x"></i>
        <i class="fas fa-times fa-stack-1x fa-inverse" style="padding-top: 2px;"></i>
    </span>
</span>`;

const userTable = document.getElementById('userFlags').getElementsByTagName('tbody')[0];
const applicationTable = document.getElementById('applicationFlags').getElementsByTagName('tbody')[0];

function insertFlag(flag, table, flagData) {
    const row = table.insertRow(-1);
    const flagName = row.insertCell(0);
    const flagValue = row.insertCell(1);
    const flagDesc = row.insertCell(2);

    flagName.innerHTML = flag;

    if (flagData.undocumented) flagName.innerHTML += undocumented;

    flagValue.innerHTML = `${flagData.value} (1 << ${flagData.bitshift})`;
    flagDesc.innerHTML = flagData.description;
}

const users = fetch('/flags/user.json')
    .then(res => res.json())
    .then(f => {
        userFlags = f;

        for (const flag of Object.keys(userFlags)) {
            const shift = userFlags[flag].shift;

            insertFlag(flag, userTable, {
                description: userFlags[flag].description,
                bitshift: shift,
                value: 1n << BigInt(shift),
                undocumented: userFlags[flag].undocumented
            });
        }

        document.getElementById('userLoading').style.display = 'none';
    });

const apps = fetch('/flags/application.json')
    .then(res => res.json())
    .then(f => {
        applicationFlags = f;

        for (const flag of Object.keys(applicationFlags)) {
            const shift = applicationFlags[flag].shift;

            insertFlag(flag, applicationTable, {
                description: applicationFlags[flag].description,
                bitshift: shift,
                value: 1n << BigInt(shift),
                undocumented: applicationFlags[flag].undocumented
            });
        }

        document.getElementById('applicationLoading').style.display = 'none';
    });

Promise.all([users, apps]).then(() => {
    document.getElementById('flagForm').addEventListener('submit', calculate);
    document.getElementById('flagFormSubmit').attributes.removeNamedItem('disabled');
});
