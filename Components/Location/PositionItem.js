import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

class PositionItem extends React.Component {
    render(){
        return(
            <TouchableOpacity>
                <View>
                    <Text style={styles.text}>Test</Text>
                </View>
            </TouchableOpacity>
        )
    }
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

export default PositionItem