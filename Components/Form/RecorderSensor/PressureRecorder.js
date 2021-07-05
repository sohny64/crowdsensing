import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Barometer } from 'expo-sensors';


export default class PressureRecorder extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            pressure: null,
        }

    }

    _subscription = null

    //Dismounting the props
    componentWillUnmount(){
        this._unsubscribe()
    }

    //Stop barometer
    _unsubscribe = () => {
        this._subscription && this._subscription.remove();
        this._subscription = null;
    }

    _getPressure = () => {
        const getAnswer = this.props.getAnswer; //Function to send record to the form

        //Start barometer
        this._subscription = Barometer.addListener(barometerData => {
            this.setState({
                pressure: round(Object.values(barometerData)[0] * 100),
            })
            getAnswer(round(Object.values(barometerData)[0] * 100), this.props.question);
        });
        //Stop barometer after it get pressure value
        setTimeout(() => {  this._unsubscribe(); }, 2000);
    }

    render(){
        return(
        <View style={styles.container_sensor}>
          <Text style={styles.text_sensor}>
                Pressure: {this.state.pressure ? this.state.pressure + " Pa" : "none"}
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => this._getPressure()}>
                    <Text style={styles.text}>Get pressure</Text>
            </TouchableOpacity>
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

    container_sensor: {
        paddingHorizontal: 15,
    },

    text_sensor: {
        color: '#ffffff',
        fontSize: 14,
    },
    button: {
        padding: 10,
        backgroundColor: '#2c3a4e',
        borderRadius: 20,
        alignItems: 'center',
        alignSelf: 'center',
        width: '60%',
        marginTop: 20,
        marginBottom: 20
    },
    text: {
        color: '#ffffff'
    }
})
