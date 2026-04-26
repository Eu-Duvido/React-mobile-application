import React, { useRef, useEffect } from 'react'
import {
  View, ScrollView, TouchableOpacity, ActivityIndicator,
  Animated, Text as RNText,
} from 'react-native'
import { Text, Icon } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useInepDashboard } from '../../hooks/useInepDashboard'
import {
  toResumoCards,
  toEadData,
  toGeneroData,
  toRacaData,
  toEtariaData,
  toRankingAreaData,
  toRankingRegiaoData,
  toTaxaIesData,
  fmt,
} from '../../mappers/inepDashboardMapper'

/* ── Paleta INEP ─────────────────────────────────────────── */
const BLUE   = '#2196F3'
const PURPLE = '#9C27B0'
const TEAL   = '#00897B'
const DARK   = '#1A237E'

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
  return <Animated.View style={[{ width, height, borderRadius: radius, backgroundColor: '#e0e0e0', opacity: anim }, style]} />
}

function LoadingSkeleton() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        {[0,1,2,3,4,5].map((i) => (
          <View key={i} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, width: '30%', elevation: 2 }}>
            <SkeletonBox width={28} height={28} radius={14} style={{ marginBottom: 8 }} />
            <SkeletonBox width={50} height={20} style={{ marginBottom: 4 }} />
            <SkeletonBox width={60} height={10} />
          </View>
        ))}
      </View>
      {[0,1,2,3].map((i) => (
        <View key={i} style={{ backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2 }}>
          <SkeletonBox width={160} height={14} style={{ marginBottom: 16 }} />
          <SkeletonBox height={12} style={{ marginBottom: 10 }} />
          <SkeletonBox width="70%" height={12} style={{ marginBottom: 10 }} />
          <SkeletonBox width="50%" height={12} />
        </View>
      ))}
    </ScrollView>
  )
}

/* ── Layout primitivos ───────────────────────────────────── */
function Card({ title, accent = BLUE, children }) {
  return (
    <View style={{
      backgroundColor: '#fff', borderRadius: 20, padding: 20,
      marginBottom: 16, elevation: 3,
      shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
      borderLeftWidth: 4, borderLeftColor: accent,
    }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: '#1A237E', marginBottom: 16 }}>{title}</Text>
      {children}
    </View>
  )
}

function EmptyState({ message = 'Execute o data-pipeline para carregar dados INEP' }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 24 }}>
      <Text style={{ fontSize: 32, marginBottom: 8 }}>🗄️</Text>
      <Text style={{ fontSize: 13, color: '#aaa', textAlign: 'center' }}>{message}</Text>
    </View>
  )
}

