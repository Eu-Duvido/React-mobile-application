import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HomeApp from '../Molecules/HomeApp/HomeApp'
import Challenges from '../Molecules/Challenges/Challenges'

const Stack = createNativeStackNavigator()

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeApp} />
        <Stack.Screen name="Challenges" component={Challenges} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
