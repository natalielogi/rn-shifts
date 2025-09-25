import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShiftListScreen } from '../screens/ShiftListScreen';
import { ShiftDetailsScreen } from '../screens/ShiftDetailsScreen';

export type RootStackParamList = {
  Shifts: undefined;
  ShiftDetails: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Shifts"
          component={ShiftListScreen}
          options={{ title: 'Смены' }}
        />
        <Stack.Screen
          name="ShiftDetails"
          component={ShiftDetailsScreen}
          options={{ title: 'Детали смены' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
