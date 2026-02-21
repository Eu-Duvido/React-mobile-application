import styled from 'styled-components/native'

export const Row = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
background-color: #f1f1f1;

`

export const Left = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`

export const Info = styled.View`
  justify-content: center;
`

export const Right = styled.View`
  align-items: flex-end;
`

export const LevelBadge = styled.View`
  background-color: #1d1d1d;
  padding: 6px 10px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`
