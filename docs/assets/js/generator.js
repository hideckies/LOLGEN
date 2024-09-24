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

function obfsBase64(payload, cli) {
    if (cli === 'Command Prompt') {
        return '# No available on Command Prompt';
    } else {
        return `powershell.exe -nop -noni -w hid -e ${toBase64(payload)}`;
    }
}

function obfsSplit(payload, cli) {
    chars = []
    for (i = 0; i < payload.length; i++) {
        if (payload[i] == ' ') {
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

function obfs(payload, cli, optObfs) {
    switch (optObfs) {
        case 'Base64':
            return obfsBase64(payload, cli);
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
    // Update the payload element
    const elemCode = document.getElementById('payload_1_pre_code');
    elemCode.textContent = payload;
    if (cli) {
        elemCli.style.display = 'inline';
        elemCli.textContent = 'Run on ' + cli;
    } else {
        elemCli.style.display = 'none';
    }
}

function genPayload2() {
    const optPurpose = document.getElementById('options_1_purpose').value;
    const optBin = document.getElementById('options_1_bin').value;
    let payload = document.getElementById('payload_1_pre_code').innerText;
    const optObfs = document.getElementById('options_2_obfs').value;

    const target = PAYLOADS[optPurpose][optBin];
    const cli = target['cli'];
    const adminRequired = target['adminRequired'];
    const mitre = target['mitre'];

    payload = obfs(payload, cli, optObfs);

    // // Update the ATT&CK ID element
    // const elemMitreLink = document.getElementById('options_2_mitre_link');
    // if (mitre) {
    //     elemMitreLink.href = mitre['url'];
    //     elemMitreLink.textContent = mitre['id'];
    //     elemMitreLink.style.display = ''
    // } else {
    //     elemMitreLink.style.display = 'none';
    // }
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

function update1() {
    const optPurpose = document.getElementById('options_1_purpose').value;
    const optBin = document.getElementById('options_1_bin').value;

    genPayload1(optPurpose, optBin);
    const optObfs = document.getElementById('options_2_obfs').value;
    genPayload2(optObfs);
}

function update2() {
    const optObfs = document.getElementById('options_2_obfs').value;
    genPayload2(optObfs);
}

function updatePurpose() {
    const optPurpose = document.getElementById('options_1_purpose').value;
    updateSelectBinElem(optPurpose);
    update1();
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