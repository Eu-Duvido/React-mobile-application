import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native'


export const BackgroundImage = styled.ImageBackground`
  justify-content: start;
  align-items: center;
  width: 100%;
  height: 300px;
`;


export const BackgroundImageChallenge = styled.ImageBackground`
  flex: 1;
  justify-content: start;
  align-items: center;
  flex-direction: column;
`;
export const Overlay = styled.ScrollView`
  background-color: #fff;
  margin-top: 250px;
  border-radius: 35px;
  min-height: 150%;
  max-height: auto;
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 100%;
 `

 export const StartAlign = styled.View`
   width: 100%;
    align-items: flex-start;
    margin-bottom: 16px;
    padding: 0 12px 0 32px;
  `

  export const SpaceBetween = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`


export const TabsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #f1f1f1;
  width: 100%;
  border-radius: 999px;
  padding: 4px;
  margin-bottom: 16px;
`

export const TabButton = styled(TouchableOpacity)`
  flex: 1;
  padding: 16px 32px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background-color: ${({ active }) =>
    active ? '#000' : 'transparent'};
`
