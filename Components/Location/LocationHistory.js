import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';


class LocationHistory extends React.Component{

    constructor(props){
        super(props);
        this.state = ({
            data: ''
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

            values.forEach(element => {
                valuesJSON = valuesJSON + element[1] + ",";
            });
            valuesJSON = valuesJSON.slice(0, -1) + "]"; //Removing the last ,
        } catch(e) {
            alert(e)
        }
        this.setState({
            data: valuesJSON
        })
        let test = JSON.parse(this.state.data)
        console.log(test[0].coords);
    }

    componentDidMount(){
        this._getPosHistory();
    }

    render(){
        return(
            <View style={styles.main_container}>
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
    }

});

export default LocationHistory;