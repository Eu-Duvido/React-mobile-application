import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { ContainerApp } from './HomeApp.styles'
import HeaderApp from '../../Atoms/HeaderApp/HeaderApp'
import InputHome from '../../Atoms/InputHome/InputHome'
import ChallengeChip from '../../Atoms/ChallengeChip/ChallengeChip'
import ChallengeCards from '../../Atoms/ChallengeCards/ChallengeCards'
import AppMenu from '../../Atoms/AppMenu/AppMenu'

export class HomeApp extends Component {
  render() {
    return (
      <ContainerApp>
        <HeaderApp name = 'samuca'></HeaderApp>

        <InputHome/>

        <ChallengeChip/>

        <AppMenu/>
      </ContainerApp>
    )
  }
}

export default HomeApp
