import React from 'react';
import { View, Platform, useWindowDimensions } from 'react-native';
import { Sidebar } from './Sidebar';

type Props = { children: React.ReactNode };

/**
 * Wraps every page with:
 *  - Desktop (≥768px web): 256px fixed sidebar on the left, content fills the rest
 *  - Mobile: transparent pass-through (bottom tabs + page own layout unchanged)
 */
export function AppLayout({ children }: Props) {
  const { width } = useWindowDimensions();
  const isDesktop  = Platform.OS === 'web' && width >= 768;

  if (!isDesktop) return <>{children}</>;

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Sidebar />
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </View>
  );
}
