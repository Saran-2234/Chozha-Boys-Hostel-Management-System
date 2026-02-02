import React, { useState } from 'react';
import Button from '../Common/Button';
import SessionManager from '../../Common/SessionManager';

const Settings = () => {
  const [settings, setSettings] = useState({


  });

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const saveSettings = () => {
    // In a real app, this would save to backend
    alert('Settings saved successfully!');
  };

  const resetToDefaults = () => {
    // Reset to default settings
    setSettings({


    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
        <p className="text-slate-400">Configure system preferences and settings</p>
      </div>

      {/* Session Management */}
      <SessionManager />



      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button
          onClick={saveSettings}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Save Settings
        </Button>
        <Button
          onClick={resetToDefaults}
          className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg"
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default Settings;
