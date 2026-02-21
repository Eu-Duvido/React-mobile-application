import React, { Component } from 'react';
import { TextInput } from 'react-native-paper';
import { Container } from './InputHome.styles';
import { Input } from './InputHome.styles';

class InputHome extends Component {
  state = {
    value: '',
  };

  render() {
    const { value } = this.state;

    return (
      <Container>
        <Input
        outlineStyle={{ borderRadius: 20 }}
         activeOutlineColor="#1d1d1d"
          outlineColor="#1d1d1d"
          textColor="#1d1d1d"
          mode="outlined"
          value={value}
          onChangeText={(text) => this.setState({ value: text })}
          placeholder="Digite aqui"
          right={<TextInput.Icon icon="magnify" />}
        />
      </Container>
    );
  }
}

export default InputHome;
