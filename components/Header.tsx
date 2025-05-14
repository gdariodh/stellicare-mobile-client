import { Pressable, View } from 'react-native';
import { Box } from './ui/box';
import { Heading } from './ui/heading';
import { Text } from './ui/text';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Header({
  showRecorder,
  setShowRecorder,
}: {
  showRecorder?: boolean;
  setShowRecorder?: (show: boolean) => void;
}) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      const hour = now.getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting('Good morning');
      } else if (hour >= 12 && hour < 18) {
        setGreeting('Good afternoon');
      } else {
        setGreeting('Good evening');
      }
    }, 60000);

    const now = new Date();
    const hour = now.getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }

    return () => clearInterval(interval);
  }, []);

  const handleBackToHome = () => {
    if (setShowRecorder) {
      setShowRecorder(false);
    }
  };

  return (
    <Box className="px-4 pt-12 pb-4 bg-sky-600">
      <View className="flex-row justify-between items-center pt-10">
        <Heading size="xl" className="text-white">
          Stellicare
        </Heading>
      </View>

      {showRecorder ? (
        <View className="mt-4">
          {/* Back button row */}
          <View className="flex-row items-center">
            <Pressable
              onPress={handleBackToHome}
              className="flex-row items-center"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
              <Text className="text-white ml-2">Back to Home</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View className="mt-2">
          <Text className="text-white text-xl font-medium">
            {greeting}, Dr. Raúl
          </Text>
          <Text className="text-sky-100 mt-1">
            Medical Voice Recognition System
          </Text>
        </View>
      )}
    </Box>
  );
}
