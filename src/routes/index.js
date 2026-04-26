import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { useUserContext } from '../contexts/UserContext'
import HomeApp from '../Molecules/HomeApp/HomeApp'
import Challenges from '../Molecules/Challenges/Challenges'
import ChallengeProgress from '../Molecules/ChallengeProgress/ChallengeProgress'
import CreateChallenge from '../Molecules/CreateChallenge/CreateChallenge'
import Invites from '../Molecules/Invites/Invites'
import Login from '../Molecules/Login/Login'
import Dashboard from '../Molecules/Dashboard/Dashboard'
import InepDashboard from '../Molecules/InepDashboard/InepDashboard'

const Stack = createNativeStackNavigator()

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  )
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeApp} />
      <Stack.Screen name="Challenges" component={Challenges} />
      <Stack.Screen name="ChallengeProgress" component={ChallengeProgress} />
      <Stack.Screen name="CreateChallenge" component={CreateChallenge} />
      <Stack.Screen name="Invites" component={Invites} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="InepDashboard" component={InepDashboard} />
    </Stack.Navigator>
  )
}

export default function Routes() {
  const { user } = useUserContext()

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}
