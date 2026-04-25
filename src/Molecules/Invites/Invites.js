import React, { useState, useEffect, useCallback } from 'react'
import { FlatList, View, TouchableOpacity, RefreshControl } from 'react-native'
import { ActivityIndicator, Icon } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import {
  listReceivedInvites,
  acceptChallenge,
  refuseChallenge,
} from '../../services/participationService'
import {
  Container,
  Header,
  HeaderTitle,
  Body,
  EmptyText,
  InviteCard,
  ChallengeTitle,
  ChallengeInfo,
  ActionRow,
  AcceptBtn,
  RefuseBtn,
  BtnLabel,
} from './Invites.styles'

const formatDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Invites() {
  const navigation = useNavigation()

  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(false)
  const [actionId, setActionId] = useState(null)

  // Usa o novo endpoint /participations/received (filtra INVITED pelo JWT principal)
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const content = await listReceivedInvites()
      setInvites(content)
    } catch {
      // fail silently
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleAccept = async (participationId) => {
    setActionId(participationId)
    try {
      await acceptChallenge(participationId)
      setInvites((prev) => prev.filter((p) => p.id !== participationId))
    } catch {
      // fail silently
    } finally {
      setActionId(null)
    }
  }

  const handleRefuse = async (participationId) => {
    setActionId(participationId)
    try {
      await refuseChallenge(participationId)
      setInvites((prev) => prev.filter((p) => p.id !== participationId))
    } catch {
      // fail silently
    } finally {
      setActionId(null)
    }
  }

  return (
    <Container>
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon source="arrow-left" size={24} color="#1c1c1e" />
        </TouchableOpacity>
        <HeaderTitle>Convites</HeaderTitle>
        <View style={{ width: 24 }} />
      </Header>

      <Body>
        {loading ? (
          <ActivityIndicator color="#1c1c1e" style={{ marginTop: 48 }} />
        ) : invites.length === 0 ? (
          <EmptyText>Nenhum convite pendente{'\n'}por enquanto 🎯</EmptyText>
        ) : (
          <FlatList
            data={invites}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={load} tintColor="#1c1c1e" />
            }
            renderItem={({ item }) => {
              const busy = actionId === item.id
              return (
                <InviteCard>
                  <ChallengeTitle>{item.challenge.title}</ChallengeTitle>
                  <ChallengeInfo>
                    Por {item.challenge.creator.name} · Prazo: {formatDate(item.challenge.deadline)}
                  </ChallengeInfo>
                  <ActionRow>
                    <AcceptBtn onPress={() => handleAccept(item.id)} disabled={busy} activeOpacity={0.85}>
                      {busy ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <BtnLabel>Aceitar</BtnLabel>
                      )}
                    </AcceptBtn>
                    <RefuseBtn onPress={() => handleRefuse(item.id)} disabled={busy} activeOpacity={0.85}>
                      <BtnLabel light>Recusar</BtnLabel>
                    </RefuseBtn>
                  </ActionRow>
                </InviteCard>
              )
            }}
          />
        )}
      </Body>
    </Container>
  )
}
