import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../context/auth';
import { supabase } from '../../lib/supabase';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'client' | 'employee'>('client');
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleSignUp = async () => {
    try {
      setError('');
      
      if (!name || !email || !password || !confirmPassword) {
        setError('All fields are required');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        setError(signUpError.message || 'Failed to create account');
        return;
      }

      if (!signUpData.user?.id) {
        setError('Failed to create account: No user ID');
        return;
      }

      // Check if email confirmation is required
      if (signUpData.session === null) {
        setError('Please check your email for confirmation link before signing in');
        return;
      }

      const { error: profileError } = await supabase.from('users').insert({
        id: signUpData.user.id,
        email,
        name,
        role,
        created_at: new Date().toISOString()
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        
        // If the error is about unique violation, it means the email is already taken
        if (profileError.code === '23505') {
          setError('This email is already registered');
        } else {
          setError(profileError.message || 'Failed to create user profile');
        }
        return;
      }

      // After successful signup, try to sign in automatically
      await signIn(email, password);
    } catch (e) {
      console.error('Sign up error:', e);
      setError('An unexpected error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === 'client' && styles.roleButtonActive
          ]}
          onPress={() => setRole('client')}
        >
          <Text style={[
            styles.roleButtonText,
            role === 'client' && styles.roleButtonTextActive
          ]}>
            Dealership
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === 'employee' && styles.roleButtonActive
          ]}
          onPress={() => setRole('employee')}
        >
          <Text style={[
            styles.roleButtonText,
            role === 'employee' && styles.roleButtonTextActive
          ]}>
            Service Provider
          </Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <Link href="/sign-in" style={styles.link}>
        <Text>Already have an account? Sign in</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  roleButton: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  roleButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  roleButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#ff3b30',
    marginBottom: 10,
    textAlign: 'center',
  },
  link: {
    marginTop: 15,
    alignItems: 'center',
  },
});