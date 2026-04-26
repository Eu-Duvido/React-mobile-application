import React, { useRef, useEffect } from 'react'
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Animated } from 'react-native'
import { Text, Icon } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDashboardData } from '../../hooks/useDashboardData'
import {
  toRankingData,
  toEvolutionData,
  toEvidenceStats,
  toApprovalRate,
  toSummaryCards,
  toChallengeStatusData,
  toChallengeParticipationData,
} from '../../mappers/dashboardMapper'

/* ── Helpers ─────────────────────────────────────────────── */
const maxVal = (arr, key) => {
  const vals = arr.map((i) => i[key])
  return vals.length ? Math.max(...vals) : 1
}

/* ── Skeleton ────────────────────────────────────────────── */
function SkeletonBox({ width = '100%', height = 16, radius = 8, style }) {
  const anim = useRef(new Animated.Value(0.4)).current
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start()
  }, [anim])
  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius, backgroundColor: '#e0e0e0', opacity: anim },
        style,
      ]}
    />
  )
}

function SkeletonCard() {
  return (
    <View style={{
      backgroundColor: '#fff', borderRadius: 20, padding: 20,
      marginBottom: 16, elevation: 3,
      shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
    }}>
      <SkeletonBox width={140} height={14} style={{ marginBottom: 16 }} />
      <SkeletonBox height={12} style={{ marginBottom: 10 }} />
      <SkeletonBox width="80%" height={12} style={{ marginBottom: 10 }} />
      <SkeletonBox width="60%" height={12} />
    </View>
  )
}

function LoadingSkeleton() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={{
            backgroundColor: '#fff', borderRadius: 16, padding: 16, elevation: 2,
            width: '47%', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
          }}>
            <SkeletonBox width={32} height={32} radius={16} style={{ marginBottom: 10 }} />
            <SkeletonBox width={50} height={22} style={{ marginBottom: 6 }} />
            <SkeletonBox width={70} height={12} />
          </View>
        ))}
      </View>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </ScrollView>
  )
}

/* ── Sub-components ─────────────────────────────────────── */

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

function EmptyState({ message }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 20 }}>
      <Text style={{ fontSize: 28, marginBottom: 8 }}>📭</Text>
      <Text style={{ fontSize: 13, color: '#aaa', textAlign: 'center' }}>{message}</Text>
    </View>
  )
}

/* ── Summary Cards ───────────────────────────────────────── */
function SummaryCards({ ranking, challengeMetrics, evidenceMetrics }) {
  const cards = toSummaryCards(ranking, challengeMetrics, evidenceMetrics)
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
      {cards.map((card) => (
        <View key={card.label} style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 16,
          width: '47%',
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 6,
          elevation: 2,
          shadowOffset: { width: 0, height: 2 },
        }}>
          <View style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: card.bg,
            alignItems: 'center', justifyContent: 'center',
            marginBottom: 10,
          }}>
            <Text style={{ fontSize: 18 }}>{card.icon}</Text>
          </View>
          <Text style={{ fontSize: 26, fontWeight: '800', color: card.color, lineHeight: 30 }}>
            {card.value}
          </Text>
          <Text style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{card.label}</Text>
        </View>
      ))}
    </View>
  )
}

/* ── Ranking Chart ───────────────────────────────────────── */
function RankingChart({ ranking }) {
  const data = toRankingData(ranking)
  const maxPts = maxVal(data, 'points') || 1
  if (!data.length) return (
    <SectionCard title="🏆 Ranking geral">
      <EmptyState message="Nenhum dado de ranking ainda" />
    </SectionCard>
  )
  const MEDAL = ['#FFD700', '#C0C0C0', '#CD7F32']
  return (
    <SectionCard title="🏆 Ranking geral">
      {data.map((item, i) => (
        <View key={item.name + i} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {i < 3 && (
                <View style={{
                  width: 22, height: 22, borderRadius: 11,
                  backgroundColor: MEDAL[i],
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#fff' }}>{i + 1}</Text>
                </View>
              )}
              {i >= 3 && (
                <Text style={{ fontSize: 12, color: '#888', width: 22, textAlign: 'center' }}>{i + 1}</Text>
              )}
              <Text style={{ fontSize: 13, color: '#1c1c1e', fontWeight: i < 3 ? '700' : '400' }}>
                {item.name}
              </Text>
            </View>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1c1c1e' }}>
              {item.points} pts
            </Text>
          </View>
          <View style={{ height: 8, backgroundColor: '#f1f1f1', borderRadius: 4, overflow: 'hidden' }}>
            <View style={{
              height: 8,
              width: `${(item.points / maxPts) * 100}%`,
              borderRadius: 4,
              backgroundColor: i < 3 ? MEDAL[i] : '#d0d0d0',
            }} />
          </View>
        </View>
      ))}
    </SectionCard>
  )
}

/* ── Evolution Chart ─────────────────────────────────────── */
function EvolutionChart({ dailyPoints }) {
  const data = toEvolutionData(dailyPoints)
  const maxPts = maxVal(data, 'points') || 1
  const BAR_MAX_H = 80
  if (!data.length) return (
    <SectionCard title="📈 Evolução de pontos (7 dias)">
      <EmptyState message="Nenhuma prova aprovada ainda" />
    </SectionCard>
  )
  return (
    <SectionCard title="📈 Evolução de pontos (7 dias)">
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: BAR_MAX_H + 24 }}>
        {data.map((item) => {
          const h = Math.max(4, Math.round((item.points / maxPts) * BAR_MAX_H))
          return (
            <View key={item.date} style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ fontSize: 10, color: '#1c1c1e', fontWeight: '600', marginBottom: 4 }}>
                {item.points}
              </Text>
              <View style={{ width: 22, height: h, borderRadius: 6, backgroundColor: '#1c1c1e' }} />
              <Text style={{ fontSize: 10, color: '#888', marginTop: 6 }}>{item.day}</Text>
            </View>
          )
        })}
      </View>
    </SectionCard>
  )
}

