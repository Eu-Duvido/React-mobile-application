import { TouchableOpacity, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { BottomBar, SideButton, FabButton } from './AppMenu.styles'

export default function AppMenu() {
  const navigation = useNavigation()

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        pointerEvents: 'box-none',
      }}
    >
      <BottomBar>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <SideButton>
            <Ionicons name="grid-outline" size={26} color="#fff" />
          </SideButton>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={{ marginBottom: Platform.OS === 'ios' ? 12 : 0 }}
          onPress={() => navigation.navigate('CreateChallenge')}
        >
          <FabButton>
            <Ionicons name="add" size={32} color="#000" />
          </FabButton>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Invites')}>
          <SideButton>
            <Ionicons name="notifications" size={26} color="#fff" />
          </SideButton>
        </TouchableOpacity>
      </BottomBar>
    </SafeAreaView>
  )
}