function HBar({ label, value, maxVal, pct, color = BLUE, right }) {
  const w = maxVal > 0 ? `${Math.max(2, Math.round((value / maxVal) * 100))}%` : '2%'
  return (
    <View style={{ marginBottom: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
        <Text style={{ fontSize: 12, color: '#444', flex: 1, marginRight: 4 }} numberOfLines={1}>{label}</Text>
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#1c1c1e' }}>
          {right ?? fmt(value)}
          {pct != null ? <Text style={{ color: '#aaa', fontWeight: '400' }}> ({pct}%)</Text> : null}
        </Text>
      </View>
      <View style={{ height: 8, backgroundColor: '#f1f1f1', borderRadius: 4, overflow: 'hidden' }}>
        <View style={{ height: 8, width: w, borderRadius: 4, backgroundColor: color }} />
      </View>
    </View>
  )
}

/* ── Seção 1: KPI Cards do Resumo Geral ──────────────────── */
function ResumoCards({ resumoGeral }) {
  const cards = toResumoCards(resumoGeral)
  const row = resumoGeral[0]
  if (!cards.length) return null
  return (
    <>
      <View style={{
        backgroundColor: DARK, borderRadius: 20, padding: 20, marginBottom: 16,
        flexDirection: 'row', alignItems: 'center', gap: 12,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Censo INEP</Text>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>
            {row?.nuAnoCenso ?? '—'}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 4 }}>
            {fmt(row?.totalMatriculados)} matriculados · {row?.taxaConclusaoPct}% de conclusão
          </Text>
        </View>
        <Text style={{ fontSize: 40 }}>🎓</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
        {cards.map((c) => (
          <View key={c.label} style={{
            backgroundColor: '#fff', borderRadius: 16, padding: 14,
            width: '31%', elevation: 2,
            shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
          }}>
            <View style={{
              width: 32, height: 32, borderRadius: 16, backgroundColor: c.bg,
              alignItems: 'center', justifyContent: 'center', marginBottom: 8,
            }}>
              <Text style={{ fontSize: 16 }}>{c.icon}</Text>
            </View>
            <Text style={{ fontSize: 17, fontWeight: '800', color: c.color }}>{c.value}</Text>
            <Text style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{c.label}</Text>
          </View>
        ))}
      </View>
    </>
  )
}

/* ── Seção 2: EAD vs Presencial ──────────────────────────── */
function EadChart({ ead }) {
  const data = toEadData(ead)
  if (!data.length) return <Card title="🖥️ EAD vs Presencial" accent={BLUE}><EmptyState /></Card>
  const EAD_COLORS = { 'Presencial': '#2196F3', 'EAD': '#9C27B0', 'Não informado': '#9E9E9E' }
  const total = data.reduce((s, r) => s + r.value, 0)
  return (
    <Card title="🖥️ Modalidade de Ensino (EAD vs Presencial)" accent={PURPLE}>
      {/* Barra empilhada */}
      <View style={{ flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden', marginBottom: 16 }}>
        {data.map((r) => (
          <View key={r.label} style={{ flex: r.value, backgroundColor: EAD_COLORS[r.label] ?? '#888' }} />
        ))}
      </View>
      {data.map((r) => (
        <View key={r.label} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: EAD_COLORS[r.label] ?? '#888' }} />
              <Text style={{ fontSize: 13, color: '#333', fontWeight: '600' }}>{r.label}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#1c1c1e' }}>{r.pct}%</Text>
              <Text style={{ fontSize: 11, color: '#aaa' }}>{fmt(r.value)} ingressantes · {fmt(r.numCursos)} cursos</Text>
            </View>
          </View>
        </View>
      ))}
    </Card>
  )
}

/* ── Seção 3: Distribuição de Gênero ─────────────────────── */
function GeneroChart({ genero }) {
  const d = toGeneroData(genero)
  if (!d) return <Card title="👥 Gênero dos Ingressantes" accent={TEAL}><EmptyState /></Card>
  return (
    <Card title={`👥 Gênero dos Ingressantes — ${d.ano}`} accent={TEAL}>
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Feminino',  value: d.feminino,  pct: d.pctFeminino,  color: '#E91E63' },
          { label: 'Masculino', value: d.masculino, pct: d.pctMasculino, color: '#2196F3' },
        ].map((item) => (
          <View key={item.label} style={{
            flex: 1, backgroundColor: item.color + '15', borderRadius: 14,
            padding: 14, alignItems: 'center',
          }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: item.color }}>{item.pct}%</Text>
            <Text style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{item.label}</Text>
            <Text style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{fmt(item.value)}</Text>
          </View>
        ))}
      </View>
      {/* Barra comparativa */}
      <View style={{ height: 12, borderRadius: 6, overflow: 'hidden', flexDirection: 'row' }}>
        <View style={{ flex: d.pctFeminino, backgroundColor: '#E91E63' }} />
        <View style={{ flex: d.pctMasculino, backgroundColor: '#2196F3' }} />
      </View>
    </Card>
  )
}

/* ── Seção 4: Distribuição Racial ────────────────────────── */
function RacaChart({ raca }) {
  const data = toRacaData(raca)
  if (!data.length) return <Card title="🌎 Raça/Cor dos Ingressantes" accent="#795548"><EmptyState /></Card>
  const maxVal = Math.max(...data.map((r) => r.value))
  return (
    <Card title="🌎 Raça/Cor dos Ingressantes" accent="#795548">
      {data.map((r) => (
        <HBar
          key={r.label}
          label={r.label}
          value={r.value}
          maxVal={maxVal}
          pct={r.pct > 0 ? r.pct : Math.round((r.value / (raca[0]?.totalIngressantes || 1)) * 100)}
          color={r.color}
        />
      ))}
    </Card>
  )
}

