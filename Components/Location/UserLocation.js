import React from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text, Image, ToastAndroid} from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UserLocation extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            //Default location is Anglet
            region: {
                latitude: 43.47784863069389,
                longitude: -1.5082811718614655,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            },
            currentLocation: {},
            errorMessage: '',
            msg: ''
        }
    }

    _getLocation = async () => {
        const {status} = await Permissions.askAsync(Permissions.LOCATION);
        if(status != 'granted'){
            console.log('PERMISSION NOT GRANTED');
            this.setState({
                errorMessage: 'PERMISSION NOT GRANTED'
            })
        }
        const userLocation = await Location.getCurrentPositionAsync();

        this.setState({
            currentLocation: userLocation,
            region: {
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            }
        })
    }

    _storeData = async () => {
        try {
            await this._getLocation();
            let key = "location_" + JSON.stringify(this.state.currentLocation.timestamp);
            let value = JSON.stringify(this.state.currentLocation);
            await AsyncStorage.setItem(key, value);
            ToastAndroid.show("Enregistré !",ToastAndroid.SHORT);
        } catch (e) {
          alert(e)
        }
    }

    _getData = async () => {
        try {
          const value = await AsyncStorage.getItem('pos')
          if(value !== null) {
            this.setState({
                msg: value
            })
          }
        } catch(e) {
          alert(e)
        }
    }

    _displayHistory = () => {
        this.props.navigation.navigate("LocationHistory");
    }
    
    render(){
        return(
            <View style={styles.main_container}>
                <MapView 
                    style={styles.map} 
                    region={this.state.region}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    showsCompass={true}
                />
                <View style={styles.button_container}>
                    
                    <TouchableOpacity 
                        style={styles.button_save}
                        onPress={() => this._storeData()}
                    >
                        <Text style={styles.text_button}>Save position</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.button_history}
                        onPress={() => this._displayHistory()}
                    >
                        <Image
                            source={require('../../Images/book.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            
        );
    };
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    button_container:{
        flexDirection: "row",
        bottom: 20,
        right: 20,
        position: 'absolute',
        marginTop: 'auto',
    },

    map: {
        width: (Dimensions.get('window').width),
        height: (Dimensions.get('window').height),
      },
    
    text_button:{
        color: '#ffffff',
        fontSize: 20
    },
    button_save: {
        padding: 10,
        backgroundColor: '#862db3',
        borderRadius: 20,
        alignItems: 'center',
        alignSelf: 'center',
        flexWrap: "wrap",
        marginRight: 10
    },

    button_history: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 100,
    },

    icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        alignItems: 'center',
    }
});

export default UserLocation;