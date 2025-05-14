import { View } from 'react-native';
import { Box } from './ui/box';
import { Card } from './ui/card';
import { Button, ButtonText } from './ui/button';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './ui/text';

export default function MainAction({
  setShowRecorder,
}: {
  setShowRecorder: (show: boolean) => void;
}) {
  const handleStartSession = () => {
    setShowRecorder(true);
  };

  return (
    <Card className="mx-4 mt-2 bg-white border-0 shadow-sm">
      <Box className="p-4">
        <View className="items-center">
          <Button
            size="lg"
            className="mt-6 bg-blue-500 "
            onPress={handleStartSession}
          >
            <Ionicons name="mic" size={20} color="white" className="mr-2" />
            <ButtonText className="text-white">
              Start Recording Session
            </ButtonText>
          </Button>

          <Text className="text-center mt-2 text-gray-600 px-4">
            Record and analyze doctor and patient voices during consultations.
            The system automatically detects who is speaking.
          </Text>
        </View>
      </Box>
    </Card>
  );
}
