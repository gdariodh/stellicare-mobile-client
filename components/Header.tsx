import { View } from 'react-native';
import { Box } from './ui/box';
import { Heading } from './ui/heading';
import { Text } from './ui/text';
import { useEffect, useState } from 'react';

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

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

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box className="px-4 pt-12 pb-4 bg-sky-600">
      <View className="flex-row justify-between items-center">
        <Heading size="xl" className="text-white">
          Stellicare
        </Heading>
      </View>
      <Text className="text-white mt-2 text-xl font-medium">
        {greeting}, Dr. Raúl
      </Text>
      <Text className="text-sky-100 mt-1">
        Medical Voice Recognition System
      </Text>
    </Box>
  );
}