/* ── Seção 5: Faixas Etárias ─────────────────────────────── */
function EtariaChart({ etaria }) {
  const data = toEtariaData(etaria)
  if (!data.length) return <Card title="📅 Faixa Etária dos Ingressantes" accent="#FF9800"><EmptyState /></Card>
  const maxVal = Math.max(...data.map((r) => r.value))
  const BAR_MAX_H = 80
  return (
    <Card title="📅 Faixa Etária dos Ingressantes" accent="#FF9800">
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: BAR_MAX_H + 28 }}>
        {data.map((item, i) => {
          const h = Math.max(4, Math.round((item.value / maxVal) * BAR_MAX_H))
          const alpha = 0.4 + (item.value / maxVal) * 0.6
          return (
            <View key={item.label} style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 9, color: '#555', fontWeight: '600', marginBottom: 3 }}>
                {fmt(item.value)}
              </Text>
              <View style={{
                width: '70%', height: h, borderRadius: 5,
                backgroundColor: `rgba(33,150,243,${alpha.toFixed(2)})`,
              }} />
              <Text style={{ fontSize: 9, color: '#888', marginTop: 5, textAlign: 'center' }}>{item.label}</Text>
            </View>
          )
        })}
      </View>
    </Card>
  )
}

/* ── Seção 6: Ranking por Área ───────────────────────────── */
function RankingAreaChart({ rankingArea }) {
  const data = toRankingAreaData(rankingArea)
  if (!data.length) return <Card title="📚 Ranking por Área" accent={PURPLE}><EmptyState /></Card>
  const maxVal = Math.max(...data.map((r) => r.value))
  return (
    <Card title="📚 Top Áreas por Ingressantes" accent={PURPLE}>
      {data.map((r, i) => (
        <View key={r.label} style={{ marginBottom: 11 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
              <View style={{
                width: 20, height: 20, borderRadius: 10,
                backgroundColor: PURPLE + '20', alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: PURPLE }}>{i + 1}</Text>
              </View>
              <Text style={{ fontSize: 12, color: '#333', flex: 1 }} numberOfLines={1}>
                {r.label}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#1c1c1e' }}>{fmt(r.value)}</Text>
              <Text style={{ fontSize: 10, color: '#aaa' }}>{r.pct}% conclusão</Text>
            </View>
          </View>
          <View style={{ height: 6, backgroundColor: '#f1f1f1', borderRadius: 3, overflow: 'hidden' }}>
            <View style={{
              height: 6,
              width: `${Math.max(2, Math.round((r.value / maxVal) * 100))}%`,
              borderRadius: 3,
              backgroundColor: PURPLE,
              opacity: 0.7 + (i === 0 ? 0.3 : 0),
            }} />
          </View>
        </View>
      ))}
    </Card>
  )
}

/* ── Seção 7: Ranking por Região ─────────────────────────── */
const REGIAO_COLORS = {
  'Norte':     '#00BCD4',
  'Nordeste':  '#FF9800',
  'Centro-Oeste': '#9C27B0',
  'Sudeste':   '#2196F3',
  'Sul':       '#4CAF50',
}

function RankingRegiaoChart({ rankingRegiao }) {
  const data = toRankingRegiaoData(rankingRegiao)
  if (!data.length) return <Card title="🗺️ Ranking por Região" accent="#00BCD4"><EmptyState /></Card>
  return (
    <Card title="🗺️ Top Cursos por Região" accent="#00BCD4">
      {data.map(({ regiao, cursos }) => {
        const cor = REGIAO_COLORS[regiao] ?? '#888'
        const maxIng = Math.max(...cursos.map((c) => c.ingressantes))
        return (
          <View key={regiao} style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: cor }} />
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#1A237E' }}>{regiao}</Text>
            </View>
            {cursos.map((c, i) => (
              <View key={c.curso + i} style={{ marginBottom: 8, paddingLeft: 18 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                  <Text style={{ fontSize: 11, color: '#555', flex: 1 }} numberOfLines={1}>
                    {c.rank}. {c.curso}
                  </Text>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#1c1c1e' }}>
                    {fmt(c.ingressantes)}
                  </Text>
                </View>
                <View style={{ height: 5, backgroundColor: '#f1f1f1', borderRadius: 3, overflow: 'hidden' }}>
                  <View style={{
                    height: 5,
                    width: `${Math.max(2, Math.round((c.ingressantes / maxIng) * 100))}%`,
                    borderRadius: 3,
                    backgroundColor: cor,
                    opacity: 0.8,
                  }} />
                </View>
              </View>
            ))}
          </View>
        )
      })}
    </Card>
  )
}

/* ── Seção 8: Taxa de Conclusão por IES ──────────────────── */
function TaxaIesChart({ taxaIes }) {
  const data = toTaxaIesData(taxaIes)
  if (!data.length) return <Card title="🏛️ Taxa de Conclusão por IES" accent={TEAL}><EmptyState /></Card>
  return (
    <Card title="🏛️ Top IES — Taxa de Conclusão" accent={TEAL}>
      {data.map((r, i) => (
        <View key={r.nome + i} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#1c1c1e' }} numberOfLines={1}>
                {r.nome}
              </Text>
              <Text style={{ fontSize: 10, color: '#888' }}>{r.uf} · {fmt(r.matriculados)} matric.</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: TEAL }}>{r.taxaConclusao}%</Text>
              <Text style={{ fontSize: 10, color: '#e53935' }}>Evasão: {r.taxaEvasao}%</Text>
            </View>
          </View>
          {/* Barra de conclusão (verde) */}
          <View style={{ height: 6, backgroundColor: '#f1f1f1', borderRadius: 3, overflow: 'hidden' }}>
            <View style={{
              height: 6,
              width: `${Math.min(100, r.taxaConclusao)}%`,
              borderRadius: 3, backgroundColor: TEAL,
            }} />
          </View>
        </View>
      ))}
    </Card>
  )
}

