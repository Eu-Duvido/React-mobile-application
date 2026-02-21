import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { NavBar } from './HeaderApp.styles';

export class HeaderApp extends Component {
  render() {
    const { name } = this.props;

    return (
      <NavBar>
        <View style={{width: '100%'}}>
            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                 <View style={{alignItems: 'center', flexDirection: 'row'}}> <Text variant="titleLarge">Olá, {name}</Text>
           <Image
        source={require('../../../assets/images/icon.png')}
        style={{ width: 70, height: 70 }}
        resizeMode="contain"
      /></View>
        <Avatar.Text size={48} label="SL" />
            </View>
           
          <Text style = {{opacity: 0.7}} variant="bodyLarge">Vamos se desafiar?</Text>
        </View>
      
      </NavBar>
    );
  }
}

export default HeaderApp;
