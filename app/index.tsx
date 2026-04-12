import { Redirect } from 'expo-router';

// RouteGuard in _layout.tsx handles auth-based routing.
// This just ensures the root path is handled.
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
