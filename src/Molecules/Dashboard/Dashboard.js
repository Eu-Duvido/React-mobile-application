import React from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native'
import { Text, Icon } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

/* ── Mock data ─────────────────────────────────────────── */
const RANKING = [
  { name: 'Ana Lima',    points: 18 },
  { name: 'Carlos M.',  points: 14 },
  { name: 'Beatriz F.', points: 11 },
  { name: 'Daniel R.',  points: 9  },
  { name: 'Elena S.',   points: 5  },
]

const EVOLUTION = [
  { day: 'Seg', points: 2 },
  { day: 'Ter', points: 5 },
  { day: 'Qua', points: 6 },
  { day: 'Qui', points: 9 },
  { day: 'Sex', points: 14 },
  { day: 'Sáb', points: 16 },
  { day: 'Dom', points: 18 },
]

const EVIDENCE_STATS = [
  { label: 'Aprovadas', value: 34, color: '#4CAF50' },
  { label: 'Pendentes', value: 12, color: '#FF9800' },
  { label: 'Recusadas', value: 5,  color: '#e53935' },
]

const APPROVAL_RATE = 68   // percentage

/* ── Helpers ───────────────────────────────────────────── */
const maxVal = (arr, key) => Math.max(...arr.map((i) => i[key]))

/* ── Sub-components ────────────────────────────────────── */

function SectionCard({ title, children, style }) {
  return (
    <View style={[{
      backgroundColor: '#fff',
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
      shadowOffset: { width: 0, height: 3 },
    }, style]}>
      <Text style={{ fontSize: 14, fontWeight: '700', color: '#1c1c1e', marginBottom: 16 }}>
        {title}
      </Text>
      {children}
    </View>
  )
}

function RankingChart() {
  const maxPts = maxVal(RANKING, 'points')
  return (
    <SectionCard title="🏆 Ranking geral">
      {RANKING.map((item, i) => (
        <View key={item.name} style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontSize: 13, color: '#1c1c1e', fontWeight: i < 3 ? '700' : '400' }}>
              {i + 1}. {item.name}
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1c1c1e' }}>
              {item.points} pts
            </Text>
          </View>
          <View style={{ height: 8, backgroundColor: '#f1f1f1', borderRadius: 4, overflow: 'hidden' }}>
            <View style={{
              height: 8,
              width: `${(item.points / maxPts) * 100}%`,
              borderRadius: 4,
              backgroundColor: i === 0 ? '#FFD700' : i === 1 ? '#4A90E2' : i === 2 ? '#8B5A2B' : '#1c1c1e',
            }} />
          </View>
        </View>
      ))}
    </SectionCard>
  )
}

function EvolutionChart() {
  const maxPts = maxVal(EVOLUTION, 'points')
  const BAR_MAX_H = 80

  return (
    <SectionCard title="📈 Evolução de pontos">
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: BAR_MAX_H + 24 }}>
        {EVOLUTION.map((item) => {
          const h = Math.round((item.points / maxPts) * BAR_MAX_H)
          return (
            <View key={item.day} style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ fontSize: 10, color: '#1c1c1e', fontWeight: '600', marginBottom: 4 }}>
                {item.points}
              </Text>
              <View style={{
                width: 22,
                height: h,
                borderRadius: 6,
                backgroundColor: '#1c1c1e',
              }} />
              <Text style={{ fontSize: 10, color: '#888', marginTop: 6 }}>{item.day}</Text>
            </View>
          )
        })}
      </View>
    </SectionCard>
  )
}

function EvidenceChart() {
  const total = EVIDENCE_STATS.reduce((s, i) => s + i.value, 0)

  return (
    <SectionCard title="📤 Evidências enviadas">
      {EVIDENCE_STATS.map((item) => {
        const pct = Math.round((item.value / total) * 100)
        return (
          <View key={item.label} style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color }} />
                <Text style={{ fontSize: 13, color: '#555' }}>{item.label}</Text>
              </View>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#1c1c1e' }}>
                {item.value} <Text style={{ color: '#888', fontWeight: '400' }}>({pct}%)</Text>
              </Text>
            </View>
            <View style={{ height: 8, backgroundColor: '#f1f1f1', borderRadius: 4, overflow: 'hidden' }}>
              <View style={{
                height: 8,
                width: `${pct}%`,
                borderRadius: 4,
                backgroundColor: item.color,
              }} />
            </View>
          </View>
        )
      })}
      <View style={{ alignItems: 'center', marginTop: 8 }}>
        <Text style={{ fontSize: 12, color: '#aaa' }}>Total: {total} evidências</Text>
      </View>
    </SectionCard>
  )
}

function ApprovalRateChart() {
  const rate = APPROVAL_RATE
  const circumference = 220
  const filled = (rate / 100) * circumference

  return (
    <SectionCard title="✅ Taxa de aprovação">
      <View style={{ alignItems: 'center' }}>
        {/* Circular mock using nested Views */}
        <View style={{ position: 'relative', width: 120, height: 120, marginBottom: 16 }}>
          {/* Track */}
          <View style={{
            width: 120, height: 120, borderRadius: 60,
            borderWidth: 12, borderColor: '#f1f1f1',
            position: 'absolute',
          }} />
          {/* Fill – approximate arc using a colored overlay */}
          <View style={{
            width: 120, height: 120, borderRadius: 60,
            borderWidth: 12,
            borderColor: '#4CAF50',
            borderTopColor: rate >= 25 ? '#4CAF50' : 'transparent',
            borderRightColor: rate >= 50 ? '#4CAF50' : 'transparent',
            borderBottomColor: rate >= 75 ? '#4CAF50' : 'transparent',
            borderLeftColor: rate >= 100 ? '#4CAF50' : 'transparent',
            position: 'absolute',
            transform: [{ rotate: '-90deg' }],
          }} />
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#1c1c1e' }}>{rate}%</Text>
          </View>
        </View>
        <Text style={{ fontSize: 13, color: '#888', textAlign: 'center' }}>
          {rate}% das evidências foram aprovadas
        </Text>
        <View style={{ flexDirection: 'row', gap: 20, marginTop: 12 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#4CAF50' }}>34</Text>
            <Text style={{ fontSize: 11, color: '#888' }}>Aprovadas</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#e53935' }}>16</Text>
            <Text style={{ fontSize: 11, color: '#888' }}>Recusadas</Text>
          </View>
        </View>
      </View>
    </SectionCard>
  )
}

/* ── Main screen ───────────────────────────────────────── */
export default function Dashboard() {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{
        paddingTop: insets.top + 12,
        paddingBottom: 16,
        paddingHorizontal: 20,
        backgroundColor: '#1c1c1e',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 999,
            padding: 8,
          }}
        >
          <Icon source="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800', flex: 1 }}>
          Dashboard
        </Text>
        <Icon source="chart-bar" size={24} color="rgba(255,255,255,0.6)" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 32,
        }}
      >
        <Text style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
          Dados simulados — integração com backend em breve
        </Text>
        <RankingChart />
        <EvolutionChart />
        <EvidenceChart />
        <ApprovalRateChart />
      </ScrollView>
    </View>
  )
}
