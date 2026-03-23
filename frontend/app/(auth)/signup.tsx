import Signup from '../../components/ui/Signup';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();

  const handleSignup = () => {
    console.log('Signup successful');
    router.replace('/(tabs)/dashboard');
  };

  return <Signup onSignup={handleSignup} />;
}
