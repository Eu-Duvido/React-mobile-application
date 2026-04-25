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

export const Body = styled.View`
  flex: 1;
  padding: 20px;
`

export const EmptyText = styled.Text`
  font-family: Sora;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  text-align: center;
  margin-top: 48px;
`

export const InviteCard = styled.View`
  background-color: #f7f7f7;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 12px;
`

export const ChallengeTitle = styled.Text`
  font-family: OdibeeSans;
  font-size: 20px;
  color: #1c1c1e;
  margin-bottom: 2px;
`

export const ChallengeInfo = styled.Text`
  font-family: Sora;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.55);
  margin-bottom: 14px;
`

export const ActionRow = styled.View`
  flex-direction: row;
  gap: 10px;
`

export const AcceptBtn = styled(TouchableOpacity)`
  flex: 1;
  background-color: #1c1c1e;
  height: 44px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`

export const RefuseBtn = styled(TouchableOpacity)`
  flex: 1;
  height: 44px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #e0e0e0;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`

export const BtnLabel = styled.Text`
  font-family: Sora;
  font-size: 14px;
  font-weight: 600;
  color: ${({ light }) => (light ? '#1c1c1e' : '#fff')};
`
