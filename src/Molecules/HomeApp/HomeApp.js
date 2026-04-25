import React, { useState } from 'react'
import { ContainerApp } from './HomeApp.styles'
import HeaderApp from '../../Atoms/HeaderApp/HeaderApp'
import InputHome from '../../Atoms/InputHome/InputHome'
import ChallengeChip from '../../Atoms/ChallengeChip/ChallengeChip'
import AppMenu from '../../Atoms/AppMenu/AppMenu'
import { useUserContext } from '../../contexts/UserContext'

export default function HomeApp() {
  const { user } = useUserContext()
  const [search, setSearch] = useState('')

  return (
    <ContainerApp>
      <HeaderApp name={user?.name || 'Visitante'} />
      <InputHome onSearch={setSearch} />
      <ChallengeChip userId={user?.id} search={search} />
      <AppMenu />
    </ContainerApp>
  )
}
