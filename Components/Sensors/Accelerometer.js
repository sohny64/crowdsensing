import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';


export default function accelerometer() {
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);


  const _slow = () => {
    Accelerometer.setUpdateInterval(1000);
  };

  const _fast = () => {
    Accelerometer.setUpdateInterval(16);
  };

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        setData(accelerometerData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
        _subscribe();
    return () => 
      _unsubscribe();
  }, []);

  const { x, y, z } = data;

    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          x: {round(x)}{"\n"}
          y: {round(y)}{"\n"}
          z: {round(z)}
        </Text>
      </View>
    );
}

function round(n) {
    if (!n) {
      return 0;
    }
    return Math.floor(n * 100) / 100;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 15,
    },

    text: {
      color: '#ffffff',
      fontSize: 14,
  },
  });