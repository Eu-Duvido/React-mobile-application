import React from 'react'
import { TouchableOpacity, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BottomBar, SideButton, FabButton } from './AppMenu.styles'

export default function AppMenu() {
  return (
    <SafeAreaView
      edges={['bottom']}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        pointerEvents: 'box-none',
      }}
    >
      <BottomBar>
        <TouchableOpacity>
          <SideButton>
            <Ionicons name="home" size={26} color="#fff" />
          </SideButton>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={{
            marginBottom: Platform.OS === 'ios' ? 12 : 0,
          }}
        >
          <FabButton>
            <Ionicons name="add" size={32} color="#000" />
          </FabButton>
        </TouchableOpacity>

        <TouchableOpacity>
          <SideButton>
            <Ionicons name="notifications" size={26} color="#fff" />
          </SideButton>
        </TouchableOpacity>
      </BottomBar>
    </SafeAreaView>
  )
}
