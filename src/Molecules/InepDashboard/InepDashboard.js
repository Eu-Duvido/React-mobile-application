import { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

// InepDashboard foi unificado no Dashboard principal.
// Esta tela existe apenas para não quebrar navegações antigas.
export default function InepDashboard() {
  const navigation = useNavigation()
  useEffect(() => {
    navigation.replace('Dashboard')
  }, [navigation])
  return null
}
