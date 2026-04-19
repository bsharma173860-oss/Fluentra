import React from 'react';
import { View, Platform, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Sidebar } from './Sidebar';
import { LanguageSidebar } from './LanguageSidebar';

type Props = {
  children:      React.ReactNode;
  languageCode?: string;  // explicit override (language pages pass this directly)
};

export function AppLayout({ children, languageCode: propCode }: Props) {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  // Also read from URL params — covers module select pages reached from a language page
  const params    = useLocalSearchParams();
  const paramCode = (params.languageCode ?? params.code) as string | undefined;

  const languageCode = propCode ?? paramCode ?? null;

  if (!isDesktop) return <>{children}</>;

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {languageCode
        ? <LanguageSidebar code={languageCode} />
        : <Sidebar />
      }
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </View>
  );
}
