import React, { useState, useContext} from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Dimensions, 
  ImageBackground,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../context/AuthContext';  
import { api } from '../../services/api';


const { width, height } = Dimensions.get('window');

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const router = useRouter();
  const auth = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('👆 Login button pressed'); // Add this
    if(!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
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
      {/* Black Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HOSTEL</Text>
        <Text style={styles.headerSubtitle}>EXPENSE MANAGER</Text>
      </View>

      {/* Diagonal Split (Matching your image) */}
      <View style={styles.diagonalClip} />

      {/* White Form Section */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Sign In</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="Email Address" 
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none" 
        />

        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.footerText}>
            New here? <Text style={styles.boldText}>Create Account</Text>
          </Text>
        </TouchableOpacity>
      </View>
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
    height: height * 0.4,
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
  diagonalClip: {
    height: 100,
    backgroundColor: '#000',
    borderBottomRightRadius: width * 2, // Creates the diagonal slant
    transform: [{ scaleX: 2 }],
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#EEE',
    height: 50,
    fontSize: 16,
    marginBottom: 30,
    color: '#000',
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