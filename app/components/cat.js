import React, { useState, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";

// Using forwardRef to properly handle refs
const CatAnimation = React.forwardRef((props, ref) => {
  // Animation values
  const blinkAnim = useState(new Animated.Value(1))[0];
  const tailAnim = useState(new Animated.Value(0))[0];
  const stretchAnim = useState(new Animated.Value(0))[0];
  
  // Control which animation is currently playing
  const [currentAnimation, setCurrentAnimation] = useState('idle');

  useEffect(() => {
    // Start animation sequence
    const animationLoop = () => {
      // Random animation selection
      const randomAnimation = Math.floor(Math.random() * 4);
      
      switch(randomAnimation) {
        case 0:
          // Blink animation
          setCurrentAnimation('blink');
          Animated.sequence([
            Animated.timing(blinkAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(blinkAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            })
          ]).start(() => {
            setCurrentAnimation('idle');
            setTimeout(animationLoop, 2000 + Math.random() * 3000);
          });
          break;
        
        case 1:
          // Tail wag animation
          setCurrentAnimation('tail');
          Animated.sequence([
            Animated.timing(tailAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(tailAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(tailAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(tailAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            })
          ]).start(() => {
            setCurrentAnimation('idle');
            setTimeout(animationLoop, 2000 + Math.random() * 3000);
          });
          break;
          
        case 2:
          // Stretch animation
          setCurrentAnimation('stretch');
          Animated.sequence([
            Animated.timing(stretchAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(stretchAnim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            })
          ]).start(() => {
            setCurrentAnimation('idle');
            setTimeout(animationLoop, 2000 + Math.random() * 3000);
          });
          break;
          
        default:
          // Just wait in idle state
          setTimeout(animationLoop, 2000 + Math.random() * 1000);
          break;
      }
    };
    
    // Start the animation sequence
    animationLoop();
    
    return () => {
      // Cleanup animations if needed
      blinkAnim.setValue(1);
      tailAnim.setValue(0);
      stretchAnim.setValue(0);
    };
  }, []);
  
  // Calculate transforms for the animations
  const tailTransform = tailAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg']
  });
  
  const stretchScale = stretchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2]
  });

  return (
    <View style={[styles.container, props.style]} ref={ref}>
      {/* Cat body */}
      <Animated.View 
        style={[
          styles.body,
          { transform: [{ scale: stretchAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.1]
          }) }] }
        ]}
      >
        {/* Cat head */}
        <View style={styles.head}>
          {/* Cat ears */}
          <View style={[styles.ear, styles.leftEar]} />
          <View style={[styles.ear, styles.rightEar]} />
          
          {/* Cat eyes */}
          <View style={styles.eyes}>
            <Animated.View style={[styles.eye, { opacity: blinkAnim }]} />
            <Animated.View style={[styles.eye, { opacity: blinkAnim }]} />
          </View>
          
          {/* Cat nose */}
          <View style={styles.nose} />
          
          {/* Cat mouth */}
          <View style={styles.mouth} />
        </View>
        
        {/* Cat paws */}
        <View style={styles.paws}>
          <View style={styles.paw} />
          <View style={styles.paw} />
        </View>
      </Animated.View>
      
      {/* Cat tail */}
      <Animated.View 
        style={[
          styles.tail,
          { transform: [{ rotate: tailTransform }] }
        ]} 
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    width: 50,
    height: 40,
    backgroundColor: "#F0A868",
    borderRadius: 20,
    position: "relative",
  },
  head: {
    width: 38,
    height: 38,
    backgroundColor: "#F0A868",
    borderRadius: 19,
    position: "absolute",
    top: -20,
    left: 6,
  },
  ear: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#F0A868",
    position: "absolute",
    top: -12,
  },
  leftEar: {
    left: 2,
    transform: [{ rotate: "-20deg" }],
  },
  rightEar: {
    right: 2,
    transform: [{ rotate: "20deg" }],
  },
  eyes: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    top: 12,
    width: "100%",
    paddingHorizontal: 8,
  },
  eye: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2E3A59",
  },
  nose: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#FF9AA2",
    position: "absolute",
    top: 20,
    left: 16.5,
  },
  mouth: {
    width: 8,
    height: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: "#2E3A59",
    opacity: 0.3,
    position: "absolute",
    top: 26,
    left: 15,
  },
  paws: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: -5,
    width: "100%",
    paddingHorizontal: 5,
  },
  paw: {
    width: 10,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#E69558",
  },
  tail: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F0A868",
    position: "absolute",
    right: 5,
    bottom: 25,
    transformOrigin: "left center",
  },
});

export default CatAnimation;