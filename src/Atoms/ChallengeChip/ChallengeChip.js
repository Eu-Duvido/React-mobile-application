import { useState, useMemo, useCallback } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { Text } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'
import {
  Header,
  CarrouselContainer,
  CarrouselItem,
  CarrouselWrapper,
} from './ChallengeChip.styles'
import ChallengeCards from '../ChallengeCards/ChallengeCards'
import { useChallenges } from '../../hooks/useChallenges'

const CHIPS = [
  { label: 'Ativos', status: 'active' },
  { label: 'Concluídos', status: 'completed' },
  { label: 'Derrotado', status: 'defeated' },
]

export default function ChallengeChip({ userId, search = '' }) {
  const [selected, setSelected] = useState('active')
  const [showAll, setShowAll] = useState(false)
  const { challenges, loading, error, refetch } = useChallenges(userId)

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch])
  )

  const listFiltered = useMemo(() => {
    let list = showAll ? challenges : challenges.filter((item) => item.status === selected)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((item) => item.title?.toLowerCase().includes(q))
    }
    return list
  }, [showAll, selected, challenges, search])

  return (
    <>
      <Header>
        <Text variant="bodyLarge" style={{ fontWeight: 'bold' }}>
          Meus desafios
        </Text>
        <Text
          variant="bodyMedium"
          style={{ opacity: 0.7 }}
          onPress={() => setShowAll((prev) => !prev)}
        >
          {showAll ? 'Filtrar desafios' : 'Ver todos'}
        </Text>
      </Header>

      <CarrouselWrapper>
        <CarrouselContainer>
          {CHIPS.map((item) => {
            const isActive = selected === item.status
            return (
              <CarrouselItem
                key={item.status}
                active={isActive}
                activeOpacity={showAll ? 1 : 0.8}
                disabled={showAll}
                style={{ opacity: showAll ? 0.4 : 1 }}
                onPress={() => {
                  if (!showAll) setSelected(item.status)
                }}
              >
                <Text
                  variant="bodyMedium"
                  style={{
                    color: '#fff',
                    opacity: isActive ? 1 : 0.8,
                    fontWeight: isActive ? '600' : '400',
                  }}
                >
                  {item.label}
                </Text>
              </CarrouselItem>
            )
          })}
        </CarrouselContainer>
      </CarrouselWrapper>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#1c1c1e" size="large" />
        </View>
      ) : error ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text variant="bodyMedium" style={{ opacity: 0.5, textAlign: 'center' }}>
            Não foi possível carregar os desafios.{'\n'}Verifique se o backend está rodando na porta 8080.
          </Text>
        </View>
      ) : (
        <ChallengeCards challenges={listFiltered} />
      )}
    </>
  )
}
