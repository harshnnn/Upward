import { useState } from 'react';
import { Button, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../hooks/use-auth';

export const LoginScreen = () => {
  const { signIn, status, error } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    await signIn({ email, password, clientType: 'mobile' });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 32, fontWeight: '700' }}>Sign in</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={{ borderWidth: 1, padding: 12, borderRadius: 12 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, padding: 12, borderRadius: 12 }} />
      <Button title={status === 'loading' ? 'Signing in...' : 'Sign in'} onPress={submit} />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <TouchableOpacity onPress={() => navigation.navigate('Signup' as never)}>
        <Text style={{ textAlign: 'center', marginTop: 8 }}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
};
