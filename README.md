# RN Shifts

Тестовое: React Native (CLI, TypeScript, без Expo).  
Приложение показывает список смен рядом с пользователем (по геолокации) и экран деталей.
Данные для деталей берём из уже загруженного списка (без повторного запроса).

## Стек

- React Native CLI + TypeScript
- react-navigation / native-stack
- MobX (mobx, mobx-react-lite)
- react-native-geolocation-service

## Как запустить (iOS)

```bash
npm i
npx pod-install
# терминал 1
npx react-native start
# терминал 2
npm run ios   # или открыть ios/RnShifts.xcworkspace в Xcode и Cmd+R
```
