import React, { useState, useEffect, useCallback } from 'react'
import { View, ScrollView, Modal, Alert, RefreshControl, Platform } from 'react-native'
import { Text, Icon, ProgressBar, Button, ActivityIndicator } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { listProofsByChallenge, approveProof, rejectProof } from '../../services/proofService'
import { submitProof, selfJoinChallenge } from '../../services/participationService'
import { useUserContext } from '../../contexts/UserContext'
import {
  HeroWrapper, HeroOverlay, HeroTitle, HeroSubtitle, BackButton,
  StatsCard, ProgressLabel, StatsRow, StatItem, StatValue, StatLabel, StatDivider,
  SectionTitle,
  DayRow, DayBadge, DayLine,
  ProofCard, ProofRow, ProofIconWrap, ProofMeta, ProofTime,
  StatusPill, StatusPillText, AIPill, AIPillText, RejectionBox, RejectionText,
  EmptyBox, EmptyText,
  SubmitFab, SubmitFabLabel,
  ModalBackdrop, ModalSheet, ModalTitle, PickerButton, PickerLabel, PickerSub, PreviewThumb,
} from './ChallengeProgress.styles'

const GOAL_TYPE_LABEL = {
  HOURS: 'horas', PAGES: 'páginas', EXERCISES: 'exercícios',
  SESSIONS: 'sessões', CUSTOM: 'unidades',
}

