import Login from '../../components/ui/Login';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = () => {
    console.log('Login successful');
    router.replace('/(tabs)/dashboard');
  };

  return <Login onLogin={handleLogin} />;
}
