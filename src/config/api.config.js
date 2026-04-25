import { Platform } from 'react-native'

// Android Emulator usa 10.0.2.2 para acessar localhost da máquina host.
// iOS Simulator e web usam localhost diretamente.
// Em dispositivo físico, troque por o IP local da sua máquina (ex: 192.168.1.X).
export const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8080/api/v1',
  ios: 'http://localhost:8080/api/v1',
  default: 'http://localhost:8080/api/v1',
})