const pad = (n) => String(n).padStart(2, '0')
const formatTime = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}
const formatDateShort = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`
const getDaysLeft = (deadline) => {
  if (!deadline) return 0
  return Math.max(0, Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000))
}
const getDayNumber = (submittedAt, createdAt) => {
  const start = createdAt ? new Date(createdAt).getTime() : Date.now()
  return Math.max(1, Math.ceil((new Date(submittedAt).getTime() - start) / 86400000))
}
const groupProofsByDay = (proofs, createdAt) => {
  const groups = {}
  proofs.forEach((p) => {
    const n = getDayNumber(p.submittedAt, createdAt)
    if (!groups[n]) groups[n] = { dayNum: n, date: new Date(p.submittedAt), proofs: [] }
    groups[n].proofs.push(p)
  })
  return Object.values(groups).sort((a, b) => a.dayNum - b.dayNum)
}
const getProofStatus = (p) => p.approved ? 'approved' : p.rejectionReason ? 'rejected' : 'pending'
const STATUS_LABEL = { approved: 'Aprovado', rejected: 'Recusado', pending: 'Aguardando' }

const UserAvatar = ({ name, size = 36 }) => {
  const initials = name ? name.trim().charAt(0).toUpperCase() : '?'
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: '#1c1c1e', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Text style={{ color: '#fff', fontSize: size * 0.4, fontWeight: '700' }}>{initials}</Text>
    </View>
  )
}

export default function ChallengeProgress({ route }) {
  const { challenge, image } = route.params || {}
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const { user } = useUserContext()

  const [proofs, setProofs] = useState([])
  const [loadingProofs, setLoadingProofs] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [pickedAsset, setPickedAsset] = useState(null)
  const [proofType, setProofType] = useState('PHOTO')
  const [submitting, setSubmitting] = useState(false)
  const [approvingId, setApprovingId] = useState(null)
  const [participationId, setParticipationId] = useState(challenge?.participationId ?? null)

  const progressPercent = Math.round((challenge?.progress ?? 0) * 100)
  const daysLeft = getDaysLeft(challenge?.deadline)
  const goalLabel = GOAL_TYPE_LABEL[challenge?.goalType] ?? 'unidades'
  const isCreator = challenge?.isCreator ?? false
  const isAccepted = isCreator || challenge?.participationStatus === 'ACCEPTED'
  const isCompleted = challenge?.participationStatus === 'COMPLETED'
  const dayGroups = groupProofsByDay(proofs, challenge?.createdAt)

  const myProofsCount = proofs.filter((p) => p.submittedByUserId === user?.id).length
  const approvedCount = proofs.filter((p) => p.approved).length

  // Auto self-join for creator with no participation record
  useEffect(() => {
    if (isCreator && !participationId && challenge?.id) {
      selfJoinChallenge(challenge.id)
        .then((p) => setParticipationId(p.id))
        .catch(() => {})
    }
  }, [isCreator, participationId, challenge?.id])

  const loadProofs = useCallback(async () => {
    if (!challenge?.id) return
    setLoadingProofs(true)
    try {
      const data = await listProofsByChallenge(challenge.id)
      setProofs(Array.isArray(data) ? data : [])
    } catch {
      // fail silently
    } finally {
      setLoadingProofs(false)
    }
  }, [challenge?.id])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadProofs()
    setRefreshing(false)
  }, [loadProofs])

  useEffect(() => { loadProofs() }, [loadProofs])

  const handleApprove = async (proofId) => {
    setApprovingId(proofId)
    try {
      await approveProof(proofId)
      setProofs((prev) => prev.map((p) =>
        p.id === proofId ? { ...p, approved: true, rejectionReason: null } : p
      ))
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

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita acesso à galeria nas configurações do app.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 0.85,
      allowsEditing: false,
    })
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0]
      setPickedAsset(asset)
      setProofType(asset.type === 'video' ? 'VIDEO' : 'PHOTO')
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita acesso à câmera nas configurações do app.')
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.85,
      allowsEditing: false,
    })
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0]
      setPickedAsset(asset)
      setProofType('PHOTO')
    }
  }

  const handleSubmitProof = async () => {
    if (!pickedAsset) {
      Alert.alert('Selecione uma mídia', 'Tire uma foto ou escolha da galeria.')
      return
    }
    setSubmitting(true)
    try {
      const isVideo = pickedAsset.type === 'video'
      const mimeType = pickedAsset.mimeType ?? (isVideo ? 'video/mp4' : 'image/jpeg')
      const ext = mimeType.split('/')[1] ?? (isVideo ? 'mp4' : 'jpg')
      const fileName = pickedAsset.fileName ?? `proof.${ext}`
      const mediaTypeStr = isVideo ? 'VIDEO' : 'PHOTO'

      let fileObj
      if (Platform.OS === 'web') {
        const res = await fetch(pickedAsset.uri)
        const blob = await res.blob()
        fileObj = new File([blob], fileName, { type: mimeType })
      } else {
        fileObj = { uri: pickedAsset.uri, type: mimeType, name: fileName }
      }

      await submitProof(participationId, fileObj, mediaTypeStr, null, null)
      Alert.alert('Enviado!', 'Evidência enviada. Aguarde a aprovação.')
      setModalVisible(false)
      setPickedAsset(null)
      setProofType('PHOTO')
      await loadProofs()
    } catch (e) {
      Alert.alert('Erro ao enviar', e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const closeModal = () => {
    if (submitting) return
    setModalVisible(false)
    setPickedAsset(null)
  }

  const renderProofCard = (proof) => {
    const status = getProofStatus(proof)
    const isPhoto = proof.mediaType === 'PHOTO'
    const isMine = proof.submittedByUserId === user?.id
    const isProcessing = approvingId === proof.id
    const canAct = !isMine && status === 'pending'
    const userName = proof.submittedByUserName ?? '—'

    return (
      <ProofCard key={proof.id}>
        {/* User row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 }}>
          <UserAvatar name={userName} size={34} />
          <View style={{ flex: 1 }}>
            <Text variant="bodyMedium" style={{ fontWeight: '700', color: '#1c1c1e' }}>
              {isMine ? 'Você' : userName}
            </Text>
            <ProofTime>{formatTime(proof.submittedAt)}</ProofTime>
          </View>
          <StatusPill status={status}>
            <StatusPillText status={status}>{STATUS_LABEL[status]}</StatusPillText>
          </StatusPill>
        </View>

        {/* Media type indicator */}
        <ProofRow>
          <ProofIconWrap>
            <Icon source={isPhoto ? 'camera' : 'video'} size={22} color="#1c1c1e" />
          </ProofIconWrap>
          <ProofMeta>
            <Text variant="bodyMedium" style={{ fontWeight: '600', color: '#1c1c1e' }}>
              {isPhoto ? 'Foto' : 'Vídeo'}
            </Text>
          </ProofMeta>
        </ProofRow>

        {proof.aiValid != null && (
          <AIPill valid={proof.aiValid}>
            <AIPillText valid={proof.aiValid}>
              {proof.aiValid ? '✓ IA válida' : '⚠ IA inválida'}
              {proof.aiConfidence != null ? ` · ${Math.round(proof.aiConfidence * 100)}%` : ''}
            </AIPillText>
          </AIPill>
        )}

        {proof.rejectionReason ? (
          <RejectionBox>
            <RejectionText>Motivo: {proof.rejectionReason}</RejectionText>
          </RejectionBox>
        ) : null}

        {/* Approve / Reject actions */}
        {canAct && (
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <Button
              mode="contained"
              icon="check"
              onPress={() => handleApprove(proof.id)}
              loading={isProcessing}
              disabled={isProcessing}
              buttonColor="#4CAF50"
              contentStyle={{ height: 40 }}
              style={{ borderRadius: 12, flex: 1 }}
              labelStyle={{ fontSize: 13 }}
            >
              Aprovar +1pt
            </Button>
            <Button
              mode="outlined"
              icon="close"
              onPress={() => handleReject(proof.id)}
              disabled={isProcessing}
              textColor="#e53935"
              contentStyle={{ height: 40 }}
              style={{ borderRadius: 12, flex: 1, borderColor: '#e53935' }}
              labelStyle={{ fontSize: 13 }}
            >
              Recusar
            </Button>
          </View>
        )}

        {isMine && status === 'pending' && (
          <Text variant="bodySmall" style={{ opacity: 0.4, marginTop: 8, fontStyle: 'italic' }}>
            Sua evidência — aguardando aprovação de outro participante
          </Text>
        )}
      </ProofCard>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 88 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
      >
        <HeroWrapper source={image} style={{ height: 240 + insets.top }}>
          <BackButton
            onPress={() => navigation.goBack()}
            style={{ top: insets.top + 12 }}
            activeOpacity={0.8}
          >
            <Icon source="arrow-left" size={22} color="#1c1c1e" />
          </BackButton>

          <HeroOverlay>
            <HeroTitle numberOfLines={2}>{challenge?.title}</HeroTitle>
            <HeroSubtitle>
              {isCompleted
                ? '✅ Desafio concluído!'
                : `${daysLeft} dias restantes · Meta: ${challenge?.goalValue} ${goalLabel}`}
            </HeroSubtitle>
          </HeroOverlay>
        </HeroWrapper>

        {/* Stats card */}
        <StatsCard>
          <ProgressLabel>
            <Text variant="bodySmall" style={{ color: '#888' }}>Seu progresso</Text>
            <Text variant="bodySmall" style={{ fontWeight: '700', color: '#1c1c1e' }}>
              {progressPercent}%
            </Text>
          </ProgressLabel>
          <ProgressBar
            progress={challenge?.progress ?? 0}
            color="#1c1c1e"
            style={{ height: 8, borderRadius: 4, backgroundColor: '#e8e8e8' }}
          />
          <StatsRow>
            <StatItem>
              <StatValue>{myProofsCount}</StatValue>
              <StatLabel>Minhas envios</StatLabel>
            </StatItem>
            <StatDivider />
            <StatItem>
              <StatValue>{approvedCount}</StatValue>
              <StatLabel>Aprovadas total</StatLabel>
            </StatItem>
            <StatDivider />
            <StatItem>
              <StatValue>{daysLeft}</StatValue>
              <StatLabel>Dias restantes</StatLabel>
            </StatItem>
          </StatsRow>
        </StatsCard>

        <View style={{ paddingHorizontal: 16, paddingTop: 64 }}>
          <SectionTitle>Histórico do desafio</SectionTitle>

          {loadingProofs ? (
            <ActivityIndicator color="#1c1c1e" style={{ marginTop: 40 }} />
          ) : dayGroups.length === 0 ? (
            <EmptyBox>
              <Icon source="image-off-outline" size={44} color="#ccc" />
              <EmptyText>
                Nenhuma evidência enviada ainda.
                {isAccepted ? '\nToque em "Enviar evidência" para começar!' : ''}
              </EmptyText>
            </EmptyBox>
          ) : (
            dayGroups.map(({ dayNum, date, proofs: dayProofs }) => (
              <View key={dayNum}>
                <DayRow>
                  <DayBadge>
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>
                      {dayNum}
                    </Text>
                  </DayBadge>
                  <Text style={{ fontSize: 12, color: '#888' }}>
                    Dia {dayNum} · {formatDateShort(date)} · {dayProofs.length} evidência{dayProofs.length !== 1 ? 's' : ''}
                  </Text>
                  <DayLine />
                </DayRow>
                {dayProofs.map(renderProofCard)}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {isAccepted && (
        <SubmitFab
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
          style={{ bottom: insets.bottom + 16 }}
        >
          <Icon source="plus" size={20} color="#fff" />
          <SubmitFabLabel>Enviar evidência</SubmitFabLabel>
        </SubmitFab>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <ModalBackdrop>
          <ModalSheet>
            <ModalTitle>Nova evidência</ModalTitle>

            {pickedAsset && (
              <PreviewThumb
                source={{ uri: pickedAsset.uri }}
                resizeMode="cover"
              />
            )}

            {!pickedAsset && (
              <>
                <PickerButton onPress={takePhoto} activeOpacity={0.75}>
                  <Icon source="camera" size={28} color="#1c1c1e" />
                  <View>
                    <PickerLabel>Tirar foto</PickerLabel>
                    <PickerSub>Abrir câmera do dispositivo</PickerSub>
                  </View>
                </PickerButton>

                <PickerButton onPress={pickFromGallery} activeOpacity={0.75}>
                  <Icon source="image-multiple" size={28} color="#1c1c1e" />
                  <View>
                    <PickerLabel>Escolher da galeria</PickerLabel>
                    <PickerSub>Foto ou vídeo existente</PickerSub>
                  </View>
                </PickerButton>
              </>
            )}

            {pickedAsset && !submitting && (
              <Button
                mode="outlined"
                onPress={() => setPickedAsset(null)}
                textColor="#1c1c1e"
                style={{ borderRadius: 12 }}
                icon="refresh"
              >
                Trocar mídia
              </Button>
            )}

            {pickedAsset && (
              <Button
                mode="contained"
                onPress={handleSubmitProof}
                loading={submitting}
                disabled={submitting}
                buttonColor="#1c1c1e"
                style={{ borderRadius: 14 }}
                contentStyle={{ height: 52 }}
              >
                Confirmar envio
              </Button>
            )}

            <Button
              mode="text"
              onPress={closeModal}
              disabled={submitting}
              textColor="#888"
            >
              Cancelar
            </Button>
          </ModalSheet>
        </ModalBackdrop>
      </Modal>
    </View>
  )
}
