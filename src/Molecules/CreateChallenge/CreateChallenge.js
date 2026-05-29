import React, { useState, useEffect } from 'react'
import { View, Switch, TouchableOpacity } from 'react-native'
import { TextInput, ActivityIndicator, Checkbox, Text, Button, Icon } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useUserContext } from '../../contexts/UserContext'
import { createChallenge } from '../../services/challengeService'
import { createParticipation } from '../../services/participationService'
import { listUsers } from '../../services/userService'
import {
  Container,
  Header,
  HeaderTitle,
  Body,
  FieldLabel,
  ToggleRow,
  ToggleLabel,
  SectionTitle,
  UserRow,
  UserName,
  UserEmail,
  SubmitButton,
  SubmitLabel,
  ErrorMsg,
} from './CreateChallenge.styles'

const DIFFICULTY_VALUES = ['EASY', 'MEDIUM', 'HARD']
const GOAL_TYPE_VALUES = ['HOURS', 'PAGES', 'EXERCISES', 'SESSIONS', 'CUSTOM']
const DEADLINE_DAYS_OPTIONS = [7, 15, 30, 60]

export default function CreateChallenge() {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { user } = useUserContext()

  const difficultyOptions = DIFFICULTY_VALUES.map((v) => ({
    value: v,
    label: t(`createChallenge.difficulty.${v}`),
  }))

  const goalTypeOptions = GOAL_TYPE_VALUES.map((v) => ({
    value: v,
    label: t(`createChallenge.goalType.${v}`),
  }))

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadlineDays, setDeadlineDays] = useState(7)
  const [locationRequired, setLocationRequired] = useState(false)
  const [difficulty, setDifficulty] = useState('MEDIUM')
  const [subject, setSubject] = useState('')
  const [goalType, setGoalType] = useState('HOURS')
  const [goalValue, setGoalValue] = useState('')

  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [error, setError] = useState(null)

  const computeDeadline = (days) => {
    const pad = (n) => String(n).padStart(2, '0')
    const d = new Date()
    d.setDate(d.getDate() + days)
    d.setSeconds(0, 0)
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`
  }

  useEffect(() => {
    const load = async () => {
      setLoadingUsers(true)
      try {
        const all = await listUsers()
        setUsers(all.filter((u) => u.id !== user?.id))
      } catch {
        // Falha silenciosa — seção de amigos fica vazia
      } finally {
        setLoadingUsers(false)
      }
    }
    load()
  }, [user])

  const toggleUser = (uid) => {
    setSelectedUsers((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid],
    )
  }

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setError(t('createChallenge.errors.requiredFields'))
      return
    }
    const parsedGoal = parseInt(goalValue, 10)
    if (isNaN(parsedGoal) || parsedGoal < 1) {
      setError(t('createChallenge.errors.invalidGoal'))
      return
    }
    setLoading(true)
    setError(null)
    try {
      const challenge = await createChallenge({
        title,
        description,
        deadline: computeDeadline(deadlineDays),
        locationRequired,
        difficulty,
        subject: subject.trim() || null,
        goalType,
        goalValue: parsedGoal,
      })

      // Convida usuários selecionados via POST /participations {userId, challengeId}
      await Promise.allSettled(
        selectedUsers.map((uid) => createParticipation({ userId: uid, challengeId: challenge.id })),
      )

      navigation.goBack()
    } catch (e) {
      setError(e.message || t('createChallenge.errors.generic'))
    } finally {
      setLoading(false)
    }
  }

  const renderSelector = (label, options, value, onChange) => (
    <>
      <FieldLabel>{label}</FieldLabel>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
        {options.map((opt) => (
          <Button
            key={opt.value}
            mode={value === opt.value ? 'contained' : 'outlined'}
            onPress={() => onChange(opt.value)}
            buttonColor={value === opt.value ? '#1c1c1e' : undefined}
            textColor={value === opt.value ? '#fff' : '#1c1c1e'}
            style={{ borderRadius: 10 }}
            compact
          >
            {opt.label}
          </Button>
        ))}
      </View>
    </>
  )

  return (
    <Container>
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon source="arrow-left" size={24} color="#1c1c1e" />
        </TouchableOpacity>
        <HeaderTitle>{t('createChallenge.header')}</HeaderTitle>
        <View style={{ width: 24 }} />
      </Header>

      <Body>
        <FieldLabel>{t('createChallenge.fields.title')}</FieldLabel>
        <TextInput
          mode="outlined"
          placeholder={t('createChallenge.fields.titlePlaceholder')}
          value={title}
          onChangeText={setTitle}
          outlineStyle={{ borderRadius: 14 }}
          activeOutlineColor="#1c1c1e"
          outlineColor="#e0e0e0"
        />

        <FieldLabel>{t('createChallenge.fields.description')}</FieldLabel>
        <TextInput
          mode="outlined"
          placeholder={t('createChallenge.fields.descriptionPlaceholder')}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          outlineStyle={{ borderRadius: 14 }}
          activeOutlineColor="#1c1c1e"
          outlineColor="#e0e0e0"
        />

        <FieldLabel>{t('createChallenge.fields.deadline')}</FieldLabel>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
          {DEADLINE_DAYS_OPTIONS.map((days) => (
            <Button
              key={days}
              mode={deadlineDays === days ? 'contained' : 'outlined'}
              onPress={() => setDeadlineDays(days)}
              buttonColor={deadlineDays === days ? '#1c1c1e' : undefined}
              textColor={deadlineDays === days ? '#fff' : '#1c1c1e'}
              style={{ borderRadius: 10 }}
              compact
            >
              {t('createChallenge.fields.daysOption', { count: days })}
            </Button>
          ))}
        </View>

        <FieldLabel>{t('createChallenge.fields.subject')}</FieldLabel>
        <TextInput
          mode="outlined"
          placeholder={t('createChallenge.fields.subjectPlaceholder')}
          value={subject}
          onChangeText={setSubject}
          outlineStyle={{ borderRadius: 14 }}
          activeOutlineColor="#1c1c1e"
          outlineColor="#e0e0e0"
        />

        {renderSelector(t('createChallenge.fields.difficulty'), difficultyOptions, difficulty, setDifficulty)}
        {renderSelector(t('createChallenge.fields.goalType'), goalTypeOptions, goalType, setGoalType)}

        <FieldLabel>{t('createChallenge.fields.goalValue')}</FieldLabel>
        <TextInput
          mode="outlined"
          placeholder={t('createChallenge.fields.goalValuePlaceholder')}
          value={goalValue}
          onChangeText={setGoalValue}
          keyboardType="numeric"
          outlineStyle={{ borderRadius: 14 }}
          activeOutlineColor="#1c1c1e"
          outlineColor="#e0e0e0"
        />

        <FieldLabel>{t('createChallenge.fields.options')}</FieldLabel>
        <ToggleRow>
          <ToggleLabel>{t('createChallenge.fields.locationRequired')}</ToggleLabel>
          <Switch
            value={locationRequired}
            onValueChange={setLocationRequired}
            trackColor={{ true: '#1c1c1e', false: '#ccc' }}
            thumbColor="#fff"
          />
        </ToggleRow>

        <SectionTitle>{t('createChallenge.invite.sectionTitle')}</SectionTitle>
        {loadingUsers ? (
          <ActivityIndicator color="#1c1c1e" style={{ marginVertical: 16 }} />
        ) : users.length === 0 ? (
          <Text style={{ fontFamily: 'Sora', fontSize: 13, opacity: 0.45 }}>
            {t('createChallenge.invite.noUsers')}
          </Text>
        ) : (
          users.map((u) => {
            const checked = selectedUsers.includes(u.id)
            return (
              <UserRow key={u.id} onPress={() => toggleUser(u.id)} activeOpacity={0.7}>
                <View>
                  <UserName>{u.name}</UserName>
                  <UserEmail>{u.email}</UserEmail>
                </View>
                <Checkbox status={checked ? 'checked' : 'unchecked'} color="#1c1c1e" />
              </UserRow>
            )
          })
        )}

        <SubmitButton onPress={handleSubmit} disabled={loading} activeOpacity={0.85}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <SubmitLabel>{t('createChallenge.submit')}</SubmitLabel>
          )}
        </SubmitButton>

        {error ? <ErrorMsg>{error}</ErrorMsg> : null}
      </Body>
    </Container>
  )
}
