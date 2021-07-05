import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Share, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';


class LocationHistory extends React.Component{

    constructor(props){
        super(props);
        this.state = ({
            data: {},
            keys: [],
            recordedLocations: {},
            recordedKeys: {},
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
        let keysRecorded = []
        let regex_keyValidity = /^(location_)/
        let regex_recordKey = /^(locationRecord_)/
        try {
            keys = await AsyncStorage.getAllKeys()
            keys.forEach(element => {
                //Check key start by location and is defined
                if(!element.includes("undefined") && regex_keyValidity.test(element)){
                    validKeys.push(element)
                } else {
                    if(!element.includes("undefined") && regex_recordKey.test(element)){
                        keysRecorded.push(element)
                    }
                }
            });
            //Trie du plus récent au moins récent
            validKeys.sort();
            validKeys.reverse();

            keysRecorded.sort();
            keysRecorded.reverse();
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

            if(valuesJSON != '['){
                valuesJSON = valuesJSON.slice(0, -1) + "]"; //Removing the last ,
            }else{
                valuesJSON = valuesJSON + "]"; //empty array
            }

            valuesJSON = JSON.parse(valuesJSON);
        } catch(e) {
            alert(e)
        }
        this.setState({
            data: valuesJSON,
            keys: validKeys
        })

        //Retrieve values
        valuesJSON = "[";
        try {
            values = await AsyncStorage.multiGet(keysRecorded)

            //Format values to respect JSON Format
            values.forEach(element => {
                valuesJSON = valuesJSON + element[1] + ",";
            });

            if(valuesJSON != '['){
                valuesJSON = valuesJSON.slice(0, -1) + "]"; //Removing the last ,
            }else{
                valuesJSON = valuesJSON + "]"; //empty array
            }

            valuesJSON = JSON.parse(valuesJSON);

        } catch(e) {
            alert(e)
        }
        this.setState({
            recordedLocations: valuesJSON,
            recordedKeys: keysRecorded
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

    _askToDelete(item,isARecord){
        Alert.alert(
            "Warning!",
            "Are you sure you want to delete the location?",
            [
                {
                    text: "Cancel",
                    onPress: () => {
                        return false;
                    },
                },
                {
                    text: "OK",
                    onPress: () => this._deleteLocation(item,isARecord)
                }
            ]
        );
    }

    _deleteLocation = async (item, isARecord) => {
        var regex;
        var key;
        if(isARecord){
            regex = new RegExp(item[0][1].timestamp);
            key = this.state.recordedKeys.find(value => regex.test(value));

            var recordedLocations = this.state.recordedLocations;
            var index;
            for(var i=0 ; i<recordedLocations.length ; i++){
                if(recordedLocations[i][0][1].timestamp == item[0][1].timestamp){
                    index = i;
                }
            }
            recordedLocations.splice(index,1);
            this.setState({
                recordedLocations: recordedLocations,
            })
        }
        else{
            regex = new RegExp(item.timestamp);
            key = this.state.keys.find(value => regex.test(value));
            data = this.state.data;
            var index;
            for(var i=0 ; i<data.length ; i++){
                if(data[i].timestamp == item.timestamp){
                    index = i;
                }
            }
            data.splice(index,1);
            this.setState({
                data: data,
            })
        }

        //Remove from storage
        try {
            await AsyncStorage.removeItem(key)
        } catch(e) {
            return false;
        }
    }

    _listEmptyComponent(){
        return (
            <Text style={styles.text_emptyList}>
                No location found in this category
            </Text>
        )
    }

    render(){
        return(
            <View style={styles.main_container}>
                <View style={{flex:2}}>
                <Text style={styles.title}>
                    Unique locations
                </Text>
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item) => item.timestamp.toString()}
                    ListEmptyComponent={this._listEmptyComponent()}
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
                            <View style={styles.button_container}>
                                <TouchableOpacity
                                    style={styles.button_share}
                                    onPress={() => this._onShare(location.item)}
                                >
                                    <Image
                                        source={require('../../Images/share.png')}
                                        style={styles.icon}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.button_delete}
                                    onPress={() => this._askToDelete(location.item,false)}
                                >
                                    <Image
                                        source={require('../../Images/delete_red.png')}
                                        style={styles.icon_delete}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
                </View>
                <View
                    style={{
                        borderBottomColor: '#000',
                        borderBottomWidth: 3,
                        marginTop: 20,
                    }}
                />
                <View style={{flex:1}}>
                <Text style={styles.title}>
                    Sets of locations
                </Text>
                <FlatList
                    data={this.state.recordedLocations}
                    keyExtractor={(item) => item[0][1].timestamp.toString()}
                    ListEmptyComponent={this._listEmptyComponent()}
                    renderItem={(locationRecord =>
                        <View style={styles.buttons_container}>
                            <TouchableOpacity
                                style={styles.history_container}
                            >
                                <View style={styles.description_container}>
                                    <Text style={styles.subhead}>
                                        Date recorded
                                    </Text>
                                    <Text style={styles.text}>
                                        {this._getDate(locationRecord.item[0][1].timestamp)}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <View style={styles.button_container}>
                                <TouchableOpacity
                                    style={styles.button_share}
                                    onPress={() => this._onShare(locationRecord.item)}
                                >
                                    <Image
                                        source={require('../../Images/share.png')}
                                        style={styles.icon}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.button_delete}
                                    onPress={() => this._askToDelete(locationRecord.item,true)}
                                >
                                    <Image
                                        source={require('../../Images/delete_red.png')}
                                        style={styles.icon_delete}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
                </View>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    main_container: {
        backgroundColor: '#c19000',
        flex: 1,
    },

    buttons_container: {
        flexDirection: "row",
        width: '100%',
        flex:1,
    },

    text: {
        color: '#b4b4b4',
        marginBottom: 5
    },

    text_emptyList: {
        color: '#000',
        marginLeft: 10,
        marginTop: 10,
    },

    description_container: {
        backgroundColor: '#7d5e11',
        marginLeft: 10,
        marginTop: 10,
        padding: 10,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10
    },

    button_container: {
        flexDirection: "row",
        backgroundColor: '#7d5e11',
        marginRight: 10,
        marginTop: 10,
        padding: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10
    },

    button_share: {
        backgroundColor: '#7d5e11',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    button_delete: {
        backgroundColor: '#7d5e11',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    history_container: {
        flex: 2,
    },

    subhead: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 10,
        marginTop: 10,
    },

    icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },

    icon_delete: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
});

export default LocationHistory;
