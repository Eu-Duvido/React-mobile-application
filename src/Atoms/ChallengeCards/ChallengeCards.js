import React, { useRef } from 'react'
import { View, Animated, StyleSheet, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import {
  AnimatedFlatList,
  CarrouselItem,
  CarrouselWrapper,
  CARD_WIDTH,
  CARD_SPACING,
  CardBlur,
  CardOverlay,
} from './ChallengeCards.styles'
import { Icon, ProgressBar, Text } from 'react-native-paper'

const imagesList = [
  require('../../../assets/images/1.png'),
  require('../../../assets/images/2.png'),
  require('../../../assets/images/3.png'),
  require('../../../assets/images/4.png'),
  require('../../../assets/images/5.png'),
  require('../../../assets/images/6.png'),
  require('../../../assets/images/7.png'),
]

const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function ChallengeCards({ challenges }) {
  const navigation = useNavigation()
  const scrollX = useRef(new Animated.Value(0)).current

  const randomImages = shuffle(imagesList)

  return (
    <CarrouselWrapper>
      <AnimatedFlatList
        data={challenges}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * (CARD_WIDTH + CARD_SPACING),
            index * (CARD_WIDTH + CARD_SPACING),
            (index + 1) * (CARD_WIDTH + CARD_SPACING),
          ]

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
          })

          const overlayOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.45, 0, 0.45],
            extrapolate: 'clamp',
          })

          return (
            <Animated.View
              style={{
                transform: [{ scale }],
                marginRight: CARD_SPACING,
              }}
            >
              <Pressable
                onPress={() =>
                  navigation.navigate('Challenges', {
                    challenge: item,
                    image: randomImages[index % randomImages.length],
                  })
                }
              >
                <CarrouselItem
                  source={randomImages[index % randomImages.length]}
                >
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      StyleSheet.absoluteFillObject,
                      {
                        backgroundColor: '#000',
                        opacity: overlayOpacity,
                        borderRadius: 25,
                      },
                    ]}
                  />

                  <CardBlur>
                    <CardOverlay>
                      <View style={{ marginBottom: 8 }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 4,
                          }}
                        >
                          <Text
                            variant="bodyMedium"
                            style={{ color: '#fff', fontWeight: 'bold' }}
                          >
                            {item.title}
                          </Text>

                          <Icon name="star" size={18} color="#fff" />
                        </View>

                        <Text
                          variant="bodySmall"
                          style={{ color: '#fff', opacity: 0.8 }}
                        >
                          {item.subtitle}
                        </Text>
                      </View>

                      <ProgressBar
                        progress={item.progress}
                        color="#fff"
                        style={{
                          height: 5,
                          borderRadius: 4,
                          backgroundColor: '#797979e9',
                        }}
                      />
                    </CardOverlay>
                  </CardBlur>
                </CarrouselItem>
              </Pressable>
            </Animated.View>
          )
        }}
      />
    </CarrouselWrapper>
  )
}
