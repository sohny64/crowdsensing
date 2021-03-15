import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import smartphoneSensorData from '../../Helpers/smartphoneSensorData'
import watchSensorData from '../../Helpers/watchSensorData'
import { CheckBox } from 'react-native-elements';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';


class Sensors extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            smartphoneData: smartphoneSensorData,
            watchData: watchSensorData,
            selectedSensors:[],
            permissionsNeeded:[],
        }
    }


    onCheckedSmartphone(id){
        const data=this.state.smartphoneData
        const index=data.findIndex(x => x.id === id)
        data[index].checked = !data[index].checked
        if (data[index].checked==true){
            this.state.selectedSensors.push(data[index].name)
            if(!this.state.permissionsNeeded.includes(data[index].permissions)){
                this.state.permissionsNeeded.push(data[index].permissions)
            }
        }
        else{
            this.state.selectedSensors.splice(data[index].name, 1)
            this.state.permissionsNeeded.splice(data[index].permissions, 1)
            
        }
        this.setState(data)
    }

    onCheckedWatch(id){
        const data=this.state.watchData
        const index=data.findIndex(x => x.id === id)
        data[index].checked = !data[index].checked
        if (data[index].checked==true){
            this.state.selectedSensors.push(data[index].name)
            if(!this.state.permissionsNeeded.includes(data[index].permissions)){
                this.state.permissionsNeeded.push(data[index].permissions)
            }
        }
        else{
            this.state.selectedSensors.splice(data[index].name, 1)
            this.state.permissionsNeeded.splice(data[index].permissions, 1)
        }
        this.setState(data)

    }

    getSelectedSensors(){
        console.log(this.state.selectedSensors)
    }

    getPermissionsNeeded(){
        console.log(this.state.permissionsNeeded)
    }

    _displayRecord = () => {
            this.props.navigation.navigate("Record", { 
                                            selectedSensors: this.state.selectedSensors,
                                            permissionsNeeded: this.state.permissionsNeeded 
                                          });
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
                <View style={styles.button_container}>
                <TouchableOpacity style={styles.button} onPress={() => this._displayRecord()}>
                        <Text style={styles.text_button}>Sart recording</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                        style={styles.button_history}
                    >
                        <Image
                            source={require('../../Images/book.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
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
            margin: 10,
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
            alignItems: 'center',
            alignSelf: 'center',
            width: '60%',
            marginLeft:80
        },
        text_button:{
            color: '#ffffff',
            fontSize: 20
    },
    button_history: {
        marginLeft: 20,
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 100,
    },

    icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        alignItems: 'center',
    }
});


export default Sensors;