import styled from 'styled-components/native'
import { TouchableOpacity } from 'react-native'

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
`

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 52px 20px 16px;
  border-bottom-width: 1px;
  border-bottom-color: #f1f1f1;
`

export const HeaderTitle = styled.Text`
  font-family: OdibeeSans;
  font-size: 22px;
  color: #1c1c1e;
`

export const Body = styled.ScrollView.attrs(() => ({
  contentContainerStyle: { padding: 20, paddingBottom: 60 },
  keyboardShouldPersistTaps: 'handled',
  showsVerticalScrollIndicator: false,
}))`
  flex: 1;
`

export const FieldLabel = styled.Text`
  font-family: Sora;
  font-size: 11px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.45);
  letter-spacing: 0.8px;
  margin-top: 20px;
  margin-bottom: 6px;
`

export const ToggleRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #f7f7f7;
  padding: 14px 16px;
  border-radius: 14px;
`

export const ToggleLabel = styled.Text`
  font-family: Sora;
  font-size: 14px;
  color: #1c1c1e;
`

export const SectionTitle = styled.Text`
  font-family: OdibeeSans;
  font-size: 18px;
  color: #1c1c1e;
  margin-top: 28px;
  margin-bottom: 12px;
`

export const UserRow = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: #f1f1f1;
`

export const UserName = styled.Text`
  font-family: Sora;
  font-size: 14px;
  color: #1c1c1e;
`

export const UserEmail = styled.Text`
  font-family: Sora;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
`

export const SubmitButton = styled(TouchableOpacity)`
  background-color: #1c1c1e;
  height: 56px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  margin-top: 36px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`

export const SubmitLabel = styled.Text`
  font-family: Sora;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
`

export const ErrorMsg = styled.Text`
  font-family: Sora;
  font-size: 12px;
  color: #ff5555;
  text-align: center;
  margin-top: 12px;
`
