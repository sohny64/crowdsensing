import React from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text, Image} from 'react-native';
import MapView, { Callout } from 'react-native-maps';
import moment from 'moment';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-easy-toast'

class UserLocation extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            //Default location is Anglet
            region: {
                latitude: 43.47784863069389,
                longitude: -1.5082811718614655,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            },
            currentLocation: {},
            errorMessage: '',
            msg: '',
            mapMarkers: [],
            recordedLocations: [],
            recordedLocationsTimestamp: 0,
            isRecording: false,
            recordButtonImage: require('../../Images/circle.png'),
            interval: 0,
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
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }
        })
    }

    async _recordLocation() {
        if(this.state.isRecording){
            //Stop recording location
            clearInterval(this.state.interval);

            if(this.state.recordedLocations.length > 0){
                await this._storeRecord();
            }            
            this.setState({
                recordedLocationsTimestamp: 0,
                isRecording: false,
                recordButtonImage: require('../../Images/circle.png'),
            })
        } else {
            this.setState({
                isRecording: true,
                recordedLocations: [],
            })            

            await this._recordLocationInterval();
            this.state.interval = setInterval(() => {
                this._recordLocationInterval();
            }, 5000);
            this.state.recordButtonImage = require('../../Images/square.png');
        }
    }

     _recordLocationInterval = async () =>{
        var currentLocation = await Location.getCurrentPositionAsync();

        if(this.state.recordedLocationsTimestamp == 0){
            this.state.recordedLocationsTimestamp = currentLocation.timestamp
        }

        locationJSON = ["location_" + JSON.stringify(currentLocation.timestamp),currentLocation];
        
        this.state.recordedLocations.push(locationJSON);
        this.setState({
            recordedLocations: this.state.recordedLocations,
        });
    }

    async _storeRecord(){
        try {
            let key = "locationRecord_" + JSON.stringify(this.state.recordedLocationsTimestamp);
            let value = JSON.stringify(this.state.recordedLocations);
            await AsyncStorage.setItem(key, value);
            this.toast.show('Location saved !');
        } catch (e) {
          alert(e)
        }  
    }

    _storeData = async () => {
        try {
            await this._getLocation();
            let key = "location_" + JSON.stringify(this.state.currentLocation.timestamp);
            let value = JSON.stringify(this.state.currentLocation);
            await AsyncStorage.setItem(key, value);
            this.toast.show('Record saved !');
        } catch (e) {
          alert(e)
        }  
    }

    _getDate(timestamp){
        return moment(timestamp).format('MMMM Do YYYY, h:mm:ss a');
    }

    returnData(latitude, longitude, date) {
        var coordinate = {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            date: date,
        }
        this.state.mapMarkers.push(coordinate);
        this.setState({
            mapMarkers: this.state.mapMarkers
        }); 
    }

    _displayHistory = () => {
        this.props.navigation.navigate("LocationHistory",{returnData: this.returnData.bind(this)});
    }

    _resetMarkers(){
        this.setState({
            mapMarkers: []
        })
    }
    
    render(){
        /*let Arr = this.state.mapMarkers.map((a, i) => {
            return <Text>{a.latitude}</Text>
        }) */ 
        return(
            <View style={styles.main_container}>
                <MapView
                    style={styles.map} 
                    region={this.state.region}
                    showsUserLocation={true}
                    followsUserLocation={true}
                >
                {this.state.mapMarkers.map((marker,i) =>
                    <MapView.Marker
                        key = {i}
                        coordinate={{
                            latitude: marker.latitude, 
                            longitude: marker.longitude,
                        }}
                        image={require('../../Images/pin.png')}
                    >
                    <Callout>
                        <View>
                            <Text>
                                <Text style={{fontWeight: "bold"}}>Date:</Text> {this._getDate(marker.date)}{"\n"}
                                <Text style={{fontWeight: "bold"}}>Latitude:</Text> {marker.latitude}{"\n"}
                                <Text style={{fontWeight: "bold"}}>Longitude:</Text> {marker.longitude}
                            </Text>
                        </View>
                    </Callout>
                    </MapView.Marker>
                )}
                 
                </MapView>
                
                
                <View style={styles.button_container}>
                    <View style={styles.button_history_container}>
                        <TouchableOpacity 
                            style={styles.button_record}
                            onPress={() => this._recordLocation()}
                        >
                            <Image
                                source={this.state.recordButtonImage}
                                style={styles.icon}
                            />
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
                    
                    <TouchableOpacity 
                        style={styles.button_save}
                        onPress={ () => this._storeData()}
                    >
                        <Text style={styles.text_button}>Save position</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.button_trash}
                        onPress={() => this._resetMarkers()}
                    >
                        <Image
                            source={require('../../Images/delete.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
                <Toast ref={(toast) => this.toast = toast} position='center'/>                
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
        position: 'absolute',
        justifyContent: 'space-between',
        marginTop: 'auto',
        width: '100%',
    },

    button_history_container:{
        flexDirection: "row",
        marginStart: 10
    },

    map: {
        width: (Dimensions.get('window').width),
        height: (Dimensions.get('window').height),
        marginBottom: 0
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
        width: '40%',
        marginRight: 10,
        marginLeft: 10,
    },

    button_history: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 100,
    },

    button_trash: {
        padding: 10,
        backgroundColor: '#cc0000',
        borderRadius: 100,
        marginRight: 10
    },

    button_record: {
        padding: 10,
        backgroundColor: '#cc0000',
        borderRadius: 100,
        marginRight: 3
    },

    icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        alignItems: 'center',
    },
});

export default UserLocation;