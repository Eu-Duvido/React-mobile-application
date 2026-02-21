import styled from 'styled-components/native'
import { View } from 'react-native'
import { Animated } from 'react-native'

export const BottomBar = styled(Animated.View)`
  position: fixed;
  bottom: 20px;
  height: 64px;
  border-radius: 32px;
  background-color: #1c1c1e;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  padding: 0 32px;
  align-self: center;
`



export const SideButton = styled(View)`
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
`

export const FabButton = styled(View)`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  background-color: #ffffff;

  align-items: center;
  justify-content: center;

  margin-top: -32px;

  shadow-color: #000;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.3;
  shadow-radius: 12px;
  elevation: 8;
`
