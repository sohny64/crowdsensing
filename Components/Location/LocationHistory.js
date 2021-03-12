import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

class LocationHistory extends React.Component{
    render(){
        const form = this.props.navigation.state.params.form;
        return(
            <View style={styles.main_container}>

            </View> 
        );
    };
}

const styles = StyleSheet.create({
    main_container: {
    }
});

export default LocationHistory;