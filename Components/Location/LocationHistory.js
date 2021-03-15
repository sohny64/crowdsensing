import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';


class LocationHistory extends React.Component{

    constructor(props){
        super(props);
        this.state = ({
            data: {
                "mocked": false,
                "timestamp": 1615841063167
            }
        })
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
                if(!element.includes("undefined") || !regex_keyValidity.test(element)){
                    validKeys.push(element)
                }
            });
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

    render(){
        return(
            <View style={styles.main_container}>
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item) => item.timestamp.toString()}
                    renderItem={(location =>
                        <TouchableOpacity>
                            <View style={styles.description_container}>
                                <Text style={styles.subhead}>
                                    Date recorded
                                </Text>
                                <Text style={styles.text}>
                                    {this._getDate(location.item.timestamp)}
                                </Text>
                            </View>
                        </TouchableOpacity>
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

    text: {
        color: '#ffffff'
    },

    description_container: {
        backgroundColor: '#441d59',
        borderRadius: 20,
        margin: 10,
        padding: 10
    },
    subhead: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 5
    },
});

export default LocationHistory;