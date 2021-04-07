import React, {useRef} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Share, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';

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
            values = await AsyncStorage.multiGet(keysRecorded)

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
                    key:this.state.data[i].time,
                    visible:false,
                    visibleSetting:false
                }
            )
        }
        this.setState({selected:FormatData})
    }

    _askToDelete(item){
        Alert.alert(
            "Warning!",
            "Are you sure you want to delete the record?" ,
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

    _checkArray(record){
        this.state.selected.find((element) => {
            if (element.key == record.item.time){   
                if(element.visible == true ){  
                    let elementId = element.id
                    this.setState(prevState => ({
                        selected: prevState.selected.map(
                            el => el.id === elementId? { ...el, visible: false }: el
                        )
                    }))
                }
                else{
                    let elementId = element.id
                    this.setState(prevState => ({
                        selected: prevState.selected.map(
                            el => el.id === elementId? { ...el, visible: true }: el
                        )
                    }))
    
                }
            }
        })  
    }

    _onShare = async (item) => {
        try {
          const result = await Share.share({
            message:
                JSON.stringify(item),
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
    }

    _deleteRecord = async (item) => {
        var regex;
        var key;
        regex = new RegExp(item.time);
        key = this.state.keys.find(value => regex.test(value));
        data = this.state.data;
        var index;
        for(var i=0 ; i<data.length ; i++){
            if(data[i].time == item.time){
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

    _getDate(timestamp){
        return moment(timestamp).format('MMMM Do YYYY, h:mm:ss a');
    }

    _renderNameSave(record){
        return(
            <View style={styles.main_container}>
                    <View style={styles.buttons_container}>

                        <View style={styles.description_container2}>
                            <Text style={styles.subhead}>
                                {record.item.nameSave}
                            </Text>
                            <Text style={styles.text}>
                                {this._getDate(record.item.currentTime)}{"\n"}
                                {millisToMinutesAndSeconds(record.item.time)} min
                            </Text>
                        </View>
                        <View style={styles.buttons_container}>
                            {this._renderOnShare(record)}
                            {this._renderDeleteButton(record)}
                        </View>
                    </View>

            </View>
        )
    }

    _renderOnShare(record){
        return(
            <TouchableOpacity 
            style={styles.button_share}
            onPress={() => this._onShare(record.item)}
            >
                <Image
                    source={require('../../Images/share.png')}
                    style={styles.icon}
                />
            </TouchableOpacity>
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


    _renderAll(record){
        let affiche
        this.state.selected.find((element) => {
            if (element.key == record.item.time){
                if(element.visible){
                    affiche =   <View>
                                    {this._renderAccelerometer(record)}
                                    {this._renderGyroscope(record)}
                                    {this._renderMagnetometer(record)}
                                    {this._renderBarometer(record)}
                                    {this._renderPedometer(record)}
                                    {this._renderDetailButtonUp(record)}
                                </View>
                }else{
                    affiche =  <View>
                                    {this._renderDetailButtonDown(record)}
                                </View>
                }
            }
        })
        return( 
                <View>
                    {affiche}     
                </View>
            )            
              
    }

    _renderDetailButtonDown(record){
        return(
            <TouchableOpacity 
                style={styles.button_arrow}
                    onPress={() => this._checkArray(record)}
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
                    onPress={() => this._checkArray(record)}
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



    render(){

        return (
            <View style={styles.main_container}>
                                  <Text style={styles.title}>
                        Sensors saves{"\n"}
                    </Text>
                <FlatList 
                data={this.state.data}
                keyExtractor={(item) => item.time.toString()}
                ListEmptyComponent={this._listEmptyComponent()}
                extraData={this.state.selected}
                renderItem={(record =>


                    <View style={styles.description_container}>
                        
                        {this._renderNameSave(record)}
                        {this._renderAll(record)}

                    </View>
                )}
            />
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
        flex:1,
    },

    text: {
        color: '#ffffff',
        marginBottom: 5
    },

    detail_sensor: {
        color: '#ffffff',
        fontSize: 14,
        marginLeft:20
    },

    text_emptyList: {
        color: '#ffffff',
        marginLeft: 10,
        marginTop: 10,
    },

    description_container: {
        backgroundColor: '#441d59',
        padding: 10,
        margin:10,
        borderRadius:10  
    },

    description_container2: {
        backgroundColor: '#441d59',
        padding: 10,
    },

    button_container: {
        flexDirection: "row",
        backgroundColor: '#441d59',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    button_share: {
        backgroundColor: '#441d59',
        flex: 2,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },

    button_delete: {
        backgroundColor: '#441d59',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },

    button_arrow: {
        backgroundColor: '#441d59',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
});


export default RecordHistory;