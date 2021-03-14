import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
        try {
            keys = await AsyncStorage.getAllKeys()
        } catch(e) {
            alert(e)
        }

        //Retrieve values
        let values
        try {
            values = await AsyncStorage.multiGet(keys)
        } catch(e) {
            alert(e)
        }
        this.setState({
            data: values
        })
        console.log(JSON.stringify(values,null,2))
    }

    componentDidMount(){
        this._getPosHistory();
    }

    render(){
        return(
            <View style={styles.main_container}>
                <Text>{JSON.stringify(this.state.data,null,2)}</Text>
            </View> 
        );
    };
}

const styles = StyleSheet.create({
    main_container: {
    }
});

export default LocationHistory;