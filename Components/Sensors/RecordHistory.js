import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Share, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';

class RecordHistory extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            data: {},
            keys: [],
            recordedLocations: {},
            recordedKeys: {},
            selected:[]
        }
        
    }

    componentDidMount(){
        this._getSensorHistory();
        
    }

    _listEmptyComponent(){
        return (
            <View style={{alignItems: "center", margin: 100}}>
                <Text style={styles.text_emptyList}>
                    No record found
                </Text>
            </View>
        )
    }

    _getSensorHistory= async () => {
        //Fetch all keys
        let keys = []
        let keysRecorded = []
        let regex_Key = /^(sensorRecord_)/
        try {
            keys = await AsyncStorage.getAllKeys()
            keys.forEach(element => {

                if(!element.includes("undefined") && regex_Key.test(element)){
                    keysRecorded.push(element)
                }
                
            });

            keysRecorded.sort();
            keysRecorded.reverse();            
        } catch(e) {
            alert(e)
        }
        //Retrieve values
        let values;
        let valuesJSON = "[";
        try {
            values = await AsyncStorage.multiGet(keys)

            //Format values to respect JSON Format
            values.forEach(element => {
                valuesJSON = valuesJSON + element[1] + ",";
            });
            
            if(valuesJSON != '['){
                valuesJSON = valuesJSON.slice(0, -1) + "]"; //Removing the last ,
            }else{
                valuesJSON = valuesJSON + "]"; //empty array
            }

            valuesJSON = JSON.parse(valuesJSON);
            this.setState({
                data: valuesJSON,
                keys: keysRecorded
            })
            
        } catch(e) {
            alert(e)
        }

        let Temps = this.state.keys
        let FormatData=[]
        for(let i=0;i<Temps.length;i++){
            FormatData.push(
                {
                    id:i,
                    key:this.state.data[i].nameSave,
                    visible:false
                }
            )
        }
        this.setState({selected:FormatData})

    
    }

    _askToDelete(item){
        Alert.alert(
            "Warning!",
            "Are you sure you want to delete the location?",
            [
                {
                    text: "Cancel",
                    onPress: () => {
                        return false;
                    },
                },
                { 
                    text: "OK",
                    onPress: () => this._deleteRecord(item)
                }
            ]
        );
    }

    _deleteRecord = async (item) => {
        var regex;
        var key;
        regex = new RegExp(item.nameSave);
        key = this.state.keys.find(value => regex.test(value));
        console.log(this.state.keysRecorded)
        data = this.state.data;
        var index;
        for(var i=0 ; i<data.length ; i++){
            if(data[i].nameSave == item.nameSave){
                index = i;
            }
        }
        data.splice(index,1);
        this.setState({
            data: data,
        })    

        //Remove from storage
        try {
            await AsyncStorage.removeItem(key.toString())
        } catch(e) {
            return false;
        }
    }





 

    _renderTitle(){
        return(
            <Text style={styles.title}>
            Record informations
            </Text>
        )
    }

    _renderNameSave(record){
        return(
            <Text style={styles.subhead}>
                {record.item.nameSave} - {millisToMinutesAndSeconds(record.item.time)} min{"\n"}
            </Text>
        )
    }

    _renderAccelerometer(record){
        return (
            <View>
                <Text style={styles.text}>
                    Accelerometer: 
                </Text>
                <View style={styles.detail_sensor}>
                    <Text style={styles.text}>
                        x : {round(record.item.Accelerometer.x)}{"\n"}
                        y : {round(record.item.Accelerometer.y)}{"\n"}
                        z : {round(record.item.Accelerometer.z)}{"\n"}
                    </Text>
                </View>
            </View>
        )
    }

    _renderGyroscope(record){
        return (
            <View>
                <Text style={styles.text}>
                    Gyroscope: 
                </Text>
                <View style={styles.detail_sensor}>
                    <Text style={styles.text}>
                        x : {round(record.item.Gyroscope.x)}{"\n"}
                        y : {round(record.item.Gyroscope.y)}{"\n"}
                        z : {round(record.item.Gyroscope.z)}{"\n"}
                    </Text>
                </View>
            </View>
        )
    }

    _renderMagnetometer(record){
        return (
            <View>
                <Text style={styles.text}>
                    Magnetometer: 
                </Text>
                <View style={styles.detail_sensor}>
                    <Text style={styles.text}>
                        x : {round(record.item.Magnetometer.x)}{"\n"}
                        y : {round(record.item.Magnetometer.y)}{"\n"}
                        z : {round(record.item.Magnetometer.z)}{"\n"}
                    </Text>
                </View>
            </View>
        )
    }

    _renderBarometer(record){
        return (
            <View>
                <Text style={styles.text}>
                    Barometer: 
                </Text>
                <View style={styles.detail_sensor}>
                    <Text style={styles.text}>
                        pressure : {round(record.item.Barometer.pressure)} hPa{"\n"}
                        relativeAltitude : {round(record.item.Barometer.relativeAltitude)} m{"\n"}
                    </Text>
                </View>
            </View>
        )
    }

    _renderPedometer(record){
        return (
            <View>
                <Text style={styles.text}>
                    Pedometer: 
                </Text>
                <View style={styles.detail_sensor}>
                    <Text style={styles.text}>
                        Steps : {round(record.item.Pedometer.currrentStep)}{"\n"}
                    </Text>
                </View>
            </View>
        )
    }

    _renderAllDetail(record){
        return (
            <View>
                {this._renderAccelerometer(record)}
                {this._renderGyroscope(record)}
                {this._renderMagnetometer(record)}
                {this._renderBarometer(record)}
                {this._renderPedometer(record)}
                {this._renderDetailButtonUp(record)}
                {this._renderDeleteButton(record)}
            </View>
        )
    }

    _renderDetailButtonDown(record){
        return(
            <TouchableOpacity 
                style={styles.button_arrow}
                    onPress={() => record.visible = false}
            >
                <Image
                    source={require('../../Images/down.png')}
                    style={styles.icon_delete}
                />
            </TouchableOpacity>
        )
    }

    _renderDetailButtonUp(record){
        return(
            <TouchableOpacity 
                style={styles.button_arrow}
                    onPress={() => record.visible = false}
            >
                <Image
                    source={require('../../Images/up.png')}
                    style={styles.icon_delete}
                />
            </TouchableOpacity>
        )
    }

    _renderDeleteButton(record){
        return(
            <TouchableOpacity 
                style={styles.button_delete}
                    onPress={() => this._askToDelete(record.item)}
            >
                <Image
                    source={require('../../Images/delete_red.png')}
                    style={styles.icon_delete}
                />
            </TouchableOpacity>
        )
    }
               
    _renderListItem(){
        return(
            <FlatList 
                data={this.state.data}
                keyExtractor={(item) => item.nameSave.toString()}
                ListEmptyComponent={this._listEmptyComponent()}
                renderItem={(record =>
                    <View style={styles.description_container}>

                        {this._renderNameSave(record)}
                        {this._renderAllDetail(record)}
                    </View>
                )}
            />
        )
    }
    

    render(){
        return (
            <View style={styles.main_container}>
                {this._renderListItem()}
            </View>
        )
    }

}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function round(n) {
    if (!n) {
      return 0;
    }
    return Math.floor(n * 100) / 100;
  }

const styles = StyleSheet.create({
    main_container: {
        backgroundColor: '#331245',
        flex: 1,
    },

    buttons_container: {
        flexDirection: "row",
        width: '100%',
        flex:1,
    },

    detail_sensor:{
        marginLeft: 20
    },

    text: {
        color: '#ffffff',
        marginBottom: 5
    },

    text_emptyList: {
        color: '#ffffff',
        marginLeft: 10,
        marginTop: 10,
        fontSize:25
    },

    description_container: {
        backgroundColor: '#441d59',
        margin: 10,
        padding: 10,
    },

    button_container: {
        flexDirection: "row",
        backgroundColor: '#441d59',
        marginRight: 10,
        marginTop: 10,
        padding: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    button_share: {
        backgroundColor: '#441d59',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    button_delete: {
        backgroundColor: '#441d59',
        flex: 1,
    },

    button_arrow: {
        backgroundColor: '#441d59',
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    history_container: {
        flex: 2,
    },

    subhead: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginLeft: 10,
        marginTop: 10,
    },

    icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },

    icon_delete: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
    icon_delete: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
});

export default RecordHistory;