import React from "react";
import { StyleSheet, View, Text } from 'react-native';
import { Barometer } from 'expo-sensors';


export default class ImagePicker extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            pressure:0,
            relativeAltitude:0, 
        }
    }

    //Montage du props
    componentDidMount(){
        this._subscribe()
    }

    //Démontage du props
    componentWillUnmount() {
        this._unsubscribe()
    }

    //Permet de lancer le baromètre
    _subscribe = () => {
        this._subscription = Barometer.addListener(barometerData => {
            this.setState({
                pressure: Object.values(barometerData)[0],
                relativeAltitude: Object.values(barometerData)[1],
            })
        }) 
    }

    //Permet d'arrêter le baromètre
    _unsubscribe = () => {
        this._subscription && this._subscription.remove();
        this._subscription = null;
    }

    //Affiche seulement la pression 
    _renderPressure (){
        return(
        <View style={styles.container_sensor}>
          <Text style={styles.text_sensor}>
                Pressure: {round(this.state.pressure * 100)} Pa {"\n"}
          </Text>
        </View>
        )
    }
    
    //Affiche seulement l'altitude
    _renderRelativeAltitude(){
        return(
            <View style={styles.container_sensor}>
                <Text style={styles.text_sensor}>
                    Relative Altitude:{' '}
                    {Platform.OS === 'ios' ? `${round(this.state.relativeAltitude)} m` : `Only available on iOS`}
                </Text>
            </View>
        )
    }

    //Afffiche la pression + l'altitude
    _renderAllTogether(){
        return(
            <View style={styles.container_sensor}>
                <Text style={styles.text_sensor}>
                    Pressure: {round(this.state.pressure * 100)} Pa {"\n"}
                    Relative Altitude:{' '}
                    {Platform.OS === 'ios' ? `${round(this.state.relativeAltitude)} m` : `Only available on iOS`}
                </Text>
            </View>
        )
    }

    render(){
        return(
            <View>
                <Text>Affichage de toutes les variables</Text>
                    {this._renderAllTogether()}
                <Text>Affichage de la relativeAltitude</Text>
                    {this._renderRelativeAltitude()}
                <Text>Affichage de la relativeAltitude</Text>
                    {this._renderPressure()}
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
    }
})