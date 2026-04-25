import React, { useState } from 'react'
import { View, TouchableOpacity, Text as RNText } from 'react-native'
import { TextInput, ActivityIndicator } from 'react-native-paper'
import { createUser } from '../../services/userService'
import { loginApi } from '../../services/authService'
import { useUserContext } from '../../contexts/UserContext'
import {
  Container,
  Logo,
  Tagline,
  InputWrapper,
  SubmitButton,
  SubmitLabel,
  ErrorMsg,
} from './Login.styles'

// Tabs de modo
const TAB_REGISTER = 'register'
const TAB_LOGIN = 'login'

const tabStyle = (active) => ({
  flex: 1,
  paddingVertical: 10,
  alignItems: 'center',
  borderBottomWidth: 2,
  borderBottomColor: active ? '#fff' : 'transparent',
})

const tabTextStyle = (active) => ({
  fontFamily: 'Sora',
  fontSize: 14,
  fontWeight: active ? '700' : '400',
  color: active ? '#fff' : 'rgba(255,255,255,0.45)',
})

const inputTheme = {
  colors: {
    background: 'transparent',
    onSurfaceVariant: 'rgba(255,255,255,0.5)',
  },
}

const inputProps = {
  mode: 'outlined',
  outlineStyle: { borderRadius: 14 },
  activeOutlineColor: '#fff',
  outlineColor: 'rgba(255,255,255,0.25)',
  textColor: '#fff',
  theme: inputTheme,
}

export default function Login() {
  const { login } = useUserContext()

  const [tab, setTab] = useState(TAB_REGISTER)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const doLogin = async (emailVal, passwordVal) => {
    const result = await loginApi({ email: emailVal, password: passwordVal })
    login(result.user, result.token)
  }

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Preencha todos os campos')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await createUser({ name, email, password })
      // Após criar, faz login automático para obter o token
      await doLogin(email, password)
    } catch (e) {
      setError(e.message || 'Erro ao criar conta. Verifique se o backend está rodando.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Preencha email e senha')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await doLogin(email, password)
    } catch (e) {
      setError(e.message || 'Email ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  const onTabChange = (newTab) => {
    setTab(newTab)
    setError(null)
    setName('')
    setEmail('')
    setPassword('')
  }

  return (
    <Container>
      <Logo>EU DUVIDO</Logo>
      <Tagline>Desafie seus amigos e prove que é capaz</Tagline>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', marginBottom: 32, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.15)' }}>
        <TouchableOpacity style={tabStyle(tab === TAB_REGISTER)} onPress={() => onTabChange(TAB_REGISTER)}>
          <RNText style={tabTextStyle(tab === TAB_REGISTER)}>Criar conta</RNText>
        </TouchableOpacity>
        <TouchableOpacity style={tabStyle(tab === TAB_LOGIN)} onPress={() => onTabChange(TAB_LOGIN)}>
          <RNText style={tabTextStyle(tab === TAB_LOGIN)}>Já tenho conta</RNText>
        </TouchableOpacity>
      </View>

      {tab === TAB_REGISTER && (
        <InputWrapper>
          <TextInput {...inputProps} label="Seu nome" value={name} onChangeText={setName} />
        </InputWrapper>
      )}

      <InputWrapper>
        <TextInput
          {...inputProps}
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </InputWrapper>

      <InputWrapper>
        <TextInput
          {...inputProps}
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </InputWrapper>

      <SubmitButton
        onPress={tab === TAB_REGISTER ? handleRegister : handleLogin}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#1c1c1e" size="small" />
        ) : (
          <SubmitLabel>{tab === TAB_REGISTER ? 'Criar conta' : 'Entrar'}</SubmitLabel>
        )}
      </SubmitButton>

      {error ? <ErrorMsg>{error}</ErrorMsg> : null}
    </Container>
  )
}