/* ── Tela principal ──────────────────────────────────────── */
export default function InepDashboard() {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const {
    resumoGeral, rankingRegiao, rankingArea,
    genero, raca, etaria, ead, taxaIes,
    loading, error, refetch,
  } = useInepDashboard()

  const isEmpty = !loading && !error &&
    resumoGeral.length === 0 && rankingArea.length === 0 && ead.length === 0

  return (
    <View style={{ flex: 1, backgroundColor: '#EEF2FF' }}>
      {/* Header */}
      <View style={{
        paddingTop: insets.top + 12, paddingBottom: 16, paddingHorizontal: 20,
        backgroundColor: DARK, flexDirection: 'row', alignItems: 'center', gap: 12,
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 999, padding: 8 }}
        >
          <Icon source="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>Censo INEP</Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Dados educacionais 2024</Text>
        </View>
        {loading
          ? <ActivityIndicator color="rgba(255,255,255,0.6)" />
          : <TouchableOpacity onPress={refetch}>
              <Icon source="refresh" size={24} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
        }
      </View>

      {error && (
        <View style={{ backgroundColor: '#fff3f3', padding: 12, margin: 16, borderRadius: 12 }}>
          <Text style={{ color: '#e53935', fontSize: 13 }}>Erro: {error}</Text>
          <TouchableOpacity onPress={refetch} style={{ marginTop: 8 }}>
            <Text style={{ color: BLUE, fontSize: 13, fontWeight: '600' }}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : isEmpty ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🗄️</Text>
          <Text style={{ fontSize: 16, fontWeight: '700', color: DARK, textAlign: 'center', marginBottom: 8 }}>
            Dados INEP não carregados
          </Text>
          <Text style={{ fontSize: 13, color: '#888', textAlign: 'center' }}>
            Execute o data-pipeline para popular o banco com os microdados do censo.
          </Text>
          <TouchableOpacity
            onPress={refetch}
            style={{ marginTop: 20, backgroundColor: BLUE, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Verificar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 40 }}
        >
          <ResumoCards resumoGeral={resumoGeral} />
          <EadChart ead={ead} />
          <GeneroChart genero={genero} />
          <RacaChart raca={raca} />
          <EtariaChart etaria={etaria} />
          <RankingAreaChart rankingArea={rankingArea} />
          <RankingRegiaoChart rankingRegiao={rankingRegiao} />
          <TaxaIesChart taxaIes={taxaIes} />
        </ScrollView>
      )}
    </View>
  )
}
