import Signup from '../components/ui/Signup';

export default function Page() {
  return <Signup onSignup={() => console.log('Signup Pressed')} />;
}