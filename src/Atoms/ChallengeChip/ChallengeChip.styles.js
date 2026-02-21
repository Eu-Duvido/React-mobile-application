import styled from 'styled-components/native'
import { ScrollView, TouchableOpacity, View } from 'react-native'

export const Header = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 32px;
  margin-bottom: 32px;

`

export const CarrouselWrapper = styled.View`
  width: 100%;
  height: 55px;
  margin-bottom: 32px;

`

export const CarrouselContainer = styled(ScrollView).attrs(() => ({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
}))`
flex: 1;
  padding-left: 32px;
`


export const CarrouselItem = styled(TouchableOpacity)`
  background-color: ${({ active }) => (active ? '#1d1d1d' : '#858585ff')};
  opacity: ${({ active }) => (active ? 1 : 0.6)};
  width: 125px;
  height: 55px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  transition: 0.5ms;
  margin-right: 32px;
`