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
    title: 'Estudo diário',
    subtitle: 'Estudar 2 horas por dia durante 30 dias',
    progress: 0.7,
    status: 'active',
    genre: 'education',
    difficulty: 'hard',
  },
  {
    title: 'Prática de exercícios',
    subtitle: 'Resolver 10 exercícios de programação por dia',
    progress: 0.4,
    status: 'active',
    genre: 'education',
    difficulty: 'medium',
  },
  {
    title: 'Leitura acadêmica',
    subtitle: 'Ler 20 páginas de um livro técnico por dia',
    progress: 0.6,
    status: 'active',
    genre: 'education',
    difficulty: 'easy',
  },
  {
    title: 'Revisão de conteúdo',
    subtitle: 'Revisar matérias estudadas durante a semana',
    progress: 0.5,
    status: 'pending',
    genre: 'education',
    difficulty: 'medium',
  },
  {
    title: 'Criar resumo',
    subtitle: 'Fazer resumos das aulas da semana',
    progress: 0.1,
    status: 'pending',
    genre: 'education',
    difficulty: 'easy',
  },
  {
    title: 'Novo curso',
    subtitle: 'Iniciar um curso online de programação',
    progress: 0,
    status: 'pending',
    genre: 'education',
    difficulty: 'medium',
  },
  {
    title: 'Curso concluído',
    subtitle: 'Finalizar um curso completo online',
    progress: 1,
    status: 'completed',
    genre: 'education',
    difficulty: 'hard',
  },
  {
    title: 'Semana de estudos',
    subtitle: 'Estudar todos os dias durante 7 dias',
    progress: 1,
    status: 'completed',
    genre: 'education',
    difficulty: 'medium',
  },
  {
    title: 'Currículo atualizado',
    subtitle: 'Adicionar novos cursos e certificações no currículo',
    progress: 1,
    status: 'completed',
    genre: 'education',
    difficulty: 'easy',
  },
  {
    title: 'Plano de estudos falhou',
    subtitle: 'Não seguir o plano de estudos semanal',
    progress: 0.2,
    status: 'defeated',
    genre: 'education',
    difficulty: 'medium',
  },
  {
    title: 'Rotina de estudos',
    subtitle: 'Manter rotina de estudos pela manhã',
    progress: 0.3,
    status: 'defeated',
    genre: 'education',
    difficulty: 'hard',
  },
  {
    title: 'Estudar inglês',
    subtitle: 'Praticar inglês todos os dias',
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
