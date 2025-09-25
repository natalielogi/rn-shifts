import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation';
import { shiftStore } from '../stores/ShiftStore';

export function ShiftDetailsScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'ShiftDetails'>>();
  const { id } = route.params;
  const shift = shiftStore.getById(id);

  if (!shift) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Смена не найдена</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <Image
          source={{ uri: shift.logo }}
          style={{ width: 64, height: 64, borderRadius: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '800' }}>
            {shift.companyName}
          </Text>
          <Text style={{ color: '#555' }}>{shift.address}</Text>
        </View>
      </View>

      <View style={{ gap: 4 }}>
        <Text>Дата: {shift.dateStartByCity}</Text>
        <Text>
          Время: {shift.timeStartByCity}–{shift.timeEndByCity}
        </Text>
        <Text>Тип работ: {shift.workTypes}</Text>
        <Text>
          Набор: {shift.currentWorkers}/{shift.planWorkers}
        </Text>
        <Text>Оплата: {shift.priceWorker} ₽</Text>
        <Text>
          Рейтинг клиента: ⭐ {shift.customerRating} (
          {shift.customerFeedbacksCount} отзывов)
        </Text>
      </View>
    </ScrollView>
  );
}
