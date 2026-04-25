import React, { useState, useRef } from 'react'
import { TextInput } from 'react-native-paper'
import { Container, Input } from './InputHome.styles'

export default function InputHome({ onSearch }) {
  const [value, setValue] = useState('')
  const timerRef = useRef(null)

  const handleChange = (text) => {
    setValue(text)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (onSearch) onSearch(text.trim())
    }, 300)
  }

  return (
    <Container>
      <Input
        outlineStyle={{ borderRadius: 20 }}
        activeOutlineColor="#1d1d1d"
        outlineColor="#1d1d1d"
        textColor="#1d1d1d"
        mode="outlined"
        value={value}
        onChangeText={handleChange}
        placeholder="Buscar desafios"
        right={<TextInput.Icon icon="magnify" />}
      />
    </Container>
  )
}
