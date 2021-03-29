import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Barometer } from 'expo-sensors';

export default class barometer extends React.Component {

constructor(props) {
    super(props);
    this.state = {
      pressure:0,
      relativeAltitude:0
    }
  }

  componentDidMount() {
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }
  

  _subscribe = () => {
    this._subscription = Barometer.addListener(barometerData => {
      this.setState({
        pressure: Object.values(barometerData)[0],
        relativeAltitude: Object.values(barometerData)[1],
      });
    });
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  render (){
    return(
    <View style={styles.container}>
      <Text style={styles.text}>Pressure: {round(this.state.pressure * 100)} Pa {"\n"}
        Relative Altitude:{' '}
        {Platform.OS === 'ios' ? `${this.state.relativeAltitude} m` : `Only available on iOS`}
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
