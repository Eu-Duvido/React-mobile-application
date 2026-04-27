import React, { useState, useEffect } from 'react'
import { View, Switch, TouchableOpacity, ScrollView } from 'react-native'
import { TextInput, ActivityIndicator, Checkbox, Text, Icon, Button } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useNavigation } from '@react-navigation/native'
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

const DIFFICULTY_OPTIONS = [
  { value: 'EASY', label: 'Fácil' },
  { value: 'MEDIUM', label: 'Médio' },
  { value: 'HARD', label: 'Difícil' },
]

const GOAL_TYPE_OPTIONS = [
  { value: 'HOURS', label: 'Horas' },
  { value: 'PAGES', label: 'Páginas' },
  { value: 'EXERCISES', label: 'Exercícios' },
  { value: 'SESSIONS', label: 'Sessões' },
  { value: 'CUSTOM', label: 'Personalizado' },
]

export default function CreateChallenge() {
  const navigation = useNavigation()
  const { user } = useUserContext()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadlineDate, setDeadlineDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    d.setSeconds(0, 0)
    return d
  })
  const [pickerMode, setPickerMode] = useState(null) // 'date' | 'time' | null
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

  const pad = (n) => String(n).padStart(2, '0')
  const formatDisplay = (d) =>
    `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}  ${pad(d.getHours())}:${pad(d.getMinutes())}`
  const toISODeadline = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`

  const onPickerChange = (event, selected) => {
    if (event.type === 'dismissed') {
      setPickerMode(null)
      return
    }
    if (!selected) return
    if (pickerMode === 'date') {
      const merged = new Date(selected)
      merged.setHours(deadlineDate.getHours(), deadlineDate.getMinutes(), 0, 0)
      setDeadlineDate(merged)
      setPickerMode('time')
    } else {
      const merged = new Date(deadlineDate)
      merged.setHours(selected.getHours(), selected.getMinutes(), 0, 0)
      setDeadlineDate(merged)
      setPickerMode(null)
    }
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
      setError('Preencha título e descrição')
      return
    }
    const parsedGoal = parseInt(goalValue, 10)
    if (isNaN(parsedGoal) || parsedGoal < 1) {
      setError('Valor da meta deve ser um número maior que zero')
      return
    }
    if (deadlineDate <= new Date()) {
      setError('O prazo deve ser uma data futura')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const challenge = await createChallenge({
        title,
        description,
        deadline: toISODeadline(deadlineDate),
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
      setError(e.message || 'Erro ao criar desafio')
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
        <HeaderTitle>Novo Desafio</HeaderTitle>
        <View style={{ width: 24 }} />
      </Header>

      <Body>
        <FieldLabel>TÍTULO</FieldLabel>
        <TextInput
          mode="outlined"
          placeholder="Ex: Ler cinco livros"
          value={title}
          onChangeText={setTitle}
          outlineStyle={{ borderRadius: 14 }}
          activeOutlineColor="#1c1c1e"
          outlineColor="#e0e0e0"
        />

        <FieldLabel>DESCRIÇÃO</FieldLabel>
        <TextInput
          mode="outlined"
          placeholder="Descreva o desafio em detalhes..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          outlineStyle={{ borderRadius: 14 }}
          activeOutlineColor="#1c1c1e"
          outlineColor="#e0e0e0"
        />

        <FieldLabel>PRAZO</FieldLabel>
        <TouchableOpacity
          onPress={() => setPickerMode('date')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: '#e0e0e0',
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 16,
            marginBottom: 4,
            backgroundColor: '#fff',
          }}
        >
          <Text style={{ fontSize: 16, color: '#1c1c1e' }}>{formatDisplay(deadlineDate)}</Text>
          <Icon source="calendar-clock" size={20} color="#666" />
        </TouchableOpacity>

        {pickerMode != null && (
          <DateTimePicker
            value={deadlineDate}
            mode={pickerMode}
            display="default"
            minimumDate={pickerMode === 'date' ? new Date() : undefined}
            onChange={onPickerChange}
          />
        )}

        <FieldLabel>MATÉRIA / ÁREA (opcional)</FieldLabel>
        <TextInput
          mode="outlined"
          placeholder="Ex: Matemática, Programação..."
          value={subject}
          onChangeText={setSubject}
          outlineStyle={{ borderRadius: 14 }}
          activeOutlineColor="#1c1c1e"
          outlineColor="#e0e0e0"
        />

        {renderSelector('DIFICULDADE', DIFFICULTY_OPTIONS, difficulty, setDifficulty)}
        {renderSelector('TIPO DE META', GOAL_TYPE_OPTIONS, goalType, setGoalType)}

        <FieldLabel>VALOR DA META (número)</FieldLabel>
        <TextInput
          mode="outlined"
          placeholder="Ex: 10 (horas, páginas, etc.)"
          value={goalValue}
          onChangeText={setGoalValue}
          keyboardType="numeric"
          outlineStyle={{ borderRadius: 14 }}
          activeOutlineColor="#1c1c1e"
          outlineColor="#e0e0e0"
        />

        <FieldLabel>OPÇÕES</FieldLabel>
        <ToggleRow>
          <ToggleLabel>Exigir localização como prova</ToggleLabel>
          <Switch
            value={locationRequired}
            onValueChange={setLocationRequired}
            trackColor={{ true: '#1c1c1e', false: '#ccc' }}
            thumbColor="#fff"
          />
        </ToggleRow>

        <SectionTitle>Convidar amigos</SectionTitle>
        {loadingUsers ? (
          <ActivityIndicator color="#1c1c1e" style={{ marginVertical: 16 }} />
        ) : users.length === 0 ? (
          <Text style={{ fontFamily: 'Sora', fontSize: 13, opacity: 0.45 }}>
            Nenhum outro usuário cadastrado ainda
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
            <SubmitLabel>Criar desafio</SubmitLabel>
          )}
        </SubmitButton>

        {error ? <ErrorMsg>{error}</ErrorMsg> : null}
      </Body>
    </Container>
  )
}
