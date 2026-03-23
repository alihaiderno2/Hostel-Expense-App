import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../services/api';


const { width, height } = Dimensions.get('window');

interface LoginProps {
  onLogin: () => void;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const router = useRouter();
  const auth = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return emailRegex;
  };

  const validateInputs = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    console.log('👆 Login button pressed');

    if (!validateInputs()) {
      return;
    }

    const result = await auth?.login(email, password);

    if(result?.success) {
      if(onLogin){
        onLogin();
      }else{
        router.replace('/');
      }
    }
    else {
      Alert.alert('Login Failed', result?.message || 'An error occurred during login');
    }

  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HOSTEL</Text>
        <Text style={styles.headerSubtitle}>EXPENSE MANAGER</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          scrollEventThrottle={16}
        >
          <Text style={styles.formTitle}>Sign In</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email Address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.footerText}>
              New here? <Text style={styles.boldText}>Create Account</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    height: height * 0.35,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 2,
  },
  headerSubtitle: {
    color: '#FFF',
    fontSize: 14,
    letterSpacing: 4,
    opacity: 0.8,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  formContainer: {
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 40,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
  },
  inputWrapper: {
    marginBottom: 24,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#EEE',
    height: 50,
    fontSize: 16,
    color: '#000',
    paddingBottom: 8,
  },
  inputError: {
    borderBottomColor: '#FF6B6B',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#000',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#666',
  },
  boldText: {
    color: '#000',
    fontWeight: 'bold',
  },
});