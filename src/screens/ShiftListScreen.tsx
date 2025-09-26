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
import { requestLocation } from '../utils/location';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Shifts'>;

const Logo = React.memo(({ uri }: { uri?: string }) => {
  const [error, setError] = React.useState(false);

  if (!uri || error) {
    return (
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          backgroundColor: '#e5e7eb',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 18 }}>🏢</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={{ width: 48, height: 48, borderRadius: 8 }}
      onError={() => setError(true)}
    />
  );
});

export const ShiftListScreen = observer(() => {
  const navigation = useNavigation<Nav>();

  useEffect(() => {
    (async () => {
      try {
        const { lat, lon } = await requestLocation();
        await shiftStore.loadByCoords(lat, lon);
      } catch {
        await shiftStore.loadMock();
      }
    })();
  }, []);

  const onRefresh = useCallback(async () => {
    try {
      const { lat, lon } = await requestLocation();
      await shiftStore.loadByCoords(lat, lon);
    } catch {
      await shiftStore.loadMock();
    }
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Shift }) => (
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
        <Logo uri={item.logo} />

        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '700' }}>{item.companyName}</Text>
          <Text style={{ color: '#555' }} numberOfLines={1}>
            {item.address}
          </Text>
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
    ),
    [navigation],
  );

  const isLoading = shiftStore.status === 'loading';
  const isError = shiftStore.status === 'error';

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Загружаем смены…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <Text style={{ textAlign: 'center' }}>Ошибка: {shiftStore.error}</Text>
        <Text style={{ marginTop: 8, color: '#666', textAlign: 'center' }}>
          Потяни вниз для повтора загрузки.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f4f6f8' }}>
      {shiftStore.usingDemoData && (
        <View
          style={{
            backgroundColor: '#FFF7CC',
            padding: 8,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: '#665C00' }}>
            Показаны демо-данные (сервер вернул пустой результат).
          </Text>
        </View>
      )}

      <FlatList
        data={shiftStore.shifts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshing={isLoading}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={{ paddingTop: 40, alignItems: 'center' }}>
            <Text>Смен рядом не нашлось.</Text>
            <Text style={{ color: '#666', marginTop: 4 }}>
              Потяни вниз, чтобы обновить.
            </Text>
          </View>
        }
        initialNumToRender={8}
        windowSize={7}
        removeClippedSubviews
      />
    </View>
  );
});
