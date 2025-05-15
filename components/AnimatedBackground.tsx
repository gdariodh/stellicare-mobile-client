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
    sky: '#b8e3f5', // Medical app light blue background from the image
    wave: '#a0d8f0', // Lighter blue for waves
    bottom: '#b8e3f5', // Same as sky for seamless look
    waveGradient: {
      start: '#a0d8f0', // Light blue
      middle: '#8fd0ed', // Medium blue
      end: '#7ac5e4', // Slightly darker blue
    },
    circles: '#7ac5e4', // Color for decorative circles
  },
  animationDuration = 25000, // Slower, more subtle animation for medical app feel
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
    // Horizontal wave movement - more subtle for medical app feel
    horizontalProgress.value = withRepeat(
      withTiming(1, {
        duration: animationDuration,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // Infinite repeat
      true // Reverse on completion
    );

    // Vertical wave movement (very slight bobbing)
    verticalProgress.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: animationDuration / 2.5,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(0, {
          duration: animationDuration / 2.5,
          easing: Easing.inOut(Easing.quad),
        })
      ),
      -1 // Infinite repeat
    );

    // Scale breathing effect - more subtle
    scaleProgress.value = withRepeat(
      withDelay(
        animationDuration / 4,
        withTiming(1, {
          duration: animationDuration / 1.5,
          easing: Easing.inOut(Easing.sin),
        })
      ),
      -1, // Infinite repeat
      true // Reverse on completion
    );

    // Animated decorative circles
    circleProgress1.value = withRepeat(
      withTiming(1, {
        duration: animationDuration * 0.7,
        easing: Easing.inOut(Easing.cubic),
      }),
      -1,
      true
    );

    circleProgress2.value = withRepeat(
      withDelay(
        2000,
        withTiming(1, {
          duration: animationDuration * 0.8,
          easing: Easing.inOut(Easing.quad),
        })
      ),
      -1,
      true
    );

    circleProgress3.value = withRepeat(
      withDelay(
        4000,
        withTiming(1, {
          duration: animationDuration * 0.6,
          easing: Easing.inOut(Easing.sin),
        })
      ),
      -1,
      true
    );
  }, [animationDuration]);

  // Animated style for the wave path
  const animatedWaveStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            horizontalProgress.value,
            [0, 1],
            [0, -SCREEN_WIDTH * 0.7]
          ),
        },
        {
          translateY: interpolate(
            verticalProgress.value,
            [0, 1],
            [0, -15] // Subtle vertical movement
          ),
        },
        {
          scale: interpolate(
            scaleProgress.value,
            [0, 1],
            [1, 1.05] // Subtle scaling effect
          ),
        },
      ],
    };
  });

  // Create multiple waves for a layered effect
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
              [0, -SCREEN_WIDTH * 0.7]
            ),
          },
          {
            translateY: interpolate(
              verticalProgress.value,
              [0, 1],
              [0, -7 * amplitude] // More subtle vertical movement for medical app
            ),
          },
        ],
        opacity,
      };
    });

    // More gentle, flowing waves for medical app
    return (
      <Animated.View style={animatedStyle}>
        <Svg
          height={SCREEN_HEIGHT * 0.4}
          width={SCREEN_WIDTH * 2}
          style={styles.svg}
        >
          <Path
            d={`M0,${40 * amplitude} 
              C${SCREEN_WIDTH * 0.25},${25 * amplitude} 
              ${SCREEN_WIDTH * 0.5},${55 * amplitude} 
              ${SCREEN_WIDTH * 0.75},${30 * amplitude} 
              C${SCREEN_WIDTH},${15 * amplitude} 
              ${SCREEN_WIDTH * 1.25},${45 * amplitude} 
              ${SCREEN_WIDTH * 1.5},${20 * amplitude} 
              C${SCREEN_WIDTH * 1.75},${10 * amplitude} 
              ${SCREEN_WIDTH * 2},${35 * amplitude} 
              ${SCREEN_WIDTH * 2},${SCREEN_HEIGHT * 0.4} 
              L0,${SCREEN_HEIGHT * 0.4} Z`}
            fill={fillId ? `url(#${fillId})` : colors.wave}
            fillOpacity={opacity}
          />
        </Svg>
      </Animated.View>
    );
  };

  // Create decorative circle components to mimic the medical app UI
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
              [0, x * 0.1, 0]
            ),
          },
          {
            translateY: interpolate(
              progress.value,
              [0, 0.5, 1],
              [0, y * 0.1, 0]
            ),
          },
          {
            scale: interpolate(progress.value, [0, 0.5, 1], [1, 1.1, 1]),
          },
        ],
        opacity: interpolate(
          progress.value,
          [0, 0.5, 1],
          [opacity, opacity * 0.8, opacity]
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
      {/* Sky background with slight animation */}
      <Animated.View
        style={[
          styles.skyBackground,
          { backgroundColor: colors.sky },
          useAnimatedStyle(() => ({
            opacity: interpolate(
              scaleProgress.value,
              [0, 1],
              [0.97, 1] // Very subtle sky brightness pulsing
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
                stopColor={colors.waveGradient?.start || colors.wave}
                stopOpacity="0.7"
              />
              <Stop
                offset="0.5"
                stopColor={colors.waveGradient?.middle || colors.wave}
                stopOpacity="0.8"
              />
              <Stop
                offset="1"
                stopColor={colors.waveGradient?.end || colors.wave}
                stopOpacity="0.9"
              />
            </LinearGradient>
            <LinearGradient id="waveGradient2" x1="0" y1="0" x2="0" y2="1">
              <Stop
                offset="0"
                stopColor={colors.waveGradient?.end || colors.wave}
                stopOpacity="0.65"
              />
              <Stop
                offset="1"
                stopColor={colors.waveGradient?.start || colors.wave}
                stopOpacity="0.75"
              />
            </LinearGradient>
          </Defs>
        </Svg>

        {/* Multiple layered waves for depth effect - with more subtle waves */}
        {createWave(SCREEN_HEIGHT * 0.4, 0.6, 0, 1.0, 'waveGradient1')}
        {createWave(SCREEN_HEIGHT * 0.38, 0.7, 700, 0.8, 'waveGradient2')}
        {createWave(SCREEN_HEIGHT * 0.39, 0.5, 1500, 0.9, '')}
      </View>

      {/* Bottom fill with subtle animation */}
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
                  [0, -3] // Very subtle vertical movement
                ),
              },
            ],
          })),
        ]}
      />

      {/* Decorative elements that mimic the curved lines in the medical app UI */}
      <View style={styles.decorations}>
        {/* Medical app curved path decorations */}
        <Svg
          height={SCREEN_HEIGHT}
          width={SCREEN_WIDTH}
          style={StyleSheet.absoluteFill}
        >
          <Path
            d={`M${SCREEN_WIDTH * 0.1},${SCREEN_HEIGHT * 0.35} 
                Q${SCREEN_WIDTH * 0.5},${SCREEN_HEIGHT * 0.2} 
                ${SCREEN_WIDTH * 0.9},${SCREEN_HEIGHT * 0.4}`}
            stroke={colors.circles}
            strokeWidth="1"
            fill="none"
            strokeOpacity="0.3"
          />
          <Path
            d={`M${SCREEN_WIDTH * 0.05},${SCREEN_HEIGHT * 0.6} 
                Q${SCREEN_WIDTH * 0.4},${SCREEN_HEIGHT * 0.75} 
                ${SCREEN_WIDTH * 0.95},${SCREEN_HEIGHT * 0.5}`}
            stroke={colors.circles}
            strokeWidth="1"
            fill="none"
            strokeOpacity="0.2"
          />
        </Svg>

        {/* Animated decorative circles */}
        {createDecorativeCircle(
          SCREEN_WIDTH * 0.15,
          SCREEN_HEIGHT * 0.2,
          30,
          0.2,
          circleProgress1
        )}
        {createDecorativeCircle(
          SCREEN_WIDTH * 0.85,
          SCREEN_HEIGHT * 0.3,
          20,
          0.15,
          circleProgress2
        )}
        {createDecorativeCircle(
          SCREEN_WIDTH * 0.2,
          SCREEN_HEIGHT * 0.7,
          40,
          0.1,
          circleProgress3
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
    top: SCREEN_HEIGHT * 0.33,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.45,
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
    height: SCREEN_HEIGHT * 0.42,
  },
  decorations: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
});

export default AnimatedBackground;
