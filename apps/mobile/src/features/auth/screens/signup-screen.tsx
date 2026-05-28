import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../hooks/use-auth';

export const SignupScreen = () => {
  const { signUp, status, error } = useAuth();
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    await signUp({ email, password, displayName, clientType: 'mobile' });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 32, fontWeight: '700' }}>Create account</Text>
      <TextInput placeholder="Display name" value={displayName} onChangeText={setDisplayName} style={{ borderWidth: 1, padding: 12, borderRadius: 12 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={{ borderWidth: 1, padding: 12, borderRadius: 12 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, padding: 12, borderRadius: 12 }} />
      <Button title={status === 'loading' ? 'Creating...' : 'Create account'} onPress={submit} />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
        <Text style={{ textAlign: 'center', marginTop: 8 }}>Back to sign in</Text>
      </TouchableOpacity>
    </View>
  );
};
