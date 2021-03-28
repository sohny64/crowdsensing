import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gyroscope } from 'expo-sensors';

export default class gyroscope extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      z: 0,
    };
  }

  _slow(){
    Accelerometer.setUpdateInterval(500);
  };

  _fast (){
    Accelerometer.setUpdateInterval(50);
  };

  componentDidMount() {
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  _subscribe = () => {
    this._subscription = Gyroscope.addListener(gyroscopeData => {
      this.setState({
        x: Object.values(gyroscopeData)[2],
        y: Object.values(gyroscopeData)[1],
        z: Object.values(gyroscopeData)[0],
      });
    });
  }


  render() {
    return(
    <View style={styles.container}>
      <Text style={styles.text}>
        x: {round(this.state.x)}{"\n"}
        y: {round(this.state.y)}{"\n"}
        z: {round(this.state.z)}
      </Text>
    </View>
  )}
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
        justifyContent: 'center',
        paddingHorizontal: 15,
      },
    
      text: {
        color: '#ffffff',
        fontSize: 14,
    },
});
