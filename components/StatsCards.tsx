import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Ionicons } from '@expo/vector-icons';

export default function StatsCards() {
  return (
    <View className="flex-row flex-wrap justify-between px-4 mt-4">
      <Card className="w-[48%] mb-4 bg-white border-0 shadow-sm">
        <Box className="pb-1">
          <Text className="text-sm text-gray-500">Today's Patients</Text>
        </Box>
        <Box>
          <View className="flex-row items-center">
            <Ionicons name="people" size={20} color="#3b82f6" />
            <Text className="text-2xl font-bold ml-2">12</Text>
          </View>
        </Box>
      </Card>

      <Card className="w-[48%] mb-4 bg-white border-0 shadow-sm">
        <Box className="pb-1">
          <Text className="text-sm text-gray-500">Recordings</Text>
        </Box>
        <Box>
          <View className="flex-row items-center">
            <Ionicons name="mic" size={20} color="#3b82f6" />
            <Text className="text-2xl font-bold ml-2">8</Text>
          </View>
        </Box>
      </Card>

      <Card className="w-[48%] mb-4 bg-white border-0 shadow-sm">
        <Box className="pb-1">
          <Text className="text-sm text-gray-500">Next Appointment</Text>
        </Box>
        <Box>
          <View className="flex-row items-center">
            <Ionicons name="time" size={20} color="#3b82f6" />
            <Text className="text-xl font-medium ml-2">14:30</Text>
          </View>
        </Box>
      </Card>

      <Card className="w-[48%] mb-4 bg-white border-0 shadow-sm">
        <Box className="pb-1">
          <Text className="text-sm text-gray-500">Completed</Text>
        </Box>
        <Box>
          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
            <Text className="text-2xl font-bold ml-2">75%</Text>
          </View>
        </Box>
      </Card>
    </View>
  );
}
