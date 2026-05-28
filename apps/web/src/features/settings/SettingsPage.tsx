import React, { useEffect, useState } from 'react';

export const SettingsPage: React.FC = () => {
  const [prefs, setPrefs] = useState(() => ({ theme: localStorage.getItem('theme') || 'system', notificationsEnabled: localStorage.getItem('notificationsEnabled') !== 'false' }));

  useEffect(() => { localStorage.setItem('theme', prefs.theme); localStorage.setItem('notificationsEnabled', String(!!prefs.notificationsEnabled)); }, [prefs]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Settings</h2>
      <div style={{ marginTop: 12 }}>
        <label>Theme: </label>
        <select value={prefs.theme} onChange={(e) => setPrefs({ ...prefs, theme: e.target.value })}>
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div style={{ marginTop: 12 }}>
        <label>
          <input type="checkbox" checked={!!prefs.notificationsEnabled} onChange={(e) => setPrefs({ ...prefs, notificationsEnabled: e.target.checked })} /> Enable Notifications
        </label>
      </div>
    </div>
  );
};

export default SettingsPage;
