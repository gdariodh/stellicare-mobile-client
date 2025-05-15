import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedBackground = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) => {
  // Animation progress value
  const progress = useSharedValue(0);

  // Start the animation when the component mounts
  useEffect(() => {
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
      -1, // Infinite repeat
      true // Reverse on completion
    );
  }, []);

  // Animated style for the path
  const animatedPathStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [0, 1],
            [0, -SCREEN_WIDTH * 0.7]
          ),
        },
      ],
    };
  });

  return (
    <View style={[styles.container, style]}>
      {/* Blue sky background */}
      <View style={styles.skyBackground} />

      {/* Animated wave */}
      <View style={styles.waveContainer}>
        <Animated.View style={animatedPathStyle}>
          <Svg
            height={SCREEN_HEIGHT * 0.4}
            width={SCREEN_WIDTH * 2}
            style={styles.svg}
          >
            <Path
              d={`M0,60 
                C${SCREEN_WIDTH * 0.25},30 
                ${SCREEN_WIDTH * 0.5},100 
                ${SCREEN_WIDTH * 0.75},40 
                C${SCREEN_WIDTH},0 
                ${SCREEN_WIDTH * 1.25},90 
                ${SCREEN_WIDTH * 1.5},30 
                C${SCREEN_WIDTH * 1.75},0 
                ${SCREEN_WIDTH * 2},60 
                ${SCREEN_WIDTH * 2},${SCREEN_HEIGHT * 0.4} 
                L0,${SCREEN_HEIGHT * 0.4} Z`}
              fill="#f8d7da"
              fillOpacity={0.9}
            />
          </Svg>
        </Animated.View>
      </View>

      {/* Bottom pink fill */}
      <View style={styles.bottomFill} />

      {/* Content goes here */}
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
    backgroundColor: '#a8d8f0', // Light blue for the sky
  },
  waveContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.33, // Ligeramente más arriba que antes
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 2,
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
    height: SCREEN_HEIGHT * 0.4, // Aumentado ligeramente de 0.35 a 0.4
    backgroundColor: '#f8d7da', // Light pink for the bottom
  },
});

export default AnimatedBackground;
