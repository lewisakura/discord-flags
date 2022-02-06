const misc =
    'This flag is currently not known but is potentially used. If you have information about this flag, submit your information at the bottom of the page!';

let flags;

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

const table = document.getElementById('knownFlags').getElementsByTagName('tbody')[0];
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

fetch('/flags.json')
    .then(res => res.json())
    .then(f => {
        flags = f;

        for (const flag of Object.keys(flags)) {
            const shift = flags[flag].shift;

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
                value: 1n << BigInt(shift),
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
        document.getElementById('loading').style.display = 'none';
    });
