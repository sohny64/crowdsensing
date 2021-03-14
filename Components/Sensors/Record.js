import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';

class Record extends React.Component{
    render(){
        const form = this.props.navigation.state.params.record;
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

export default Record;