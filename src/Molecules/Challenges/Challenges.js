import React, { useState } from 'react'
import { View, ScrollView, Image } from 'react-native'
import { ProgressBar, Text, Icon, Button } from 'react-native-paper'
import ChallengerRow from '../../Atoms/ChallengerRow/ChallengerRow'

import {
  Overlay,
  SpaceBetween,
  StartAlign,
  TabsContainer,
  TabButton,
  BackgroundImageChallenge,
} from './Challenges.styled'

export default function Challenges({ route }) {
  const { challenge, image } = route.params || {}
  const [activeTab, setActiveTab] = useState('info')

  const difficultyStars = {
    easy: 1,
    medium: 2,
    hard: 3,
  }

  const stars = difficultyStars[challenge?.difficulty] || 0

  const daysLeft = 5

const scorers = [
  { id: 1, name: 'Lucas', points: 180, level: 7, avatar: require('../../../assets/images/1.png') },
  { id: 2, name: 'Marina', points: 160, level: 6, avatar: require('../../../assets/images/2.png') },
  { id: 3, name: 'Pedro', points: 140, level: 5, avatar: require('../../../assets/images/3.png') },
  { id: 4, name: 'Ana', points: 120, level: 4, avatar: require('../../../assets/images/4.png') },
  { id: 5, name: 'Rafael', points: 110, level: 4, avatar: require('../../../assets/images/5.png') },
  { id: 6, name: 'Beatriz', points: 105, level: 3, avatar: require('../../../assets/images/6.png') },
  { id: 7, name: 'João', points: 98, level: 3, avatar: require('../../../assets/images/7.png') },
  { id: 8, name: 'Camila', points: 92, level: 3, avatar: require('../../../assets/images/8.png') },
  { id: 9, name: 'Diego', points: 88, level: 2, avatar: require('../../../assets/images/9.png') },
  { id: 10, name: 'Fernanda', points: 80, level: 2, avatar: require('../../../assets/images/1.png') },
  { id: 11, name: 'Bruno', points: 72, level: 2, avatar: require('../../../assets/images/1.png') },
  { id: 12, name: 'Larissa', points: 65, level: 1, avatar: require('../../../assets/images/1.png') },
]


  function getRankIcon(index) {
    if (index === 0) return { icon: 'trophy', color: '#FFD700' }
    if (index === 1) return { icon: 'trophy', color: '#4A90E2' }
    if (index === 2) return { icon: 'trophy', color: '#8B5A2B' }
    return { icon: 'cat', color: '#777' }
  }

  return (
    <BackgroundImageChallenge
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 450 }}
      source={image}
    >
      
      <Overlay>
        <StartAlign>
          

          {/* 🔀 TABS */}
          <TabsContainer>
            <TabButton active={activeTab === 'info'} onPress={() => setActiveTab('info')}>
              <Text style={{ color: activeTab === 'info' ? '#fff' : '#000', fontWeight: '500' }}>
                Detalhes
              </Text>
            </TabButton>

            <TabButton active={activeTab === 'leaders'} onPress={() => setActiveTab('leaders')}>
              <Text style={{ color: activeTab === 'leaders' ? '#fff' : '#000', fontWeight: '500' }}>
                Líderes
              </Text>
            </TabButton>
          </TabsContainer>

          {activeTab === 'info' && (
            <>
              <SpaceBetween>
                <Text variant="titleLarge">{challenge?.title}</Text>

                <View style={{ alignItems: 'center' }}>
                  <Text variant="bodySmall" style={{ marginBottom: 4 }}>
                    Dificuldade
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    {Array.from({ length: stars }).map((_, index) => (
                      <Icon key={index} source="star" size={18} color="#000" />
                    ))}
                  </View>
                </View>
              </SpaceBetween>

              <Text style={{ marginBottom: 20 }}>
                {challenge?.subtitle}
              </Text>

            <View style={{ width: '100%', marginBottom: 20, }}>
              <Text variant="bodyMedium" style={{ marginBottom: 8 }}>{challenge?.progress * 10}0% completo</Text>
  <ProgressBar
    progress={challenge?.progress}
    color="#000"
    style={{
      height: 8,
      borderRadius: 4,
      backgroundColor: '#E0E0E0',
    }}
  />
</View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#fff',
                  padding: 12,
                  borderRadius: 20,
                  width: '100%',
                  height: 72,
                  marginBottom: 16,
                  shadowColor: '#000000ac',
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 3,
                  shadowOffset: { width: 0, height: 4 },
                }}
              >
                <View style={{  width: '50%', flexDirection: 'row', alignItems: 'center', gap: 6  }}>
                    <Icon source="cat" size={32} color="#666" />
                <Text variant="bodySmall">
                    Seus amigos estão (ou não) torcendo por você!
                  </Text>
                  </View>
             

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, }}>
                  <Icon source="clock-outline" size={16} color="#666" />
                  <Text variant="bodySmall">
                    Faltam <Text style={{ fontWeight: '700' }}>{daysLeft} dias</Text>
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 12, width: '100%', marginTop: 16, alignItems: 'center', justifyContent: 'center'   }}>
                <Button
                  mode="contained"
                  icon="play"
                  onPress={() => console.log('Jogar')}
                  contentStyle={{ height: 64, width: 150 }}
                  style={{ borderRadius: 14 }}
                  labelStyle={{ fontSize: 16, fontWeight: '600' }}
                  buttonColor="#000"
                >
                  Jogar
                </Button>

                <Button
                  mode="outlined"
                  icon="close"
                  onPress={() => console.log('Desistir')}
                  contentStyle={{ height: 64, width: 150 }}
                  style={{ borderRadius: 14 }}
                  textColor="#000"
                >
                  Desistir
                </Button>
              </View>
            </>
          )}

          {/* 🏆 LÍDERES */}
          {activeTab === 'leaders' && (
            <View style={{ width: '100%', flex: 1 }}>
              <Text variant="titleLarge" style={{ marginBottom: 12, textAlign: 'center' }}>
                Pontuação
              </Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                {scorers.map((item, index) => {
                  const rankIcon = getRankIcon(index)

                  return (
                    <View
                      key={item.id}
                      style={{
                        backgroundColor: '#f1f1f1',
                        borderRadius: 14,
                        paddingHorizontal: 12,
                        marginBottom: 8,
                      }}
                    >
                      <ChallengerRow
                        avatar={item.avatar}
                        name={`${index + 1}. ${item.name}`}
                        points={item.points}
                        level={item.level}
                        rightIcon={
                          <Icon source={rankIcon.icon} size={20} color={rankIcon.color} />
                        }
                      />
                    </View>
                  )
                })}
              </ScrollView>
            </View>
          )}
        </StartAlign>
      </Overlay>
    </BackgroundImageChallenge>
  )
}
