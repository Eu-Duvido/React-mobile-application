import { PaperProvider } from 'react-native-paper'
import { useFonts } from 'expo-font'
import { Text } from 'react-native'
import Routes from './src/routes'
import { theme } from './src/Theme/Theme'
import { UserProvider } from './src/contexts/UserContext'

export default function App() {
  const [fontsLoaded] = useFonts({
    OdibeeSans: require('./assets/fonts/OdibeeSans-Regular.ttf'),
    BebasNeue: require('./assets/fonts/BebasNeue-Regular.ttf'),
    Sora: require('./assets/fonts/Sora-VariableFont_wght.ttf'),
  })

  if (!fontsLoaded) {
    return <Text>Carregando fontes...</Text>
  }

  return (
    <PaperProvider theme={theme}>
      <UserProvider>
        <Routes />
      </UserProvider>
    </PaperProvider>
  )
}
