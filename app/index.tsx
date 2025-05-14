import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import { ScrollView, View, Pressable, StatusBar } from 'react-native';
import { Heading } from '@/components/ui/heading';
import { Ionicons } from '@expo/vector-icons';
import RecordingSession from '@/components/RecordingSession';
import StatsCards from '@/components/StatsCards';
import Header from '@/components/Header';
import MainAction from '@/components/MainAction';

export default function Home() {
  const [showRecorder, setShowRecorder] = useState(false);

  const handleBackToHome = () => {
    setShowRecorder(false);
  };

  return (
    <Box className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#0284c7" />

      {showRecorder ? (
        <View className="flex-1">
          <Box className="flex-row items-center bg-sky-600 px-4 pt-12 pb-4">
            <Pressable onPress={handleBackToHome} className="mr-3">
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
            <Heading size="md" className="text-white">
              Consultation Recording
            </Heading>
          </Box>
          <RecordingSession />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <Header />
          <StatsCards />
          <MainAction setShowRecorder={setShowRecorder} />
        </ScrollView>
      )}
    </Box>
  );
}
