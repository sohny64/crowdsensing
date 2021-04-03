import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Share, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';


class LocationHistory extends React.Component{

    constructor(props){
        super(props);
        this.state = ({
            data: {}
        })
    }

    _onShare = async (latitude) => {
        try {
          const result = await Share.share({
            message:
                JSON.stringify(latitude),
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
    }

    _getPosHistory= async () => {
        //Fetch all keys
        let keys = []
        let validKeys = []
        let regex_keyValidity = /^(location_)/
        try {
            keys = await AsyncStorage.getAllKeys()
            keys.forEach(element => {
                //Check key start by location and is defined
                if(!element.includes("undefined") && regex_keyValidity.test(element)){
                    validKeys.push(element)
                }
            });

            if(validKeys.length <= 0){
                return;
            }
            
            //Trie du plus récent au moins récent
            validKeys.sort();
            validKeys.reverse();
        } catch(e) {
            alert(e)
        }

        //Retrieve values
        let values;
        let valuesJSON = "[";
        try {
            values = await AsyncStorage.multiGet(validKeys)

            //Format values to respect JSON Format
            values.forEach(element => {
                valuesJSON = valuesJSON + element[1] + ",";
            });
            valuesJSON = valuesJSON.slice(0, -1) + "]"; //Removing the last ,
            valuesJSON = JSON.parse(valuesJSON);
        } catch(e) {
            alert(e)
        }
        this.setState({
            data: valuesJSON
        })
    }

    componentDidMount(){
        this._getPosHistory();
    }

    _getDate(timestamp){
        return moment(timestamp).format('MMMM Do YYYY, h:mm:ss a');
    }

    _returnToMapWithLocation = (latitude, longitude, timestamp) => {
        this.props.navigation.state.params.returnData(latitude, 
                                                      longitude,
                                                      timestamp);
        this.props.navigation.goBack(null);
    }

    render(){
        return(
            <View style={styles.main_container}>
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item) => item.timestamp.toString()}
                    renderItem={(location =>
                        <View style={styles.buttons_container}>
                            <TouchableOpacity 
                                style={styles.history_container}
                                onPress={() => this._returnToMapWithLocation(location.item.coords.latitude,
                                                                            location.item.coords.longitude,
                                                                            location.item.timestamp)}>

                                <View style={styles.description_container}>
                                    <Text style={styles.subhead}>
                                        Date recorded
                                    </Text>
                                    <Text style={styles.text}>
                                        {this._getDate(location.item.timestamp)}
                                    </Text>
                                    <Text style={styles.subhead}>
                                        GPS location
                                    </Text>
                                    <Text style={styles.text}>
                                        Latitude: {location.item.coords.latitude}{"\n"}
                                        Longitude: {location.item.coords.longitude}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.button_history}
                                onPress={() => this._onShare(location.item)}
                            >
                                <Image
                                    source={require('../../Images/share.png')}
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View> 
        );
    };
}

const styles = StyleSheet.create({
    main_container: {
        backgroundColor: '#331245',
        flex: 1,
    },

    buttons_container: {
        flexDirection: "row",
        width: '100%',
        flex:1,
    },

    text: {
        color: '#ffffff',
        marginBottom: 5
    },

    description_container: {
        backgroundColor: '#441d59',
        marginLeft: 10,
        marginTop: 10,
        padding: 10,
    },

    button_history: {
        backgroundColor: '#441d59',
        marginRight: 10,
        marginTop: 10,
        padding: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    history_container: {
        flex: 3,
    },

    subhead: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },

    icon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
});

export default LocationHistory;