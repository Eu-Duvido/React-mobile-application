import React, { useState, useEffect, useCallback } from 'react'
import { View, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native'
import { ProgressBar, Text, Icon, Button } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ChallengerRow from '../../Atoms/ChallengerRow/ChallengerRow'
import {
  acceptChallenge,
  refuseChallenge,
  listParticipationsByChallenge,
} from '../../services/participationService'
import { listProofsByChallenge, approveProof, rejectProof } from '../../services/proofService'
import { useUserContext } from '../../contexts/UserContext'

import {
  Overlay,
  SpaceBetween,
  StartAlign,
  TabsContainer,
  TabButton,
  BackgroundImageChallenge,
} from './Challenges.styled'

const DIFFICULTY_STARS = { EASY: 1, MEDIUM: 2, HARD: 3 }

const getDaysLeft = (deadline) => {
  if (!deadline) return 0
  const diff = new Date(deadline).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

const getRankIcon = (index) => {
  if (index === 0) return { icon: 'trophy', color: '#FFD700' }
  if (index === 1) return { icon: 'trophy', color: '#4A90E2' }
  if (index === 2) return { icon: 'trophy', color: '#8B5A2B' }
  return { icon: 'medal', color: '#777' }
}

const pad = (n) => String(n).padStart(2, '0')
const formatDateTime = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const PROOF_STATUS_LABEL = { approved: 'Aprovado', rejected: 'Recusado', pending: 'Aguardando' }
const PROOF_STATUS_COLOR = { approved: '#4CAF50', rejected: '#e53935', pending: '#FF9800' }
const getProofStatus = (p) => p.approved ? 'approved' : p.rejectionReason ? 'rejected' : 'pending'

export default function Challenges({ route }) {
  const { challenge, image } = route.params || {}
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const { user } = useUserContext()

  const [activeTab, setActiveTab] = useState('info')
  const [actionLoading, setActionLoading] = useState(false)
  const [scorers, setScorers] = useState([])
  const [loadingScorers, setLoadingScorers] = useState(false)
  const [proofs, setProofs] = useState([])
  const [loadingProofs, setLoadingProofs] = useState(false)
  const [approvingId, setApprovingId] = useState(null)

  const daysLeft = getDaysLeft(challenge?.deadline)
  const progressPercent = Math.round((challenge?.progress ?? 0) * 100)
  const stars = DIFFICULTY_STARS[challenge?.difficulty] ?? 0
  const participationStatus = challenge?.participationStatus
  const isCreator = challenge?.isCreator ?? false

  const loadScorers = useCallback(() => {
    if (!challenge?.id) return
    setLoadingScorers(true)
    listParticipationsByChallenge(challenge.id)
      .then((data) => setScorers(Array.isArray(data) ? data : []))
      .catch(() => setScorers([]))
      .finally(() => setLoadingScorers(false))
  }, [challenge?.id])

  const loadProofs = useCallback(() => {
    if (!challenge?.id) return
    setLoadingProofs(true)
    listProofsByChallenge(challenge.id)
      .then((data) => setProofs(Array.isArray(data) ? data : []))
      .catch(() => setProofs([]))
      .finally(() => setLoadingProofs(false))
  }, [challenge?.id])

  useEffect(() => {
    if (activeTab === 'leaders') loadScorers()
    if (activeTab === 'proofs') loadProofs()
  }, [activeTab, loadScorers, loadProofs])

  const handleAccept = async () => {
    if (!challenge?.participationId) return
    setActionLoading(true)
    try {
      await acceptChallenge(challenge.participationId)
      Alert.alert('Aceito!', 'Você aceitou o desafio. Boa sorte!')
      navigation.goBack()
    } catch (e) {
      Alert.alert('Erro', e.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRefuse = async () => {
    if (!challenge?.participationId) return
    setActionLoading(true)
    try {
      await refuseChallenge(challenge.participationId)
      Alert.alert('Recusado', 'Você recusou o desafio.')
      navigation.goBack()
    } catch (e) {
      Alert.alert('Erro', e.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleApprove = async (proofId) => {
    setApprovingId(proofId)
    try {
      await approveProof(proofId)
      setProofs((prev) => prev.map((p) =>
        p.id === proofId ? { ...p, approved: true, rejectionReason: null } : p
      ))
      loadScorers()
    } catch (e) {
      Alert.alert('Erro', e.message)
    } finally {
      setApprovingId(null)
    }
  }

  const handleReject = (proofId) => {
    Alert.alert(
      'Recusar evidência',
      'Tem certeza que deseja recusar esta evidência?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Recusar',
          style: 'destructive',
          onPress: async () => {
            setApprovingId(proofId)
            try {
              await rejectProof(proofId, null)
              setProofs((prev) => prev.map((p) =>
                p.id === proofId ? { ...p, approved: false, rejectionReason: 'Recusado' } : p
              ))
            } catch (e) {
              Alert.alert('Erro', e.message)
            } finally {
              setApprovingId(null)
            }
          },
        },
      ],
    )
  }

  const renderProofCard = (proof) => {
    const status = getProofStatus(proof)
    const statusColor = PROOF_STATUS_COLOR[status]
    const isMine = proof.submittedByUserId === user?.id
    const isProcessing = approvingId === proof.id
    const canAct = !isMine && status === 'pending'

    return (
      <View
        key={proof.id}
        style={{
          backgroundColor: '#fff',
          borderRadius: 14,
          padding: 14,
          marginBottom: 10,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Icon source={proof.mediaType === 'PHOTO' ? 'camera' : 'video'} size={18} color="#666" />
          <Text variant="bodyMedium" style={{ fontWeight: '600', marginLeft: 6, flex: 1 }}>
            {proof.submittedByUserName ?? '—'}
          </Text>
          <View style={{
            backgroundColor: statusColor + '22',
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}>
            <Text style={{ color: statusColor, fontSize: 11, fontWeight: '600' }}>
              {PROOF_STATUS_LABEL[status]}
            </Text>
          </View>
        </View>

        <Text variant="bodySmall" style={{ opacity: 0.5, marginBottom: 6 }}>
          {formatDateTime(proof.submittedAt)}
        </Text>

        {proof.aiValid != null && (
          <View style={{
            flexDirection: 'row', alignItems: 'center', marginBottom: 6,
            backgroundColor: proof.aiValid ? '#e8f5e9' : '#fff3e0',
            borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
          }}>
            <Text style={{ fontSize: 11, color: proof.aiValid ? '#388e3c' : '#e65100' }}>
              {proof.aiValid ? '✓ IA válida' : '⚠ IA inválida'}
              {proof.aiConfidence != null ? ` · ${Math.round(proof.aiConfidence * 100)}%` : ''}
            </Text>
          </View>
        )}

        {proof.rejectionReason ? (
          <Text variant="bodySmall" style={{ color: '#e53935', marginBottom: 6 }}>
            Motivo: {proof.rejectionReason}
          </Text>
        ) : null}

        {canAct && (
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
            <Button
              mode="contained"
              icon="check"
              onPress={() => handleApprove(proof.id)}
              loading={isProcessing}
              disabled={isProcessing}
              buttonColor="#4CAF50"
              contentStyle={{ height: 36 }}
              style={{ borderRadius: 10, flex: 1 }}
              labelStyle={{ fontSize: 13 }}
            >
              Aprovar
            </Button>
            <Button
              mode="outlined"
              icon="close"
              onPress={() => handleReject(proof.id)}
              disabled={isProcessing}
              textColor="#e53935"
              contentStyle={{ height: 36 }}
              style={{ borderRadius: 10, flex: 1, borderColor: '#e53935' }}
              labelStyle={{ fontSize: 13 }}
            >
              Recusar
            </Button>
          </View>
        )}

        {isMine && status === 'pending' && (
          <Text variant="bodySmall" style={{ opacity: 0.4, marginTop: 4, fontStyle: 'italic' }}>
            Sua evidência — aguardando aprovação
          </Text>
        )}
      </View>
    )
  }

  const renderActionButtons = () => {
    if (isCreator) {
      return (
        <View style={{ gap: 8, width: '100%', marginTop: 16, alignItems: 'center' }}>
          <Text variant="bodySmall" style={{ opacity: 0.5 }}>Você criou este desafio</Text>
          <Button
            mode="contained"
            icon="play"
            onPress={() => navigation.navigate('ChallengeProgress', { challenge, image })}
            contentStyle={{ height: 64, width: 300 }}
            style={{ borderRadius: 14 }}
            labelStyle={{ fontSize: 16, fontWeight: '600' }}
            buttonColor="#000"
          >
            Jogar
          </Button>
        </View>
      )
    }

    if (participationStatus === 'INVITED') {
      return (
        <View style={{ flexDirection: 'row', gap: 12, width: '100%', marginTop: 16, justifyContent: 'center' }}>
          <Button
            mode="contained"
            icon="check"
            onPress={handleAccept}
            loading={actionLoading}
            disabled={actionLoading}
            contentStyle={{ height: 64, width: 150 }}
            style={{ borderRadius: 14 }}
            labelStyle={{ fontSize: 16, fontWeight: '600' }}
            buttonColor="#000"
          >
            Aceitar
          </Button>
          <Button
            mode="outlined"
            icon="close"
            onPress={handleRefuse}
            disabled={actionLoading}
            contentStyle={{ height: 64, width: 150 }}
            style={{ borderRadius: 14 }}
            textColor="#000"
          >
            Recusar
          </Button>
        </View>
      )
    }

    if (participationStatus === 'ACCEPTED') {
      return (
        <View style={{ gap: 8, width: '100%', marginTop: 16, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'center' }}>
            <Button
              mode="contained"
              icon="play"
              onPress={() => navigation.navigate('ChallengeProgress', { challenge, image })}
              contentStyle={{ height: 64, width: 150 }}
              style={{ borderRadius: 14 }}
              labelStyle={{ fontSize: 16, fontWeight: '600' }}
              buttonColor="#000"
            >
              Jogar
            </Button>
            <Button
              mode="outlined"
              icon="close"
              onPress={handleRefuse}
              disabled={actionLoading}
              contentStyle={{ height: 64, width: 150 }}
              style={{ borderRadius: 14 }}
              textColor="#000"
            >
              Desistir
            </Button>
          </View>
        </View>
      )
    }

    if (participationStatus === 'COMPLETED') {
      return (
        <View style={{ alignItems: 'center', marginTop: 16, padding: 12, backgroundColor: '#f1f1f1', borderRadius: 14 }}>
          <Icon source="check-circle" size={24} color="#4CAF50" />
          <Text variant="bodySmall" style={{ marginTop: 4, color: '#4CAF50', fontWeight: '600' }}>
            Desafio concluído!
          </Text>
        </View>
      )
    }

    if (participationStatus === 'REFUSED') {
      return (
        <View style={{ alignItems: 'center', marginTop: 16, padding: 12, backgroundColor: '#f1f1f1', borderRadius: 14 }}>
          <Text variant="bodySmall" style={{ opacity: 0.5 }}>Você desistiu deste desafio</Text>
        </View>
      )
    }

    return null
  }

  return (
    <BackgroundImageChallenge
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 450 }}
      source={image}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: insets.top + 12,
          left: 16,
          zIndex: 10,
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderRadius: 999,
          padding: 8,
        }}
      >
        <Icon source="arrow-left" size={22} color="#1c1c1e" />
      </TouchableOpacity>

      <Overlay>
        <StartAlign>
          <TabsContainer>
            <TabButton active={activeTab === 'info'} onPress={() => setActiveTab('info')}>
              <Text style={{ color: activeTab === 'info' ? '#fff' : '#000', fontWeight: '500' }}>
                Detalhes
              </Text>
            </TabButton>
            <TabButton active={activeTab === 'leaders'} onPress={() => setActiveTab('leaders')}>
              <Text style={{ color: activeTab === 'leaders' ? '#fff' : '#000', fontWeight: '500' }}>
                Líderes
              </Text>
            </TabButton>
            <TabButton active={activeTab === 'proofs'} onPress={() => setActiveTab('proofs')}>
              <Text style={{ color: activeTab === 'proofs' ? '#fff' : '#000', fontWeight: '500' }}>
                Evidências
              </Text>
            </TabButton>
          </TabsContainer>

          {activeTab === 'info' && (
            <>
              <SpaceBetween>
                <Text variant="titleLarge">{challenge?.title}</Text>
                {stars > 0 && (
                  <View style={{ alignItems: 'center' }}>
                    <Text variant="bodySmall" style={{ marginBottom: 4 }}>Dificuldade</Text>
                    <View style={{ flexDirection: 'row' }}>
                      {Array.from({ length: stars }).map((_, i) => (
                        <Icon key={i} source="star" size={18} color="#000" />
                      ))}
                    </View>
                  </View>
                )}
              </SpaceBetween>

              <Text style={{ marginBottom: 20 }}>{challenge?.subtitle}</Text>

              <View style={{ width: '100%', marginBottom: 20 }}>
                <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
                  {progressPercent}% completo
                </Text>
                <ProgressBar
                  progress={challenge?.progress ?? 0}
                  color="#000"
                  style={{ height: 8, borderRadius: 4, backgroundColor: '#E0E0E0' }}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#fff',
                  padding: 12,
                  borderRadius: 20,
                  width: '100%',
                  height: 72,
                  marginBottom: 16,
                  shadowColor: '#000000ac',
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 3,
                  shadowOffset: { width: 0, height: 4 },
                }}
              >
                <View style={{ width: '50%', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Icon source="cat" size={32} color="#666" />
                  <Text variant="bodySmall">
                    {isCreator ? 'Criado por você' : `Por ${challenge?.creatorName ?? '—'}`}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Icon source="clock-outline" size={16} color="#666" />
                  <Text variant="bodySmall">
                    Faltam <Text style={{ fontWeight: '700' }}>{daysLeft} dias</Text>
                  </Text>
                </View>
              </View>

              {renderActionButtons()}
            </>
          )}

          {activeTab === 'leaders' && (
            <View style={{ width: '100%', flex: 1 }}>
              <Text variant="titleLarge" style={{ marginBottom: 12, textAlign: 'center' }}>
                Ranking
              </Text>
              {loadingScorers ? (
                <ActivityIndicator color="#1c1c1e" style={{ marginTop: 40 }} />
              ) : scorers.length === 0 ? (
                <Text variant="bodySmall" style={{ textAlign: 'center', opacity: 0.5, marginTop: 40 }}>
                  Nenhum participante ainda.
                </Text>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {scorers.map((item, index) => {
                    const rankIcon = getRankIcon(index)
                    const userName = item.user?.name ?? '—'
                    const userProgress = item.progress ?? 0
                    return (
                      <View
                        key={item.id}
                        style={{ backgroundColor: '#f1f1f1', borderRadius: 14, paddingHorizontal: 12, marginBottom: 8 }}
                      >
                        <ChallengerRow
                          avatar={item.user?.profileImageUrl
                            ? { uri: item.user.profileImageUrl }
                            : null}
                          name={`${index + 1}. ${userName}`}
                          points={userProgress}
                          rightIcon={<Icon source={rankIcon.icon} size={20} color={rankIcon.color} />}
                        />
                      </View>
                    )
                  })}
                </ScrollView>
              )}
            </View>
          )}

          {activeTab === 'proofs' && (
            <View style={{ width: '100%', flex: 1 }}>
              <Text variant="titleLarge" style={{ marginBottom: 12, textAlign: 'center' }}>
                Evidências
              </Text>
              {loadingProofs ? (
                <ActivityIndicator color="#1c1c1e" style={{ marginTop: 40 }} />
              ) : proofs.length === 0 ? (
                <Text variant="bodySmall" style={{ textAlign: 'center', opacity: 0.5, marginTop: 40 }}>
                  Nenhuma evidência enviada ainda.
                </Text>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {proofs.map(renderProofCard)}
                </ScrollView>
              )}
            </View>
          )}
        </StartAlign>
      </Overlay>
    </BackgroundImageChallenge>
  )
}
