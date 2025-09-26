import React from 'react';
import { enableScreens } from 'react-native-screens';
import { LogBox } from 'react-native';
import { RootNavigator } from './src/navigation';

enableScreens();

if (__DEV__) {
  LogBox.ignoreLogs([
    'Logging before InitGoogleLogging',
    'instanceHandle is null, event of type topMomentumScrollEnd will be dropped',
    'SO_NOWAKEFROMSLEEP failed',
  ]);
}

export default function App() {
  return <RootNavigator />;
}
