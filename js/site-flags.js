function calculateFlags(e) {
    e.preventDefault();
    const result = document.getElementById("result");
    result.innerHTML = "N/A";
    let flagNum;
    try {
        flagNum = BigInt(document.getElementById("flags").value);
    } catch (e) {
        result.innerHTML = "Bad flag number";
        console.warn(e);
        return;
    }
    result.innerHTML = `<b>User:</b> ${DiscordFlags.getFlags(flagNum, 'user')}<br><b>Application:</b> ${DiscordFlags.getFlags(flagNum, 'application')}`;
}

const undocumented = `<span class="icon">
    <span class="fa-stack" style="font-size: 8px;" data-tooltip="This flag is undocumented.">
        <i class="fas fa-file fa-stack-2x"></i>
        <i class="fas fa-times fa-stack-1x fa-inverse" style="padding-top: 2px;"></i>
    </span>
</span>`;

const userTable = document.getElementById("userFlags").getElementsByTagName("tbody")[0];
const applicationTable = document.getElementById("applicationFlags").getElementsByTagName("tbody")[0];

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

// Display user flags
for (const flag of Object.keys(DiscordFlags.flags.userFlags)) {
    const shift = DiscordFlags.flags.userFlags[flag].shift;
    insertFlag(flag, userTable, {
        description: DiscordFlags.flags.userFlags[flag].description,
        bitshift: shift,
        value: 1n << BigInt(shift),
        undocumented: DiscordFlags.flags.userFlags[flag].undocumented
    });
}
document.getElementById("userLoading").style.display = "none";

// Display application flags
for (const flag of Object.keys(DiscordFlags.flags.applicationFlags)) {
    const shift = DiscordFlags.flags.applicationFlags[flag].shift;
    insertFlag(flag, applicationTable, {
        description: DiscordFlags.flags.applicationFlags[flag].description,
        bitshift: shift,
        value: 1n << BigInt(shift),
        undocumented: DiscordFlags.flags.applicationFlags[flag].undocumented
    });
}
document.getElementById("applicationLoading").style.display = "none";

// Enable the form
document.getElementById("flagForm").addEventListener("submit", calculateFlags);
document.getElementById("flagFormSubmit").attributes.removeNamedItem("disabled");