/* ── Evidence Chart ──────────────────────────────────────── */
function EvidenceChart({ evidenceMetrics }) {
  const stats = toEvidenceStats(evidenceMetrics)
  const total = stats.reduce((s, i) => s + i.value, 0)
  if (!stats.length || total === 0) return (
    <SectionCard title="📤 Evidências enviadas">
      <EmptyState message="Nenhuma evidência enviada ainda" />
    </SectionCard>
  )
  return (
    <SectionCard title="📤 Evidências enviadas">
      {stats.map((item) => {
        const pct = total > 0 ? Math.round((item.value / total) * 100) : 0
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
              <View style={{ height: 8, width: `${pct}%`, borderRadius: 4, backgroundColor: item.color }} />
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

/* ── Approval Rate Chart ─────────────────────────────────── */
function ApprovalRateChart({ evidenceMetrics }) {
  const rate = toApprovalRate(evidenceMetrics)
  const approved = evidenceMetrics?.approvedCount ?? 0
  const rejected = evidenceMetrics?.rejectedCount ?? 0
  const pending = evidenceMetrics?.pendingCount ?? 0
  return (
    <SectionCard title="✅ Taxa de aprovação">
      <View style={{ alignItems: 'center' }}>
        <View style={{ position: 'relative', width: 120, height: 120, marginBottom: 16 }}>
          <View style={{
            width: 120, height: 120, borderRadius: 60,
            borderWidth: 12, borderColor: '#f1f1f1',
            position: 'absolute',
          }} />
          <View style={{
            width: 120, height: 120, borderRadius: 60,
            borderWidth: 12,
            borderColor: '#4CAF50',
            borderTopColor:    rate >= 25  ? '#4CAF50' : 'transparent',
            borderRightColor:  rate >= 50  ? '#4CAF50' : 'transparent',
            borderBottomColor: rate >= 75  ? '#4CAF50' : 'transparent',
            borderLeftColor:   rate >= 100 ? '#4CAF50' : 'transparent',
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
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#4CAF50' }}>{approved}</Text>
            <Text style={{ fontSize: 11, color: '#888' }}>Aprovadas</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#FF9800' }}>{pending}</Text>
            <Text style={{ fontSize: 11, color: '#888' }}>Pendentes</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#e53935' }}>{rejected}</Text>
            <Text style={{ fontSize: 11, color: '#888' }}>Recusadas</Text>
          </View>
        </View>
      </View>
    </SectionCard>
  )
}

/* ── Challenge Status Distribution ──────────────────────── */
function ChallengeStatusChart({ challengeMetrics }) {
  const data = toChallengeStatusData(challengeMetrics)
  const total = data.reduce((s, i) => s + i.count, 0)
  if (!data.length) return (
    <SectionCard title="📊 Desafios por status">
      <EmptyState message="Nenhum desafio encontrado" />
    </SectionCard>
  )
  return (
    <SectionCard title="📊 Desafios por status">
      {/* Barra empilhada */}
      <View style={{ flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 16 }}>
        {data.map((item) => (
          <View
            key={item.status}
            style={{ flex: item.count, backgroundColor: item.color }}
          />
        ))}
      </View>
      {/* Legenda */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {data.map((item) => {
          const pct = total > 0 ? Math.round((item.count / total) * 100) : 0
          return (
            <View key={item.status} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: '45%' }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color }} />
              <Text style={{ fontSize: 12, color: '#555' }}>
                {item.label}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#1c1c1e', marginLeft: 'auto' }}>
                {item.count} <Text style={{ color: '#aaa', fontWeight: '400' }}>({pct}%)</Text>
              </Text>
            </View>
          )
        })}
      </View>
    </SectionCard>
  )
}

/* ── Challenge Participation Chart ───────────────────────── */
function ChallengeParticipationChart({ challengeMetrics }) {
  const data = toChallengeParticipationData(challengeMetrics)
  const maxPart = maxVal(data, 'participants') || 1
  if (!data.length) return (
    <SectionCard title="👥 Participação por desafio">
      <EmptyState message="Nenhum desafio com participantes ainda" />
    </SectionCard>
  )
  return (
    <SectionCard title="👥 Participação por desafio (top 5)">
      {data.map((item, i) => {
        const pct = (item.participants / maxPart) * 100
        const completedPct = item.participants > 0
          ? Math.round((item.completed / item.participants) * 100)
          : 0
        return (
          <View key={item.title + i} style={{ marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontSize: 12, color: '#1c1c1e', flex: 1, marginRight: 8 }} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={{ fontSize: 12, color: '#888' }}>
                {item.participants} part. · <Text style={{ color: '#4CAF50' }}>{completedPct}% ok</Text>
              </Text>
            </View>
            {/* Barra de participantes */}
            <View style={{ height: 8, backgroundColor: '#f1f1f1', borderRadius: 4, overflow: 'hidden' }}>
              <View style={{ height: 8, width: `${pct}%`, borderRadius: 4, backgroundColor: '#4A90E2' }} />
            </View>
            {/* Barra de concluídos sobreposta */}
            {item.completed > 0 && (
              <View style={{
                position: 'absolute', bottom: 0, left: 0,
                height: 8, width: `${(item.completed / maxPart) * 100}%`,
                borderRadius: 4, backgroundColor: '#4CAF50', opacity: 0.7,
              }} />
            )}
          </View>
        )
      })}
      <View style={{ flexDirection: 'row', gap: 16, marginTop: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#4A90E2' }} />
          <Text style={{ fontSize: 11, color: '#888' }}>Participantes</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#4CAF50' }} />
          <Text style={{ fontSize: 11, color: '#888' }}>Concluídos</Text>
        </View>
      </View>
    </SectionCard>
  )
}

/* ── Botão de acesso ao Censo INEP ───────────────────────── */
function InepAccessButton() {
  const navigation = useNavigation()
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('InepDashboard')}
      style={{
        backgroundColor: '#1A237E',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <View style={{
        width: 48, height: 48, borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ fontSize: 24 }}>🎓</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800' }}>Censo INEP 2024</Text>
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>
          Dados educacionais · EAD · Rankings · Demográficos
        </Text>
      </View>
      <Icon source="chevron-right" size={22} color="rgba(255,255,255,0.5)" />
    </TouchableOpacity>
  )
}

/* ── Main screen ─────────────────────────────────────────── */
export default function Dashboard() {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const { ranking, dailyPoints, challengeMetrics, evidenceMetrics, loading, error, refetch } =
    useDashboardData()

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
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 999, padding: 8 }}
        >
          <Icon source="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800', flex: 1 }}>Dashboard</Text>
        {loading
          ? <ActivityIndicator color="rgba(255,255,255,0.6)" />
          : <TouchableOpacity onPress={refetch}>
              <Icon source="refresh" size={24} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
        }
      </View>

      {error && (
        <View style={{ backgroundColor: '#fff3f3', padding: 12, margin: 16, borderRadius: 12 }}>
          <Text style={{ color: '#e53935', fontSize: 13 }}>Erro ao carregar dados: {error}</Text>
          <TouchableOpacity onPress={refetch} style={{ marginTop: 8 }}>
            <Text style={{ color: '#4A90E2', fontSize: 13, fontWeight: '600' }}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}
        >
          <SummaryCards
            ranking={ranking}
            challengeMetrics={challengeMetrics}
            evidenceMetrics={evidenceMetrics}
          />
          <InepAccessButton />
          <RankingChart ranking={ranking} />
          <ChallengeStatusChart challengeMetrics={challengeMetrics} />
          <ChallengeParticipationChart challengeMetrics={challengeMetrics} />
          <EvolutionChart dailyPoints={dailyPoints} />
          <EvidenceChart evidenceMetrics={evidenceMetrics} />
          <ApprovalRateChart evidenceMetrics={evidenceMetrics} />
        </ScrollView>
      )}
    </View>
  )
}
