import styled from 'styled-components/native'
import {
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Animated,
  View
} from 'react-native'
import { BlurView } from 'expo-blur'


export const CARD_WIDTH = 275
export const CARD_SPACING = 32
export const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING

const { width: SCREEN_WIDTH } = Dimensions.get('window')
export const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2

export const CarrouselWrapper = styled.View`
  width: 100%;
  height: 600px;
`


export const AnimatedFlatList = styled(Animated.FlatList).attrs(() => ({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  snapToInterval: SNAP_INTERVAL,
  snapToAlignment: 'center',
  decelerationRate: 'fast',
  contentContainerStyle: {
    paddingHorizontal: SIDE_PADDING,
  },
}))`
  flex: 1;
`

export const CarrouselItem = styled(ImageBackground).attrs(() => ({
  resizeMode: 'cover',
  imageStyle: { borderRadius: 25 },
}))`
  width: ${CARD_WIDTH}px;
  height: 400px;
  border-radius: 25px;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 32px;
  shadow-color: #000000a6;
  shadow-offset: 0px 16px;
  shadow-opacity: 0.35;
  shadow-radius: 24px;
  elevation: 12;
`


export const CardBlur = styled(BlurView).attrs(() => ({
  intensity: 50,
  tint: 'dark',
}))`
  width: 80%;
  height: 100px;
  border-radius: 15px;
  overflow: hidden;
`

export const CardOverlay = styled(View)`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.45);
  padding: 8px 16px;
`