import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import smartphoneSensorData from '../../Helpers/smartphoneSensorData'
import watchSensorData from '../../Helpers/watchSensorData'
import { CheckBox } from 'react-native-elements';


class Sensors extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            smartphoneData: smartphoneSensorData,
            watchData: watchSensorData,
            selectedSensors:[]
        }
    }


    onCheckedSmartphone(id){
        const data=this.state.smartphoneData
        const index=data.findIndex(x => x.id === id);
        data[index].checked = !data[index].checked
        this.setState(data)
    }

    onCheckedWatch(id){
        const data=this.state.watchData
        const index=data.findIndex(x => x.id === id);
        data[index].checked = !data[index].checked
        this.setState(data)
    }


    getSelectedSensors(){

    }

    renderSmartphoneSensors(){
            return(
                <FlatList
                    data={smartphoneSensorData}
                    keyExtractor= {(item) => item.id.toString()}
                    renderItem={({item}) => <CheckBox containerStyle ={styles.checkbox} textStyle={styles.textCheckBox}
                    title={item.name}
                    checked={item.checked}
                    onPress={()=>this.onCheckedSmartphone(item.id)}  
                    />}
                />
            )
    }

    renderWatchSensors(){
        return(
            <FlatList
                data={watchSensorData}
                keyExtractor= {(item) => item.id.toString()}
                renderItem={({item}) => <CheckBox containerStyle ={styles.checkbox} textStyle={styles.textCheckBox}
                title={item.name}
                checked={item.checked}
                onPress={()=>this.onCheckedWatch(item.id)}  
                />}
            />
        )
}



    render(){
        return(
            <View style={styles.main_container}>
                <View style={styles.description_container}>
                    <Text style={styles.subhead}>Phone Sensors :</Text>
                    {this.renderSmartphoneSensors()}
                </View>
                <View style={styles.description_container}>
                    <Text style={styles.subhead}>Watch Sensors :</Text>
                    {this.renderWatchSensors()}
                </View>
                <TouchableOpacity style={styles.button} >
                        <Text style={styles.text_button}>START</Text>
                </TouchableOpacity>
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


export default Sensors;