import React, { useState, useMemo } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Text } from 'react-native-paper'
import {
  Header,
  CarrouselContainer,
  CarrouselItem,
  CarrouselWrapper,
} from './ChallengeChip.styles'
import ChallengeCards from '../ChallengeCards/ChallengeCards'

export default function ChallengeChip() {
  const navigation = useNavigation()

  const [selected, setSelected] = useState('active')
  const [showAll, setShowAll] = useState(false)

  /* ===== CHIPS ===== */
  const challenges = [
    { label: 'Ativos', status: 'active' },
    { label: 'Pendentes', status: 'pending' },
    { label: 'Concluídos', status: 'completed' },
    { label: 'Derrotado', status: 'defeated' },
  ]

  /* ===== LISTA COMPLETA ===== */
  const challengeList = [
    {
      title: 'Vá ao boxe',
      subtitle: 'Vá 30 dias consecutivos para o boxe',
      progress: 0.7,
      status: 'active',
      genre: 'fitness',
      difficulty: 'hard',
    },
    {
      title: 'Corrida matinal',
      subtitle: 'Correr 5km três vezes por semana',
      progress: 0.4,
      status: 'active',
      genre: 'fitness',
      difficulty: 'medium',
    },
    {
      title: 'Leitura diária',
      subtitle: 'Ler 20 páginas por dia',
      progress: 0.6,
      status: 'active',
      genre: 'education',
      difficulty: 'easy',
    },
    {
      title: 'Exame médico',
      subtitle: 'Realizar check-up anual',
      progress: 0.5,
      status: 'pending',
      genre: 'health',
      difficulty: 'medium',
    },
    {
      title: 'Organizar finanças',
      subtitle: 'Criar planilha de gastos mensais',
      progress: 0.1,
      status: 'pending',
      genre: 'finance',
      difficulty: 'easy',
    },
    {
      title: 'Curso online',
      subtitle: 'Iniciar curso de programação',
      progress: 0,
      status: 'pending',
      genre: 'education',
      difficulty: 'medium',
    },
    {
      title: 'Projeto finalizado',
      subtitle: 'Concluir projeto pessoal',
      progress: 1,
      status: 'completed',
      genre: 'fitness',
      difficulty: 'hard',
    },
    {
      title: 'Semana sem açúcar',
      subtitle: 'Evitar açúcar por 7 dias',
      progress: 1,
      status: 'completed',
      genre: 'health',
      difficulty: 'medium',
    },
    {
      title: 'Perfil atualizado',
      subtitle: 'Atualizar currículo e LinkedIn',
      progress: 1,
      status: 'completed',
      genre: 'career',
      difficulty: 'easy',
    },
    {
      title: 'Dieta falhou',
      subtitle: 'Não manter a dieta',
      progress: 0.2,
      status: 'defeated',
      genre: 'health',
      difficulty: 'medium',
    },
    {
      title: 'Acordar cedo',
      subtitle: 'Acordar às 6h por 14 dias',
      progress: 0.3,
      status: 'defeated',
      genre: 'habit',
      difficulty: 'hard',
    },
    {
      title: 'Estudar inglês',
      subtitle: 'Estudar inglês todos os dias',
      progress: 0.4,
      status: 'defeated',
      genre: 'education',
      difficulty: 'medium',
    },
  ]

  const listFiltered = useMemo(() => {
    if (showAll) return challengeList
    return challengeList.filter((item) => item.status === selected)
  }, [showAll, selected])

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
          {challenges.map((item) => {
            const isActive = selected === item.status

            return (
              <CarrouselItem
                key={item.status}
                active={isActive}
                activeOpacity={showAll ? 1 : 0.8}
                disabled={showAll}
                style={{ opacity: showAll ? 0.4 : 1 }}
                onPress={() => {
                  if (showAll) return
                  setSelected(item.status)
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

      <ChallengeCards challenges={listFiltered} />
    </>
  )
}
