import styled from 'styled-components/native'
import { TouchableOpacity } from 'react-native'

export const HeroWrapper = styled.ImageBackground`
  justify-content: flex-end;
`

export const HeroOverlay = styled.View`
  background-color: rgba(0, 0, 0, 0.48);
  padding: 20px 20px 36px;
`

export const HeroTitle = styled.Text`
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
`

export const HeroSubtitle = styled.Text`
  color: rgba(255, 255, 255, 0.78);
  font-size: 13px;
`

export const BackButton = styled(TouchableOpacity)`
  position: absolute;
  left: 16px;
  z-index: 20;
  background-color: rgba(255, 255, 255, 0.88);
  border-radius: 999px;
  padding: 8px;
`

export const StatsCard = styled.View`
  margin: -28px 16px 0;
  border-radius: 20px;
  background-color: #fff;
  padding: 16px 20px 20px;
  elevation: 6;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 12px;
  shadow-offset: 0px 4px;
  z-index: 1;
`

export const ProgressLabel = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`

export const StatsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`

export const StatItem = styled.View`
  align-items: center;
  flex: 1;
`

export const StatValue = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #1c1c1e;
`

export const StatLabel = styled.Text`
  font-size: 11px;
  color: #888;
  margin-top: 2px;
`

export const StatDivider = styled.View`
  width: 1px;
  height: 36px;
  background-color: #e8e8e8;
`

export const SectionTitle = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: #1c1c1e;
  margin-top: 28px;
  margin-bottom: 12px;
`

export const DayRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 10px;
  gap: 10px;
`

export const DayBadge = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #1c1c1e;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

export const DayLine = styled.View`
  flex: 1;
  height: 1px;
  background-color: #e0e0e0;
`

export const ProofCard = styled.View`
  background-color: #fff;
  border-radius: 16px;
  padding: 14px 16px;
  margin-bottom: 10px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.06;
  shadow-radius: 6px;
  shadow-offset: 0px 2px;
`

export const ProofRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`

export const ProofIconWrap = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: #f1f1f1;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

export const ProofMeta = styled.View`
  flex: 1;
  min-width: 0;
`

export const ProofTime = styled.Text`
  font-size: 12px;
  color: #888;
  margin-top: 2px;
`

export const StatusPill = styled.View`
  padding: 4px 10px;
  border-radius: 999px;
  flex-shrink: 0;
  background-color: ${({ status }) =>
    status === 'approved' ? '#e6f4ea'
    : status === 'rejected' ? '#fde8e8'
    : '#f1f1f1'};
`

export const StatusPillText = styled.Text`
  font-size: 11px;
  font-weight: 600;
  color: ${({ status }) =>
    status === 'approved' ? '#2e7d32'
    : status === 'rejected' ? '#c62828'
    : '#666'};
`

export const AIPill = styled.View`
  padding: 3px 10px;
  border-radius: 999px;
  background-color: ${({ valid }) => (valid ? '#e8f5e9' : '#fff3e0')};
  margin-top: 8px;
  align-self: flex-start;
`

export const AIPillText = styled.Text`
  font-size: 10px;
  font-weight: 600;
  color: ${({ valid }) => (valid ? '#388e3c' : '#f57c00')};
`

export const RejectionBox = styled.View`
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #fde8e8;
  border-radius: 10px;
`

export const RejectionText = styled.Text`
  font-size: 12px;
  color: #c62828;
  line-height: 18px;
`

export const EmptyBox = styled.View`
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background-color: #fff;
  border-radius: 20px;
  margin-top: 8px;
`

export const EmptyText = styled.Text`
  font-size: 14px;
  color: #aaa;
  text-align: center;
  margin-top: 12px;
  line-height: 22px;
`

export const SubmitFab = styled(TouchableOpacity)`
  position: absolute;
  left: 16px;
  right: 16px;
  height: 56px;
  background-color: #1c1c1e;
  border-radius: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  elevation: 8;
  shadow-color: #000;
  shadow-opacity: 0.22;
  shadow-radius: 12px;
  shadow-offset: 0px 4px;
`

export const SubmitFabLabel = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 700;
`

export const ModalBackdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.55);
  justify-content: flex-end;
`

export const ModalSheet = styled.View`
  background-color: #fff;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  padding: 28px 20px 40px;
  gap: 14px;
`

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #1c1c1e;
`

export const PickerButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 16px;
`

export const PickerLabel = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #1c1c1e;
`

export const PickerSub = styled.Text`
  font-size: 12px;
  color: #888;
  margin-top: 1px;
`

export const PreviewThumb = styled.Image`
  width: 100%;
  height: 180px;
  border-radius: 16px;
  background-color: #e0e0e0;
`
