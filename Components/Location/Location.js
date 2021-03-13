import React from 'react';
import { StyleSheet, View, Dimensions} from 'react-native';
import MapView from 'react-native-maps';

class Location extends React.Component{
    render(){
        return(
            <View style={styles.main_container}>
                <MapView style={styles.map} />
            </View>
            
        );
    };
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
});

export default Location;