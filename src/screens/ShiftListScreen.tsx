import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { shiftStore } from '../stores/ShiftStore';
import type { Shift } from '../types/Shift';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { useNavigation } from '@react-navigation/native';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Shifts'>;

export const ShiftListScreen = observer(() => {
  const navigation = useNavigation<Nav>();

  useEffect(() => {
    shiftStore.loadMock();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Shift }) => {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('ShiftDetails', { id: item.id })}
          style={{
            flexDirection: 'row',
            padding: 12,
            gap: 12,
            backgroundColor: '#fff',
            borderRadius: 12,
            marginBottom: 10,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <Image
            source={{ uri: item.logo }}
            style={{ width: 48, height: 48, borderRadius: 8 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '700' }}>{item.companyName}</Text>
            <Text style={{ color: '#555' }}>{item.address}</Text>
            <Text style={{ marginTop: 4 }}>
              {item.timeStartByCity}–{item.timeEndByCity} • {item.workTypes}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontWeight: '800' }}>{item.priceWorker} ₽</Text>
            <Text style={{ color: '#777' }}>
              ⭐ {item.customerRating} ({item.customerFeedbacksCount})
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [navigation],
  );

  if (shiftStore.status === 'loading') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Загружаем смены…</Text>
      </View>
    );
  }

  if (shiftStore.status === 'error') {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <Text>Ошибка: {shiftStore.error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f4f6f8' }}>
      <FlatList
        data={shiftStore.shifts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
});
