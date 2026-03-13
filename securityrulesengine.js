const SECURITY_RULES = [
  {
    id: 'UAC_ENABLED',
    category: 'Access Control',
    description: 'User Account Control (UAC) enabled',
    weight: 10,
    check: (registry) => {
      const uacValue = registry['HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System']?.['EnableLUA'];
      return uacValue === 'dword:00000001' || uacValue === '0x1';
    },
    severity: 'critical',
    recommendation: 'Enable UAC to protect against unauthorized changes'
  },
  {
    id: 'FIREWALL_ENABLED',
    category: 'Network Security',
    description: 'Windows Defender Firewall enabled',
    weight: 12,
    check: (registry) => {
      const keys = Object.keys(registry).filter(k => k.includes('Windows Defender'));
      return keys.some(k => registry[k]['EnableFirewall'] === 'dword:00000001');
    },
    severity: 'critical',
    recommendation: 'Ensure Windows Defender Firewall is enabled for all profiles'
  },
  {
    id: 'DEFENDER_ENABLED',
    category: 'Malware Protection',
    description: 'Windows Defender real-time protection enabled',
    weight: 15,
    check: (registry) => {
      const defenderPath = 'HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows Defender';
      return registry[defenderPath]?.['DisableRealtimeMonitoring'] === 'dword:00000000';
    },
    severity: 'critical',
    recommendation: 'Enable real-time protection in Windows Defender'
  },
  {
    id: 'AUTORUN_DISABLED',
    category: 'Autorun Security',
    description: 'Autorun for removable media disabled',
    weight: 8,
    check: (registry) => {
      const autorunPath = 'HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer';
      return registry[autorunPath]?.['NoDriveTypeAutoRun'] === 'dword:000000ff';
    },
    severity: 'high',
    recommendation: 'Disable autorun to prevent malware from USB devices'
  },
  {
    id: 'AUTOMATIC_UPDATES',
    category: 'Updates & Patches',
    description: 'Automatic Windows Updates enabled',
    weight: 14,
    check: (registry) => {
      const updatePath = 'HKEY_LOCAL_MACHINE\\Software\\Policies\\Microsoft\\Windows\\WindowsUpdate\\AU';
      return registry[updatePath]?.['NoAutoUpdate'] === 'dword:00000000';
    },
    severity: 'critical',
    recommendation: 'Enable automatic updates for critical security patches'
  },
  {
    id: 'PASSWORD_COMPLEXITY',
    category: 'Account Security',
    description: 'Password complexity requirements enforced',
    weight: 10,
    check: (registry) => {
      const policyPath = 'HKEY_LOCAL_MACHINE\\System\\CurrentControlSet\\Services\\Netlogon\\Parameters';
      return registry[policyPath]?.['RequireSignOrSeal'] === 'dword:00000001';
    },
    severity: 'high',
    recommendation: 'Enforce strong password complexity requirements'
  },
  {
    id: 'RDP_ENCRYPTION',
    category: 'Remote Access',
    description: 'RDP traffic encryption enabled',
    weight: 9,
    check: (registry) => {
      const rdpPath = 'HKEY_LOCAL_MACHINE\\System\\CurrentControlSet\\Control\\Terminal Server\\WinStations\\RDP-Tcp';
      return registry[rdpPath]?.['SecurityLayer'] === 'dword:00000002';
    },
    severity: 'high',
    recommendation: 'Enable encryption for Remote Desktop Protocol connections'
  }
];
