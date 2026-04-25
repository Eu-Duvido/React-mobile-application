import styled from 'styled-components/native'
import { TouchableOpacity } from 'react-native'

export const Container = styled.View`
  flex: 1;
  background-color: #1c1c1e;
  justify-content: center;
  padding: 32px;
`

export const Logo = styled.Text`
  font-family: BebasNeue;
  font-size: 72px;
  color: #fff;
  letter-spacing: 4px;
`

export const Tagline = styled.Text`
  font-family: Sora;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 48px;
`

export const InputWrapper = styled.View`
  margin-bottom: 14px;
`

export const SubmitButton = styled(TouchableOpacity)`
  background-color: #fff;
  height: 56px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  margin-top: 28px;
`

export const SubmitLabel = styled.Text`
  font-family: Sora;
  font-size: 16px;
  font-weight: 700;
  color: #1c1c1e;
`

export const ErrorMsg = styled.Text`
  font-family: Sora;
  font-size: 12px;
  color: #ff5555;
  text-align: center;
  margin-top: 14px;
`
