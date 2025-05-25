import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated
} from 'react-native';

const SmartwatchInterface = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [heartRate, setHeartRate] = useState(null);
  const [stressLevel, setStressLevel] = useState('Normal');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [pulseAnimation] = useState(new Animated.Value(1));
  const [deviceName, setDeviceName] = useState('');

  // Simulate heart rate data when connected
  useEffect(() => {
    let interval;
    if (isConnected) {
      interval = setInterval(() => {
        // Simulate realistic heart rate between 60-100 BPM
        const newHeartRate = Math.floor(Math.random() * 40) + 60;
        setHeartRate(newHeartRate);
        setLastUpdated(new Date().toLocaleTimeString());
        
        // Determine stress level based on heart rate
        if (newHeartRate < 70) {
          setStressLevel('Low');
        } else if (newHeartRate < 85) {
          setStressLevel('Normal');
        } else if (newHeartRate < 95) {
          setStressLevel('Elevated');
        } else {
          setStressLevel('High');
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  // Heart pulse animation
  useEffect(() => {
    if (isConnected && heartRate) {
      const animate = () => {
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.2,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setTimeout(animate, 60000 / (heartRate || 75)); // Match heart rate
        });
      };
      animate();
    }
  }, [heartRate, isConnected, pulseAnimation]);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      setDeviceName('Apple Watch Series 8');
      Alert.alert(
        'Connected Successfully',
        'Your smartwatch is now connected and monitoring your heart rate.',
        [{ text: 'OK' }]
      );
    }, 2000);
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Device',
      'Are you sure you want to disconnect your smartwatch?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            setIsConnected(false);
            setHeartRate(null);
            setStressLevel('Normal');
            setLastUpdated(null);
            setDeviceName('');
          }
        }
      ]
    );
  };

  const getStressColor = (level) => {
    switch (level) {
      case 'Low': return '#10B981';
      case 'Normal': return '#3B82F6';
      case 'Elevated': return '#F59E0B';
      case 'High': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getHeartRateStatus = (hr) => {
    if (!hr) return 'normal';
    if (hr < 70) return 'low';
    if (hr < 85) return 'normal';
    if (hr < 95) return 'elevated';
    return 'high';
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Connection Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: isConnected ? '#10B981' : '#6B7280' }
          ]} />
          <Text style={styles.statusTitle}>
            {isConnected ? 'Connected' : 'Not Connected'}
          </Text>
        </View>
        
        {deviceName ? (
          <Text style={styles.deviceName}>{deviceName}</Text>
        ) : (
          <Text style={styles.deviceName}>No device connected</Text>
        )}

        {!isConnected ? (
          <TouchableOpacity 
            style={styles.connectButton}
            onPress={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.connectButtonText}>Connect Smartwatch</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.disconnectButton}
            onPress={handleDisconnect}
          >
            <Text style={styles.disconnectButtonText}>Disconnect</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Heart Rate Monitor */}
      {isConnected && (
        <View style={styles.monitorCard}>
          <Text style={styles.cardTitle}>Heart Rate Monitor</Text>
          
          <View style={styles.heartRateContainer}>
            <Animated.View style={[
              styles.heartIcon,
              { transform: [{ scale: pulseAnimation }] }
            ]}>
              <Text style={styles.heartEmoji}>❤️</Text>
            </Animated.View>
            
            <View style={styles.heartRateData}>
              {heartRate ? (
                <>
                  <Text style={styles.heartRateValue}>{heartRate}</Text>
                  <Text style={styles.heartRateUnit}>BPM</Text>
                </>
              ) : (
                <Text style={styles.loadingText}>Reading...</Text>
              )}
            </View>
          </View>

          {lastUpdated && (
            <Text style={styles.lastUpdated}>
              Last updated: {lastUpdated}
            </Text>
          )}
        </View>
      )}

      {/* Stress Level Indicator */}
      {isConnected && heartRate && (
        <View style={styles.stressCard}>
          <Text style={styles.cardTitle}>Stress Level</Text>
          
          <View style={styles.stressIndicator}>
            <View style={[
              styles.stressCircle,
              { backgroundColor: getStressColor(stressLevel) }
            ]}>
              <Text style={styles.stressLevel}>{stressLevel}</Text>
            </View>
          </View>

          <View style={styles.stressScale}>
            <View style={styles.scaleItem}>
              <View style={[styles.scaleDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.scaleLabel}>Low</Text>
            </View>
            <View style={styles.scaleItem}>
              <View style={[styles.scaleDot, { backgroundColor: '#3B82F6' }]} />
              <Text style={styles.scaleLabel}>Normal</Text>
            </View>
            <View style={styles.scaleItem}>
              <View style={[styles.scaleDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.scaleLabel}>Elevated</Text>
            </View>
            <View style={styles.scaleItem}>
              <View style={[styles.scaleDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.scaleLabel}>High</Text>
            </View>
          </View>

          {stressLevel === 'High' && (
            <View style={styles.alertBox}>
              <Text style={styles.alertText}>
                High stress detected. Consider taking a break or trying breathing exercises.
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Tips Section */}
      <View style={styles.tipsCard}>
        <Text style={styles.cardTitle}>Monitoring Tips</Text>
        
        <View style={styles.tipsList}>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>
              Keep your smartwatch snug but comfortable for accurate readings
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>
              Heart rate data updates every few seconds when connected
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>
              Stress levels are calculated based on heart rate variability
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>
              Use this data alongside your therapy sessions for better insights
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A59',
  },
  deviceName: {
    fontSize: 14,
    color: '#5D6B98',
    marginBottom: 16,
  },
  connectButton: {
    backgroundColor: '#2E3A59',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  disconnectButton: {
    backgroundColor: '#F7F9FC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4E9F2',
  },
  disconnectButtonText: {
    color: '#5D6B98',
    fontWeight: '500',
    fontSize: 16,
  },
  monitorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 16,
  },
  heartRateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heartIcon: {
    marginRight: 16,
  },
  heartEmoji: {
    fontSize: 32,
  },
  heartRateData: {
    alignItems: 'center',
  },
  heartRateValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#2E3A59',
  },
  heartRateUnit: {
    fontSize: 16,
    color: '#5D6B98',
    fontWeight: '500',
  },
  loadingText: {
    fontSize: 18,
    color: '#5D6B98',
    fontStyle: 'italic',
  },
  lastUpdated: {
    textAlign: 'center',
    fontSize: 12,
    color: '#A0A9C0',
  },
  stressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stressIndicator: {
    alignItems: 'center',
    marginBottom: 20,
  },
  stressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stressLevel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stressScale: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  scaleItem: {
    alignItems: 'center',
  },
  scaleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  scaleLabel: {
    fontSize: 12,
    color: '#5D6B98',
  },
  alertBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  alertText: {
    color: '#DC2626',
    fontSize: 14,
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2E3A59',
  },
  tipsList: {
    marginTop: 8,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  tipBullet: {
    color: '#2E3A59',
    fontWeight: '600',
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#5D6B98',
    lineHeight: 20,
  },
});

export default SmartwatchInterface;