import React from 'react';
import { View, Text, Switch, Button } from 'react-native';
import usePreferences from './usePreferences';
import NotificationService from '../../lib/notifications/NotificationService';

export const SettingsScreen: React.FC = () => {
  const { prefs, save } = usePreferences();

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ color: '#fff', fontSize: 18 }}>Settings</Text>
      <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ color: '#fff' }}>Enable Notifications</Text>
        <Switch value={!!prefs.notificationsEnabled} onValueChange={(v) => save({ notificationsEnabled: v })} />
      </View>

      <View style={{ marginTop: 12 }}>
        <Button title="Test Notification" onPress={async () => { await NotificationService.scheduleLocalNotification('Test', 'This is a test', new Date(Date.now() + 5000)); }} />
      </View>
    </View>
  );
};

export default SettingsScreen;
