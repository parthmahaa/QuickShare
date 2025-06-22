import React, { useState } from 'react';
import { Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, TextField } from '@mui/material';
import { Clock, Shield, Download } from 'lucide-react';
import { ShareSettings as ShareSettingsType } from '../types/types';

interface ShareSettingsProps {
  onSettingsChange: (settings: ShareSettingsType) => void;
}

const ShareSettings: React.FC<ShareSettingsProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<ShareSettingsType>({
    expirationTime: 24,
    maxDownloads: undefined,
    requirePassword: false,
    password: '',
  });

  const handleSettingChange = (key: keyof ShareSettingsType, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const expirationOptions = [
    { value: 1, label: '1 Hour' },
    { value: 6, label: '6 Hours' },
    { value: 24, label: '24 Hours' },
    { value: 72, label: '3 Days' },
    { value: 168, label: '1 Week' },
    { value: 720, label: '1 Month' },
  ];

  return (
    <Card className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <Typography variant="h6" className="font-semibold text-blue-800">
            Share Settings
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormControl fullWidth>
            <InputLabel className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Expiration Time</span>
            </InputLabel>
            <Select
              value={settings.expirationTime}
              onChange={(e) => handleSettingChange('expirationTime', e.target.value)}
              className="bg-white"
            >
              {expirationOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            type="number"
            label="Max Downloads (Optional)"
            value={settings.maxDownloads || ''}
            onChange={(e) => handleSettingChange('maxDownloads', e.target.value ? parseInt(e.target.value) : undefined)}
            InputProps={{
              startAdornment: <Download className="w-4 h-4 text-gray-400 mr-2" />,
            }}
            className="bg-white rounded-lg"
            placeholder="Unlimited"
          />
        </div>

        <div className="mt-6 space-y-4">
          <FormControlLabel
            control={
              <Switch
                checked={settings.requirePassword}
                onChange={(e) => handleSettingChange('requirePassword', e.target.checked)}
                color="primary"
              />
            }
            label="Require password for access"
            className="text-gray-700"
          />

          {settings.requirePassword && (
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={settings.password}
              onChange={(e) => handleSettingChange('password', e.target.value)}
              className="bg-white rounded-lg"
              placeholder="Enter password"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShareSettings;