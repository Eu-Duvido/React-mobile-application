import React, { useRef, useEffect } from 'react'
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Animated } from 'react-native'
import { Text, Icon } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useUnifiedDashboard } from '../../hooks/useUnifiedDashboard'
import {
  toPanoramaKPIs,
  toAudienceProfile,
  toChallengeIntelligence,
  toRankingData,
  toPointsEvolution,
  toConsistency,
  generateInsights,
  fmt,
} from '../../mappers/unifiedDashboardMapper'

/* ── Design tokens ───────────────────────────────────────────────────────── */
const T = {
  dark:   '#0F1729',
  blue:   '#2196F3',
  green:  '#4CAF50',
  purple: '#9C27B0',
  orange: '#FF9800',
  teal:   '#00897B',
  red:    '#E53935',
  pink:   '#E91E63',
  bg:     '#F0F4FA',
  card:   '#ffffff',
  border: '#E8EDF2',
  text:   '#1A1A2E',
  sub:    '#6B7280',
  light:  '#9CA3AF',
}

const MEDALS = ['#FFD700', '#C0C0C0', '#CD7F32']

/* ── Skeleton ────────────────────────────────────────────────────────────── */
function Bone({ w = '100%', h = 14, r = 7, style }) {
  const pulse = useRef(new Animated.Value(0.45)).current
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1,    duration: 750, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.45, duration: 750, useNativeDriver: true }),
      ])
    ).start()
  }, [pulse])
  return <Animated.View style={[{ width: w, height: h, borderRadius: r, backgroundColor: '#DDE3F0', opacity: pulse }, style]} />
}

function LoadingSkeleton() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
      {/* KPI strip */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
        {[0,1,2,3].map(i => (
          <View key={i} style={{ flex: 1, backgroundColor: T.card, borderRadius: 16, padding: 14, elevation: 2 }}>
            <Bone w={28} h={28} r={14} style={{ marginBottom: 8 }} />
            <Bone w={40} h={18} style={{ marginBottom: 6 }} />
            <Bone w={50} h={9} />
          </View>
        ))}
      </View>
      {[0,1,2].map(i => (
        <View key={i} style={{ backgroundColor: T.card, borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2 }}>
          <Bone w={120} h={13} style={{ marginBottom: 16 }} />
          <Bone h={9} style={{ marginBottom: 10 }} />
          <Bone w="70%" h={9} style={{ marginBottom: 10 }} />
          <Bone w="50%" h={9} />
        </View>
      ))}
    </ScrollView>
  )
}

/* ── Primitivos ──────────────────────────────────────────────────────────── */
function SectionTitle({ icon, title, subtitle }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14, marginTop: 4, paddingHorizontal: 2 }}>
      <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: T.dark + '10', alignItems: 'center', justifyContent: 'center' }}>
        <Icon source={icon} size={18} color={T.dark} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '800', color: T.dark }}>{title}</Text>
        {subtitle ? <Text style={{ fontSize: 11, color: T.sub, marginTop: 1 }}>{subtitle}</Text> : null}
      </View>
    </View>
  )
}

function Card({ children, accent, noPad, style }) {
  return (
    <View style={[{
      backgroundColor: T.card, borderRadius: 20,
      padding: noPad ? 0 : 18, marginBottom: 14,
      elevation: 3, shadowColor: '#000', shadowOpacity: 0.06,
      shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
      borderLeftWidth: accent ? 4 : 0, borderLeftColor: accent ?? 'transparent',
      overflow: 'hidden',
    }, style]}>
      {children}
    </View>
  )
}

function CardLabel({ children }) {
  return <Text style={{ fontSize: 12, fontWeight: '700', color: T.dark, marginBottom: 12 }}>{children}</Text>
}

function Empty({ msg = 'Nenhum dado disponível' }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 6 }}>📭</Text>
      <Text style={{ fontSize: 12, color: T.light, textAlign: 'center' }}>{msg}</Text>
    </View>
  )
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: T.border, marginVertical: 10 }} />
}

/* ── Seção 1: Panorama ───────────────────────────────────────────────────── */
function PanoramaSection({ challengeMetrics, evidenceMetrics, engagementMetrics, resumoGeral }) {
  const kpis = toPanoramaKPIs(challengeMetrics, evidenceMetrics, engagementMetrics, resumoGeral)
  return (
    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
      {kpis.map(k => (
        <View key={k.key} style={{
          flex: 1, backgroundColor: T.card, borderRadius: 16, padding: 14,
          elevation: 2, shadowColor: '#000', shadowOpacity: 0.05,
          shadowRadius: 5, shadowOffset: { width: 0, height: 2 },
          borderBottomWidth: 3, borderBottomColor: k.color,
        }}>
          <Text style={{ fontSize: 18, marginBottom: 6 }}>{k.icon}</Text>
          <Text style={{ fontSize: 20, fontWeight: '800', color: k.color, lineHeight: 24 }}>{k.value}</Text>
          <Text style={{ fontSize: 10, color: T.dark, fontWeight: '600', marginTop: 3 }}>{k.label}</Text>
          {k.sublabel ? <Text style={{ fontSize: 9, color: T.light, marginTop: 2 }}>{k.sublabel}</Text> : null}
        </View>
      ))}
    </View>
  )
}

/* ── Seção 2: Perfil da Audiência ────────────────────────────────────────── */
function AudienceSection({ genero, etaria, ead }) {
  const p = toAudienceProfile(genero, etaria, ead)
  if (!p.hasData) {
    return (
      <Card accent={T.purple}>
        <CardLabel>Perfil da Audiência</CardLabel>
        <Empty msg="Execute o data-pipeline para carregar dados demográficos INEP" />
      </Card>
    )
  }

  const maxAge = p.etariaItems.length ? Math.max(...p.etariaItems.map(r => r.value)) : 1
  const totalAge = p.etariaItems.reduce((s, r) => s + r.value, 0)

  return (
    <Card accent={T.purple}>
      <CardLabel>Perfil da Audiência · Quem são os estudantes brasileiros?</CardLabel>

      {/* Faixa etária */}
      {p.etariaItems.length > 0 && (
        <>
          <Text style={{ fontSize: 11, color: T.sub, marginBottom: 8 }}>Distribuição por faixa etária (ingressantes INEP)</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 56, marginBottom: 6 }}>
            {p.etariaItems.map(item => {
              const h    = Math.max(4, Math.round((item.value / maxAge) * 56))
              const pAge = totalAge > 0 ? Math.round((item.value / totalAge) * 100) : 0
              const is1824 = item.label === '18-24'
              return (
                <View key={item.label} style={{ flex: 1, alignItems: 'center' }}>
                  {is1824 && (
                    <Text style={{ fontSize: 8, color: T.purple, fontWeight: '700', marginBottom: 2 }}>{pAge}%</Text>
                  )}
                  <View style={{
                    width: '72%', height: h, borderRadius: 4,
                    backgroundColor: is1824 ? T.purple : T.purple + '30',
                  }} />
                  <Text style={{ fontSize: 8, color: is1824 ? T.purple : T.light, marginTop: 3, fontWeight: is1824 ? '700' : '400' }}>
                    {item.label}
                  </Text>
                </View>
              )
            })}
          </View>
          {p.pct1824 != null && p.pct1824 > 0 && (
            <View style={{ backgroundColor: T.purple + '10', borderRadius: 8, padding: 8, marginBottom: 12 }}>
              <Text style={{ fontSize: 11, color: T.purple, fontWeight: '600' }}>
                🎯 {p.pct1824}% têm 18–24 anos — o público principal do euDuvido
              </Text>
            </View>
          )}
        </>
      )}

      {(p.pctFem != null || p.pctEad != null) && <Divider />}

      {/* Gênero + Modalidade na mesma linha */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {p.pctFem != null && (
          <View style={{ flex: 1, backgroundColor: T.pink + '0D', borderRadius: 12, padding: 12, alignItems: 'center' }}>
            <Text style={{ fontSize: 8, color: T.sub, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Gênero dominante</Text>
            <Text style={{ fontSize: 22, fontWeight: '800', color: T.pink }}>{Math.max(p.pctFem, p.pctMasc ?? 0)}%</Text>
            <Text style={{ fontSize: 11, color: T.sub }}>{p.genderDom}</Text>
          </View>
        )}
        {p.pctEad != null && (
          <View style={{ flex: 1, backgroundColor: T.purple + '0D', borderRadius: 12, padding: 12, alignItems: 'center' }}>
            <Text style={{ fontSize: 8, color: T.sub, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Via EAD</Text>
            <Text style={{ fontSize: 22, fontWeight: '800', color: T.purple }}>{p.pctEad}%</Text>
            <Text style={{ fontSize: 11, color: T.sub }}>dos ingressantes</Text>
          </View>
        )}
        {p.pctFem == null && p.pctEad == null && (
          <Text style={{ fontSize: 12, color: T.light }}>Dados demográficos não disponíveis</Text>
        )}
      </View>
    </Card>
  )
}

/* ── Seção 3: Inteligência de Desafios ───────────────────────────────────── */
function ChallengeSection({ challengeMetrics }) {
  const d = toChallengeIntelligence(challengeMetrics)
  if (!d) return (
    <Card accent={T.orange}>
      <CardLabel>Inteligência de Desafios</CardLabel>
      <Empty msg="Nenhum desafio com participantes ainda" />
    </Card>
  )

  return (
    <Card accent={T.orange}>
      <CardLabel>Inteligência de Desafios · O que está funcionando?</CardLabel>

      {/* Barra global de participações */}
      <Text style={{ fontSize: 11, color: T.sub, marginBottom: 6 }}>
        Visão global de {d.total} desafio{d.total !== 1 ? 's' : ''}
      </Text>
      <View style={{ height: 14, borderRadius: 7, overflow: 'hidden', flexDirection: 'row', marginBottom: 8 }}>
        <View style={{ flex: d.globalCompletion,  backgroundColor: T.green }} />
        <View style={{ flex: d.globalInProgress,  backgroundColor: T.orange, opacity: 0.8 }} />
        <View style={{ flex: d.globalAbandonment, backgroundColor: T.red,    opacity: 0.5 }} />
      </View>
      <View style={{ flexDirection: 'row', gap: 14, marginBottom: 16 }}>
        {[
          { label: `${d.globalCompletion}% concluído`,  color: T.green  },
          { label: `${d.globalInProgress}% em andamento`, color: T.orange },
          { label: `${d.globalAbandonment}% abandono`, color: T.red    },
        ].map(item => (
          <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color }} />
            <Text style={{ fontSize: 10, color: T.sub }}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Métricas de evidência */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
        <View style={{ flex: 1, backgroundColor: T.teal + '0D', borderRadius: 12, padding: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: T.teal }}>{d.avgEvidences}</Text>
          <Text style={{ fontSize: 10, color: T.sub, textAlign: 'center', marginTop: 2 }}>Provas/usuário</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: T.green + '0D', borderRadius: 12, padding: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: T.green }}>{d.evidenceQuality}%</Text>
          <Text style={{ fontSize: 10, color: T.sub, textAlign: 'center', marginTop: 2 }}>Provas aprovadas</Text>
        </View>
      </View>

      {/* Top desafio */}
      {d.topChallenge && (
        <>
          <Divider />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: T.green + '20', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 18 }}>🏆</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: T.text }} numberOfLines={1}>
                {d.topChallenge.title}
              </Text>
              <Text style={{ fontSize: 10, color: T.sub }}>
                {d.topChallenge.participants} participantes · {d.topChallenge.completionRate}% concluído · {d.topChallenge.avgProofs} provas/user
              </Text>
            </View>
            <View style={{ backgroundColor: T.green + '15', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: T.green }}>{d.topChallenge.completionRate}%</Text>
            </View>
          </View>
        </>
      )}

      {/* Pior abandono */}
      {d.worstChallenge && (
        <>
          <Divider />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: T.red + '15', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 18 }}>⚠️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: T.text }} numberOfLines={1}>
                {d.worstChallenge.title}
              </Text>
              <Text style={{ fontSize: 10, color: T.sub }}>
                {d.worstChallenge.participants} participantes · {d.worstChallenge.abandonRate}% de abandono
              </Text>
            </View>
            <View style={{ backgroundColor: T.red + '12', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: T.red }}>Revisar</Text>
            </View>
          </View>
        </>
      )}
    </Card>
  )
}

/* ── Seção 4: Ranking & Engajamento ──────────────────────────────────────── */
function RankingSection({ ranking, dailyPoints }) {
  const rankData  = toRankingData(ranking)
  const evolution = toPointsEvolution(dailyPoints)
  const cons      = toConsistency(dailyPoints)
  const maxPts    = rankData.length ? Math.max(...rankData.map(r => r.points)) : 1
  const maxEvol   = evolution.length ? Math.max(...evolution.map(d => d.points)) : 1

  return (
    <Card accent={T.dark}>
      <CardLabel>Ranking & Engajamento · Quem lidera e como?</CardLabel>

      {/* Ranking top 5 */}
      {rankData.length === 0 ? (
        <Empty msg="Nenhum ponto distribuído ainda" />
      ) : (
        <>
          {rankData.map((u, i) => (
            <View key={u.name + i} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                  {i < 3 ? (
                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: MEDALS[i], alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 9, fontWeight: '800', color: '#fff' }}>{i + 1}</Text>
                    </View>
                  ) : (
                    <Text style={{ fontSize: 11, color: T.light, width: 20, textAlign: 'center' }}>{i + 1}</Text>
                  )}
                  <Text style={{ fontSize: 13, color: T.text, fontWeight: i < 3 ? '700' : '400' }}>{u.name}</Text>
                </View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: T.text }}>{u.points} pts</Text>
              </View>
              <View style={{ height: 6, backgroundColor: T.border, borderRadius: 3, overflow: 'hidden' }}>
                <View style={{
                  height: 6, borderRadius: 3,
                  width: `${maxPts > 0 ? (u.points / maxPts) * 100 : 0}%`,
                  backgroundColor: i < 3 ? MEDALS[i] : '#ccc',
                }} />
              </View>
            </View>
          ))}
        </>
      )}

      {/* Consistência */}
      {cons.total > 0 && (
        <>
          <Divider />
          <Text style={{ fontSize: 11, color: T.sub, marginBottom: 8 }}>Frequência de uso</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[
              { label: 'Consistentes', sublabel: '3+ dias',  value: cons.consistent, color: T.green  },
              { label: 'Moderados',    sublabel: '2 dias',   value: cons.moderate,   color: T.orange },
              { label: 'Esporádicos',  sublabel: '1 dia',    value: cons.oneTime,    color: T.light  },
            ].map(item => (
              <View key={item.label} style={{ flex: 1, backgroundColor: item.color + '12', borderRadius: 10, padding: 10, alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: item.color }}>{item.value}</Text>
                <Text style={{ fontSize: 10, color: T.sub, textAlign: 'center' }}>{item.label}</Text>
                <Text style={{ fontSize: 9, color: T.light }}>{item.sublabel}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Evolução de pontos (sparkline) */}
      {evolution.length > 0 && (
        <>
          <Divider />
          <Text style={{ fontSize: 11, color: T.sub, marginBottom: 8 }}>Pontos distribuídos (últimos 7 dias)</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 48, gap: 2 }}>
            {evolution.map(item => {
              const h     = Math.max(3, Math.round((item.points / maxEvol) * 48))
              const alpha = 0.3 + (item.points / maxEvol) * 0.7
              return (
                <View key={item.date} style={{ flex: 1, alignItems: 'center' }}>
                  <View style={{
                    width: '80%', height: h, borderRadius: 3,
                    backgroundColor: `rgba(33,150,243,${alpha.toFixed(2)})`,
                  }} />
                  <Text style={{ fontSize: 8, color: T.light, marginTop: 3 }}>{item.day}</Text>
                </View>
              )
            })}
          </View>
        </>
      )}
    </Card>
  )
}

/* ── Seção 5: Insights Inteligentes ─────────────────────────────────────── */
function InsightsSection({ d }) {
  const insights = generateInsights(
    d.challengeMetrics, d.evidenceMetrics, d.engagementMetrics,
    d.ranking, d.dailyPoints, d.resumoGeral, d.genero, d.etaria, d.ead
  )
  if (!insights.length) return null

  return (
    <>
      {insights.map((ins, i) => (
        <View key={i} style={{
          backgroundColor: ins.bg, borderRadius: 16,
          borderLeftWidth: 4, borderLeftColor: ins.color,
          padding: 14, marginBottom: 10,
          flexDirection: 'row', alignItems: 'flex-start', gap: 10,
        }}>
          <Text style={{ fontSize: 20, lineHeight: 24 }}>{ins.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: ins.color, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.4 }}>
              {ins.label}
            </Text>
            <Text style={{ fontSize: 13, color: T.text, lineHeight: 19 }}>{ins.text}</Text>
          </View>
        </View>
      ))}
    </>
  )
}

/* ── Tela principal ──────────────────────────────────────────────────────── */
export default function Dashboard() {
  const navigation = useNavigation()
  const insets     = useSafeAreaInsets()
  const { data, loading, error, refetch } = useUnifiedDashboard()

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>

      {/* Header */}
      <View style={{
        paddingTop: insets.top + 12, paddingBottom: 18, paddingHorizontal: 20,
        backgroundColor: T.dark, flexDirection: 'row', alignItems: 'center', gap: 12,
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 999, padding: 8 }}
        >
          <Icon source="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>Dashboard</Text>
          <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
            App · INEP · Comportamento · Inteligência
          </Text>
        </View>
        {loading
          ? <ActivityIndicator color="rgba(255,255,255,0.6)" size="small" />
          : (
            <TouchableOpacity onPress={refetch} style={{ padding: 4 }}>
              <Icon source="refresh" size={22} color="rgba(255,255,255,0.55)" />
            </TouchableOpacity>
          )
        }
      </View>

      {/* Erro */}
      {error && !loading && (
        <View style={{ backgroundColor: '#FFF3F3', padding: 12, margin: 16, borderRadius: 12 }}>
          <Text style={{ color: T.red, fontSize: 13 }}>Erro ao carregar dados</Text>
          <TouchableOpacity onPress={refetch} style={{ marginTop: 6 }}>
            <Text style={{ color: T.blue, fontSize: 13, fontWeight: '600' }}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : data ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 40 }}
        >

          {/* ── 1. Panorama ──────────────────────────────────────────── */}
          <SectionTitle
            icon="chart-box-outline"
            title="Visão Geral"
            subtitle="4 indicadores que definem o estado do produto"
          />
          <PanoramaSection
            challengeMetrics={data.challengeMetrics}
            evidenceMetrics={data.evidenceMetrics}
            engagementMetrics={data.engagementMetrics}
            resumoGeral={data.resumoGeral}
          />

          {/* ── 2. Perfil da Audiência ────────────────────────────────── */}
          <SectionTitle
            icon="account-group-outline"
            title="Perfil da Audiência"
            subtitle="Quem são os estudantes que o produto deve servir"
          />
          <AudienceSection
            genero={data.genero}
            etaria={data.etaria}
            ead={data.ead}
          />

          {/* ── 3. Inteligência de Desafios ───────────────────────────── */}
          <SectionTitle
            icon="brain"
            title="Inteligência de Desafios"
            subtitle="O que funciona, o que precisa de atenção"
          />
          <ChallengeSection challengeMetrics={data.challengeMetrics} />

          {/* ── 4. Ranking & Engajamento ──────────────────────────────── */}
          <SectionTitle
            icon="trophy-outline"
            title="Ranking & Engajamento"
            subtitle="Quem lidera e com qual frequência"
          />
          <RankingSection ranking={data.ranking} dailyPoints={data.dailyPoints} />

          {/* ── 5. Insights Inteligentes ─────────────────────────────── */}
          <SectionTitle
            icon="lightbulb-outline"
            title="Insights Inteligentes"
            subtitle="Derivados dos dados reais — app × INEP"
          />
          <InsightsSection d={data} />

        </ScrollView>
      ) : null}
    </View>
  )
}
