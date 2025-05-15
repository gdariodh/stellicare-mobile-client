import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
  withDelay,
  withSequence,
} from 'react-native-reanimated';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  G,
} from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedBackground = ({
  children,
  style,
  colors = {
    sky: '#D4E9ED', // Uno de los azules claros solicitados
    wave: '#C0E5E9', // El otro azul claro solicitado
    bottom: '#D4E9ED', // Manteniendo coherencia con el cielo
    waveGradient: {
      start: '#C0E5E9', // Azul claro
      middle: '#F3BA00', // Amarillo dorado solicitado
      end: '#CFC0C0', // Gris rosado solicitado
    },
    circles: '#F3BA00', // Círculos en amarillo dorado
    decorations: '#CFC0C0', // Decoraciones en gris rosado
  },
  animationDuration = 20000, // Duración reducida para un efecto más dinámico
}: {
  children: React.ReactNode;
  style?: any;
  colors?: {
    sky: string;
    wave: string;
    bottom: string;
    waveGradient?: {
      start: string;
      middle: string;
      end: string;
    };
    circles?: string;
    decorations?: string;
  };
  animationDuration?: number;
}) => {
  // Animation progress values
  const horizontalProgress = useSharedValue(0);
  const verticalProgress = useSharedValue(0);
  const scaleProgress = useSharedValue(0);
  const circleProgress1 = useSharedValue(0);
  const circleProgress2 = useSharedValue(0);
  const circleProgress3 = useSharedValue(0);

  // Start the animations when the component mounts
  useEffect(() => {
    // Horizontal wave movement - más pronunciado
    horizontalProgress.value = withRepeat(
      withTiming(1, {
        duration: animationDuration,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // Infinite repeat
      true // Reverse on completion
    );

    // Vertical wave movement - más amplitud
    verticalProgress.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: animationDuration / 2,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(0, {
          duration: animationDuration / 2,
          easing: Easing.inOut(Easing.quad),
        })
      ),
      -1 // Infinite repeat
    );

    // Scale breathing effect - más pronunciado
    scaleProgress.value = withRepeat(
      withDelay(
        animationDuration / 5,
        withTiming(1, {
          duration: animationDuration / 1.5,
          easing: Easing.inOut(Easing.sin),
        })
      ),
      -1, // Infinite repeat
      true // Reverse on completion
    );

    // Animated decorative circles - más dinámicos
    circleProgress1.value = withRepeat(
      withTiming(1, {
        duration: animationDuration * 0.6,
        easing: Easing.inOut(Easing.cubic),
      }),
      -1,
      true
    );

    circleProgress2.value = withRepeat(
      withDelay(
        1500,
        withTiming(1, {
          duration: animationDuration * 0.7,
          easing: Easing.inOut(Easing.quad),
        })
      ),
      -1,
      true
    );

    circleProgress3.value = withRepeat(
      withDelay(
        3000,
        withTiming(1, {
          duration: animationDuration * 0.5,
          easing: Easing.inOut(Easing.sin),
        })
      ),
      -1,
      true
    );
  }, [animationDuration]);

  // Animated style for the wave path - amplificado
  const animatedWaveStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            horizontalProgress.value,
            [0, 1],
            [0, -SCREEN_WIDTH * 0.9] // Mayor movimiento horizontal
          ),
        },
        {
          translateY: interpolate(
            verticalProgress.value,
            [0, 1],
            [0, -25] // Mayor movimiento vertical
          ),
        },
        {
          scale: interpolate(
            scaleProgress.value,
            [0, 1],
            [1, 1.08] // Mayor efecto de escala
          ),
        },
      ],
    };
  });

  // Create multiple waves for a layered effect - con más amplitud
  const createWave = (
    height: number,
    opacity: number,
    delay: number,
    amplitude: number,
    fillId: string
  ) => {
    const waveProgress = useSharedValue(0);

    useEffect(() => {
      waveProgress.value = withDelay(
        delay,
        withRepeat(
          withTiming(1, {
            duration: animationDuration + delay,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true
        )
      );
    }, [delay, animationDuration]);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: interpolate(
              waveProgress.value,
              [0, 1],
              [0, -SCREEN_WIDTH * 0.9] // Mayor movimiento horizontal
            ),
          },
          {
            translateY: interpolate(
              verticalProgress.value,
              [0, 1],
              [0, -12 * amplitude] // Mayor movimiento vertical
            ),
          },
        ],
        opacity,
      };
    });

    // Ondas más pronunciadas
    return (
      <Animated.View style={animatedStyle}>
        <Svg
          height={SCREEN_HEIGHT * 0.45} // Mayor altura para las olas
          width={SCREEN_WIDTH * 2.2} // Mayor ancho para extender las olas
          style={styles.svg}
        >
          <Path
            d={`M0,${50 * amplitude} 
              C${SCREEN_WIDTH * 0.25},${30 * amplitude} 
              ${SCREEN_WIDTH * 0.5},${70 * amplitude} 
              ${SCREEN_WIDTH * 0.75},${35 * amplitude} 
              C${SCREEN_WIDTH},${15 * amplitude} 
              ${SCREEN_WIDTH * 1.25},${60 * amplitude} 
              ${SCREEN_WIDTH * 1.5},${25 * amplitude} 
              C${SCREEN_WIDTH * 1.75},${10 * amplitude} 
              ${SCREEN_WIDTH * 2},${45 * amplitude} 
              ${SCREEN_WIDTH * 2.2},${SCREEN_HEIGHT * 0.45} 
              L0,${SCREEN_HEIGHT * 0.45} Z`}
            fill={fillId ? `url(#${fillId})` : colors.wave}
            fillOpacity={opacity}
          />
        </Svg>
      </Animated.View>
    );
  };

  // Create decorative circle components - más llamativos
  const createDecorativeCircle = (
    x: number,
    y: number,
    radius: number,
    opacity: number,
    progress: Animated.SharedValue<number>
  ) => {
    const animatedCircleStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: interpolate(
              progress.value,
              [0, 0.5, 1],
              [0, x * 0.15, 0] // Mayor movimiento
            ),
          },
          {
            translateY: interpolate(
              progress.value,
              [0, 0.5, 1],
              [0, y * 0.15, 0] // Mayor movimiento
            ),
          },
          {
            scale: interpolate(progress.value, [0, 0.5, 1], [1, 1.15, 1]), // Mayor escala
          },
        ],
        opacity: interpolate(
          progress.value,
          [0, 0.5, 1],
          [opacity, opacity * 0.7, opacity]
        ),
      };
    });

    return (
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: x,
            top: y,
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
            backgroundColor: colors.circles,
          },
          animatedCircleStyle,
        ]}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      {/* Sky background with enhanced animation */}
      <Animated.View
        style={[
          styles.skyBackground,
          { backgroundColor: colors.sky },
          useAnimatedStyle(() => ({
            opacity: interpolate(
              scaleProgress.value,
              [0, 1],
              [0.94, 1] // Mayor contraste
            ),
          })),
        ]}
      />

      {/* Animated wave container */}
      <View style={styles.waveContainer}>
        <Svg style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="waveGradient1" x1="0" y1="0" x2="0" y2="1">
              <Stop
                offset="0"
                stopColor={colors.waveGradient?.start}
                stopOpacity="0.8"
              />
              <Stop
                offset="0.5"
                stopColor={colors.waveGradient?.middle}
                stopOpacity="0.6"
              />
              <Stop
                offset="1"
                stopColor={colors.waveGradient?.end}
                stopOpacity="0.7"
              />
            </LinearGradient>
            <LinearGradient id="waveGradient2" x1="0" y1="0" x2="0" y2="1">
              <Stop
                offset="0"
                stopColor={colors.waveGradient?.middle}
                stopOpacity="0.75"
              />
              <Stop
                offset="0.6"
                stopColor={colors.waveGradient?.end}
                stopOpacity="0.65"
              />
              <Stop
                offset="1"
                stopColor={colors.waveGradient?.start}
                stopOpacity="0.8"
              />
            </LinearGradient>
            <LinearGradient id="waveGradient3" x1="0" y1="0" x2="0" y2="1">
              <Stop
                offset="0"
                stopColor={colors.waveGradient?.end}
                stopOpacity="0.7"
              />
              <Stop
                offset="0.4"
                stopColor={colors.waveGradient?.start}
                stopOpacity="0.6"
              />
              <Stop
                offset="1"
                stopColor={colors.waveGradient?.middle}
                stopOpacity="0.8"
              />
            </LinearGradient>
          </Defs>
        </Svg>

        {/* Multiple layered waves for enhanced effect */}
        {createWave(SCREEN_HEIGHT * 0.45, 0.8, 0, 1.2, 'waveGradient1')}
        {createWave(SCREEN_HEIGHT * 0.42, 0.7, 500, 1.0, 'waveGradient2')}
        {createWave(SCREEN_HEIGHT * 0.44, 0.6, 1000, 1.1, 'waveGradient3')}
      </View>

      {/* Bottom fill with enhanced animation */}
      <Animated.View
        style={[
          styles.bottomFill,
          { backgroundColor: colors.bottom },
          useAnimatedStyle(() => ({
            transform: [
              {
                translateY: interpolate(
                  verticalProgress.value,
                  [0, 1],
                  [0, -8] // Mayor movimiento vertical
                ),
              },
            ],
          })),
        ]}
      />

      {/* Decorative elements - más llamativos */}
      <View style={styles.decorations}>
        {/* Curved path decorations */}
        <Svg
          height={SCREEN_HEIGHT}
          width={SCREEN_WIDTH}
          style={StyleSheet.absoluteFill}
        >
          <Path
            d={`M${SCREEN_WIDTH * 0.05},${SCREEN_HEIGHT * 0.35} 
                Q${SCREEN_WIDTH * 0.5},${SCREEN_HEIGHT * 0.2} 
                ${SCREEN_WIDTH * 0.95},${SCREEN_HEIGHT * 0.4}`}
            stroke={colors.decorations || colors.circles}
            strokeWidth="2" // Línea más gruesa
            fill="none"
            strokeOpacity="0.4" // Mayor opacidad
          />
          <Path
            d={`M${SCREEN_WIDTH * 0.05},${SCREEN_HEIGHT * 0.6} 
                Q${SCREEN_WIDTH * 0.4},${SCREEN_HEIGHT * 0.75} 
                ${SCREEN_WIDTH * 0.95},${SCREEN_HEIGHT * 0.5}`}
            stroke={colors.decorations || colors.circles}
            strokeWidth="2" // Línea más gruesa
            fill="none"
            strokeOpacity="0.3" // Mayor opacidad
          />
          {/* Nueva línea decorativa */}
          <Path
            d={`M${SCREEN_WIDTH * 0.1},${SCREEN_HEIGHT * 0.8} 
                Q${SCREEN_WIDTH * 0.6},${SCREEN_HEIGHT * 0.65} 
                ${SCREEN_WIDTH * 0.9},${SCREEN_HEIGHT * 0.85}`}
            stroke={colors.decorations || colors.circles}
            strokeWidth="1.5"
            fill="none"
            strokeOpacity="0.25"
          />
        </Svg>

        {/* Animated decorative circles - más y más grandes */}
        {createDecorativeCircle(
          SCREEN_WIDTH * 0.15,
          SCREEN_HEIGHT * 0.2,
          35, // Mayor tamaño
          0.25, // Mayor opacidad
          circleProgress1
        )}
        {createDecorativeCircle(
          SCREEN_WIDTH * 0.85,
          SCREEN_HEIGHT * 0.3,
          25, // Mayor tamaño
          0.2, // Mayor opacidad
          circleProgress2
        )}
        {createDecorativeCircle(
          SCREEN_WIDTH * 0.2,
          SCREEN_HEIGHT * 0.7,
          45, // Mayor tamaño
          0.15, // Mayor opacidad
          circleProgress3
        )}
        {/* Nuevos círculos decorativos */}
        {createDecorativeCircle(
          SCREEN_WIDTH * 0.75,
          SCREEN_HEIGHT * 0.65,
          30,
          0.2,
          circleProgress2
        )}
        {createDecorativeCircle(
          SCREEN_WIDTH * 0.4,
          SCREEN_HEIGHT * 0.4,
          22,
          0.25,
          circleProgress1
        )}
      </View>

      {/* Content */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  skyBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  waveContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.3, // Posición ligeramente más alta
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.5, // Mayor altura
    overflow: 'hidden',
  },
  svg: {
    position: 'absolute',
  },
  bottomFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.45, // Mayor altura
  },
  decorations: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
});

export default AnimatedBackground;
