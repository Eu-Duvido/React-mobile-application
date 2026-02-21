import { Avatar, Text } from 'react-native-paper'
import {
  Row,
  Left,
  Info,
  Right,
  LevelBadge,
} from './ChallengerRow.styled'
import { View } from 'react-native'

export default function ChallengerRow({
  avatar,
  name,
  points,
  level,
  rightIcon
}) {
  return (
    <Row>
      <Left>
        <Avatar.Image
          size={44}
          source={avatar}
        />

        <Info>
          <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
            {name}
          </Text>

          <Text variant="bodySmall" style={{ opacity: 0.6 }}>
            Nv {level}

          </Text>
        </Info>
      </Left>

      <Right>
        <LevelBadge>
            {rightIcon && <View>{rightIcon}</View>}

          <Text
            variant="bodySmall"
            style={{ color: '#fff', fontWeight: '600' }}
          >
            {points} pts
          </Text>
        </LevelBadge>
      </Right>
    </Row>
  )
}
