import { Redirect } from 'expo-router';

export default function Index() {
  // Check if user is authenticated
  // For now, always redirect to login
  const isAuthenticated = false;

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return <Redirect href="/(auth)/login" />;
}