import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';

class Record extends React.Component{





    renderSensor(){

    }



    render(){
        return(
            <View style={styles.main_container}>
                 <View style={styles.description_container}>
                    <Text style={styles.subhead}>Sensors selected :</Text>
                    {this.renderSensor()}
                </View>
            </View> 
        );
    };
}



const styles = StyleSheet.create({
    main_container: {
            backgroundColor: '#331245',
            flex: 1
        },
        subhead: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 5
        },
        description_container: {
            backgroundColor: '#441d59',
            borderRadius: 20,
            margin: 20,
            padding: 10
        },
        button_container:{
            flexDirection: "row",
            bottom: 20,
            right: 20,
            position: 'absolute',
            marginTop: 'auto',
        },
        checkbox: {
            marginLeft: 5,
            marginRight: 5,
            height: 50,
            backgroundColor: '#441d59',
            borderColor: '#441d59',
            borderWidth: 1,
            paddingLeft: 5,
            
        },
        textCheckBox: {
            color: '#ffffff'
        },
        button: {
            padding: 10,
            backgroundColor: '#862db3',
            borderRadius: 20,
            width: '70%',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 'auto',
            marginBottom: 40
        },
        text_button:{
        color: '#ffffff',
        fontSize: 20
    },
});


export default Record;

