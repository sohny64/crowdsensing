import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';


export default class accelerometer extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      z: 0,
    };
  }

  _slow(){
    Accelerometer.setUpdateInterval(350);
  };

  _stop(){
    Accelerometer.setUpdateInterval(100000);
  };

  _fast (){
    Accelerometer.setUpdateInterval(50);
  };

  _subscribe = () => {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      this.setState({
        x: Object.values(accelerometerData)[2],
        y: Object.values(accelerometerData)[1],
        z: Object.values(accelerometerData)[0],
      });
    });
  }

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

   render(){
      return (
        <View style={styles.container}>
          <Text style={styles.text}>
            x: {round(this.state.x)}{"\n"}
            y: {round(this.state.y)}{"\n"}
            z: {round(this.state.z)}
          </Text>
        </View>
      )
    }
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
