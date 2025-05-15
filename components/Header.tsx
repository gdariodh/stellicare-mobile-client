import { Pressable, View, StyleSheet, Animated } from 'react-native';
import { Box } from './ui/box';
import { Heading } from './ui/heading';
import { Text } from './ui/text';
import { useEffect, useState, useRef } from 'react';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function Header({
  showRecorder,
  setShowRecorder,
  userName = 'Dr. Raúl',
  userRole = 'Medical Voice Recognition System',
  logo,
}: {
  showRecorder?: boolean;
  setShowRecorder?: (show: boolean) => void;
  userName?: string;
  userRole?: string;
  logo?: React.ReactNode;
}) {
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  // Colores que coinciden con el fondo animado
  const colors = {
    primary: '#0369a1', // Azul más oscuro para el header
    accent: '#D4E9ED', // Amarillo dorado
    light: '#D4E9ED', // Azul claro
    text: '#FFFFFF', // Blanco para texto
    textSecondary: 'rgba(255, 255, 255, 0.9)', // Blanco con alta opacidad
  };

  useEffect(() => {
    // Animación al montar
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Actualizar greeting, hora y fecha
    const updateTimeInfo = () => {
      const now = new Date();
      const hour = now.getHours();

      // Actualizar saludo
      if (hour >= 5 && hour < 12) {
        setGreeting('Good morning');
      } else if (hour >= 12 && hour < 18) {
        setGreeting('Good afternoon');
      } else {
        setGreeting('Good evening');
      }

      // Formatear hora actual (formato 12 horas)
      let hours = hour % 12;
      hours = hours ? hours : 12; // La hora '0' debe ser '12'
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hour >= 12 ? 'PM' : 'AM';
      setCurrentTime(`${hours}:${minutes} ${ampm}`);

      // Formatear fecha actual
      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };

    // Actualizar inmediatamente y luego cada minuto
    updateTimeInfo();
    const interval = setInterval(updateTimeInfo, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleBackToHome = () => {
    if (setShowRecorder) {
      // Animación al salir
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowRecorder(false);
      });
    }
  };

  return (
    <Box style={[styles.container, { backgroundColor: colors.primary }]}>
      <Animated.View
        style={[
          styles.headerTop,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Heading size="xl" style={{ color: colors.text, fontWeight: '700' }}>
            Stellicare
          </Heading>
          {logo}
        </View>
      </Animated.View>

      {showRecorder ? (
        <Animated.View
          style={[
            styles.recorderHeader,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Pressable onPress={handleBackToHome} style={styles.backButton}>
            <View
              style={[
                styles.backButtonContainer,
                { backgroundColor: colors.accent },
              ]}
            >
              <Ionicons name="arrow-back" size={20} color="black" />
            </View>
            <Text style={styles.backButtonText}>Back to Home</Text>
          </Pressable>
        </Animated.View>
      ) : (
        <Animated.View
          style={[
            styles.userInfoContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.greetingRow}>
            <Text style={styles.greetingText}>
              {greeting}, <Text style={styles.userNameText}>{userName}</Text>
            </Text>

            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
              ]}
            >
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>

          <View style={styles.roleContainer}>
            <Ionicons
              name="mic"
              size={16}
              color={colors.accent}
              style={styles.roleIcon}
            />
            <Text style={styles.roleText}>{userRole}</Text>
          </View>
        </Animated.View>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
  },
  logoIcon: {
    marginLeft: 8,
  },
  userInfoContainer: {
    marginTop: 8,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  greetingText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
  userNameText: {
    fontWeight: '700',
    color: 'white',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
    marginRight: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  roleIcon: {
    marginRight: 4,
  },
  roleText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  recorderHeader: {
    marginTop: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButtonContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  recorderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  recordingIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  recordingText: {
    color: 'white',
    fontWeight: '500',
  },
});
