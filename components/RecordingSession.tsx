import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, Alert, StyleSheet, Pressable } from 'react-native';
import { useAudioRecorder, RecordingPresets, AudioModule } from 'expo-audio';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Button, ButtonText } from '@/components/ui/button';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { Heading } from '@/components/ui/heading';
import AnimatedBackground from './AnimatedBackground';

export default function RecordingSession() {
  const doctorRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const patientRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const [isDoctorRecording, setIsDoctorRecording] = useState(false);
  const [isPatientRecording, setIsPatientRecording] = useState(false);
  const [voiceDetected, setVoiceDetected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const doctorPulseScale = useSharedValue(1);
  const patientPulseScale = useSharedValue(1);

  const voiceDetectionTimer = useRef(null);

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert(
          'Permiso denegado',
          'Se requiere acceso al micrófono para grabar'
        );
      }
    })();

    return () => {
      if (voiceDetectionTimer.current) {
        clearTimeout(voiceDetectionTimer.current);
      }
    };
  }, []);

  const recordDoctor = async () => {
    if (isPatientRecording) {
      await stopPatientRecording();
    }

    try {
      await doctorRecorder.prepareToRecordAsync();
      doctorRecorder.record();
      setIsDoctorRecording(true);

      doctorPulseScale.value = withRepeat(
        withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );

      simulateVoiceDetection('doctor');
    } catch (error) {
      console.error('Error al iniciar grabación del doctor:', error);
      Alert.alert('Error', 'No se pudo iniciar la grabación');
    }
  };

  const stopDoctorRecording = async () => {
    try {
      await doctorRecorder.stop();
      setIsDoctorRecording(false);
      doctorPulseScale.value = 1;

      if (voiceDetectionTimer.current) {
        clearTimeout(voiceDetectionTimer.current);
      }
    } catch (error) {
      console.error('Error al detener grabación del doctor:', error);
    }
  };

  const recordPatient = async () => {
    if (isDoctorRecording) {
      await stopDoctorRecording();
    }

    try {
      await patientRecorder.prepareToRecordAsync();
      patientRecorder.record();
      setIsPatientRecording(true);

      patientPulseScale.value = withRepeat(
        withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );

      simulateVoiceDetection('patient');
    } catch (error) {
      console.error('Error al iniciar grabación del paciente:', error);
      Alert.alert('Error', 'No se pudo iniciar la grabación');
    }
  };

  const stopPatientRecording = async () => {
    try {
      await patientRecorder.stop();
      setIsPatientRecording(false);
      patientPulseScale.value = 1;

      if (voiceDetectionTimer.current) {
        clearTimeout(voiceDetectionTimer.current);
      }
    } catch (error) {
      console.error('Error al detener grabación del paciente:', error);
    }
  };

  // Simulate voice detection (in a real app, this would use audio analysis)
  const simulateVoiceDetection = (type) => {
    // Clear any existing timer
    if (voiceDetectionTimer.current) {
      clearTimeout(voiceDetectionTimer.current);
    }

    // Set a random timeout to simulate detection
    voiceDetectionTimer.current = setTimeout(() => {
      setVoiceDetected(type);
      setShowModal(true);
    }, Math.random() * 3000 + 1000);
  };

  const doctorPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: doctorPulseScale.value }],
      opacity: withTiming(isDoctorRecording ? 0.6 : 0, { duration: 300 }),
      width: '100%',
      height: '100%',
      borderRadius: 16,
    };
  });

  const patientPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: patientPulseScale.value }],
      opacity: withTiming(isPatientRecording ? 0.6 : 0, { duration: 300 }),
      width: '100%',
      height: '100%',
      borderRadius: 16,
    };
  });

  return (
    <AnimatedBackground>
      {/* Contenedor principal centrado */}
      <View
        style={styles.mainContainer}
        className="flex-1 justify-center items-center px-4"
      >
        <View className="w-full max-w-md flex border h-full relative justify-evenly">
          {/* Doctor Recorder Section */}
          <Pressable
            onPress={isDoctorRecording ? stopDoctorRecording : recordDoctor}
            className="items-center justify-center p-4 m-4 rounded-2xl"
            style={styles.sectionContainer}
          >
            <View className="relative items-center justify-center">
              <Animated.View
                style={[doctorPulseStyle, styles.pulseBackground]}
                className="absolute bg-primary-500"
              />
              <View className="relative items-center">
                <View className="rounded-full bg-blue-100 w-[69px] h-[69px] flex items-center justify-center shadow-lg shadow-blue-500/50 mb-4">
                  <Image
                    className="rounded-full flex items-center justify-center"
                    source={require('@/assets/images/doctor.png')}
                    style={{ width: 59, height: 59 }}
                  />
                </View>

                <View className="bg-blue-500 rounded-full p-4 mb-2">
                  <Ionicons
                    name={isDoctorRecording ? 'stop' : 'mic'}
                    size={24}
                    color="white"
                  />
                </View>
                <Text className="text-gray-600 font-medium">Dr. Raúl</Text>
              </View>
            </View>
          </Pressable>

          {/* Patient Recorder Section */}
          <Pressable
            onPress={isPatientRecording ? stopPatientRecording : recordPatient}
            className="items-center justify-center p-4 m-4 rounded-2xl"
            style={styles.sectionContainer}
          >
            <View className="relative items-center justify-center">
              <Animated.View
                style={[patientPulseStyle, styles.pulseBackground]}
                className="absolute bg-red-500"
              />
              <View className="relative items-center">
                <View className="rounded-full bg-blue-100 w-[69px] h-[69px] flex items-center justify-center shadow-lg shadow-blue-500/50 mb-4">
                  <Image
                    className="rounded-full flex items-center justify-center"
                    source={require('@/assets/images/patient.png')}
                    style={{ width: 59, height: 59 }}
                  />
                </View>

                <View className="bg-red-500 rounded-full p-4 mb-2">
                  <Ionicons
                    name={isPatientRecording ? 'stop' : 'mic'}
                    size={24}
                    color="white"
                  />
                </View>
                <Text className="text-gray-600 font-medium">Patient</Text>
              </View>
            </View>
          </Pressable>

          <View className="flex-row items-center justify-center absolute right-0 bottom-0 left-0 pb-12">
            <Ionicons name="lock-closed-outline" size={16} color="#64748b" />
            <Text className="text-slate-500 ml-1">
              This session is being securely recorded.
            </Text>
          </View>
        </View>
      </View>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Voice Detected</Heading>
          </ModalHeader>
          <ModalBody>
            <Text className="text-gray-700 text-lg">
              {voiceDetected === 'doctor'
                ? "Doctor's voice has been detected and is being recorded."
                : "Patient's voice has been detected and is being recorded."}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              size="md"
              action="positive"
              className="bg-blue-500"
              onPress={() => setShowModal(false)}
            >
              <ButtonText>OK</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    position: 'relative',
    minHeight: 170,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  pulseBackground: {
    position: 'absolute',
    zIndex: 0,
  },
});
