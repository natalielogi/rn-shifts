import React from 'react';
import { enableScreens } from 'react-native-screens';
import { RootNavigator } from './src/navigation';

enableScreens();

export default function App() {
  return <RootNavigator />;
}
