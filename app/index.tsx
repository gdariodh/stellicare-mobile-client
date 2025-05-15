import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import { ScrollView, StatusBar } from 'react-native';
import RecordingSession from '@/components/RecordingSession';
import StatsCards from '@/components/StatsCards';
import Header from '@/components/Header';
import MainAction from '@/components/MainAction';

export default function Home() {
  const [showRecorder, setShowRecorder] = useState(false);

  return (
    <Box className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#0284c7" />

      {showRecorder ? (
        <>
          <Header
            showRecorder={showRecorder}
            setShowRecorder={setShowRecorder}
          />
          <RecordingSession />
        </>
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
