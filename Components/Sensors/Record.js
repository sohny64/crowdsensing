import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Modal, DeviceEventEmitter  } from 'react-native';
import { Stopwatch } from 'react-native-stopwatch-timer'
import { Input } from 'react-native-elements';
import { Accelerometer, Barometer, Gyroscope, Magnetometer, Pedometer } from 'expo-sensors';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';


class Record extends React.Component{

    constructor(props) {
        super(props);
        this.state = {

            //Compteur
            compteur:0,

            visible:false,

            //Save
            nameSave: null,

            //Popup
            modalVisible: false,

            //currentTime
            currentTime: Date.now(),

            //selected
            selected: [],

            //Stopwatch
            stopwatchStart: false,
            stopwatchReset: false,

            //Accelerometer
            accelerometerX: 0,
            accelerometerY: 0,
            accelerometerZ: 0,
            
            //Barometer
            pressure:0,
            relativeAltitude:0,           
            
            //Gyroscope
            gyroscopeX: 0,
            gyroscopeY: 0,
            gyroscopeZ: 0,

            humidity:0,

            //Magnetometer
            magnetometerX: 0,
            magnetometerY: 0,
            magnetometerZ: 0,

            //Pedometer
            currentStepCount: 0,
            pastStepCount: 0,

            //Array
            tableauValeurs:
                                {
                                    time : 0,
                                    nameSave:undefined,
                                    visible:false,
                                    currentTime: Date.now(),                               
                                }
        

        }
        this.toggleStopwatch = this.toggleStopwatch.bind(this);
        this.resetStopwatch = this.resetStopwatch.bind(this);
    }


//---------------------------------------------------------------------------------------------------------------------
        
    _unsubscribe = () => {

        this._subscriptionAccelerometer && this._subscriptionAccelerometer.remove();
        this._subscriptionAccelerometer = null;

        this._subscriptionGyroscope && this._subscriptionGyroscope.remove();
        this._subscriptionGyroscope = null;

        this._subscriptionMagnetometer && this._subscriptionMagnetometer.remove();
        this._subscriptionMagnetometer = null;

        this._subscriptionBarometer && this._subscriptionBarometer.remove();
        this._subscriptionBarometer = null;

        this._subscriptionPedometer && this._subscriptionPedometer.remove();
        this._subscriptionPedometer = null;

    }

    _subscribe = () => {
        const smartphoneSensors = this.props.navigation.state.params.selectedSensors
        let Temps = smartphoneSensors
        let test = []
        for(let i=0;i<Temps.length;i++){
           switch(Temps[i]){
                case 'Accelerometer':
                    this.setState({tableauValeurs: test})
        
                    this._subscriptionAccelerometer =   
                        Accelerometer.addListener(accelerometerData => {
                            this.setState({
                                accelerometerX: Object.values(accelerometerData)[2],
                                accelerometerY: Object.values(accelerometerData)[1],
                                accelerometerZ: Object.values(accelerometerData)[0],
                            })
                        })
                    break
                case 'Gyroscope':
                    this._subscriptionGyroscope =
                        Gyroscope.addListener(gyroscopeData => {
                            this.setState({
                                gyroscopeX: Object.values(gyroscopeData)[2],
                                gyroscopeY: Object.values(gyroscopeData)[1],
                                gyroscopeZ: Object.values(gyroscopeData)[0],
                            })
                        }) 
                    break
                case 'Magnetometer':
                    this._subscriptionMagnetometer =
                        Magnetometer.addListener(magnetometerData => {
                            this.setState({
                                magnetometerX: Object.values(magnetometerData)[2],
                                magnetometerY: Object.values(magnetometerData)[1],
                                magnetometerZ: Object.values(magnetometerData)[0],
                            })
                        }) 
                        break
                case 'Barometer':
                    this._subscriptionBarometer =
                        Barometer.addListener(barometerData => {
                            this.setState({
                                pressure: Object.values(barometerData)[0],
                                relativeAltitude: Object.values(barometerData)[1],
                            })
                        }) 
                        break
                case 'Pedometer':
                    this._subscriptionPedometer =
                        Pedometer.watchStepCount(result => {
                            this.setState({
                                currentStepCount: result.steps,
                            })
                        })
                    break
            }  
        }
        
    }
    

    /* FORMAT THE SELECTSENSORS ARRAW TO A MAP */ 
    componentDidMount(){
        const smartphoneSensors = this.props.navigation.state.params.selectedSensors
        let Temps = smartphoneSensors
        let FormatData=[]
        for(let i=0;i<Temps.length;i++){
            FormatData.push(
                {
                    id:i,
                    key:Temps[i]
                }
            )
        }
        this.setState({selected:FormatData})
        this.toggleStopwatch()
        this._interval = setInterval(() => {
            this.setState({compteur: this.state.compteur+1})
            this._recordSensor()
        }, 500);
        this._slowAccelerometer()
        this._slowGyroscope()
        this._slowMagnetometer()
        this._subscribe()
    }


    componentWillUnmount() {
        this._unsubscribe()
        clearInterval(this._interval);
    }


//---------------------------------------------------------------------------------------------------------------------

    _storeData = async () => {
        try {
            let key = "sensorRecord_" + JSON.stringify(this.state.tableauValeurs.time);
            let jsonValue = JSON.stringify(this.state.tableauValeurs)
            await AsyncStorage.setItem(key, jsonValue)
            this._PreviousPage();
          } catch (e) {
            console.log("erreur")
          }
    }; 

    _changeNameSave(value){
        this.state.tableauValeurs.nameSave = value
    }

    /* RENDER EACH SENSORS CHECKED */ 
    _checkSwitch=(param)=>{
        switch(param) {
        case 'Accelerometer':
            return ( this._renderAccelerometer() )

        case 'Barometer':
            return ( this._renderBarometer() )

        case 'Gyroscope':
            return ( this._renderGyroscope() )

        case 'Magnetometer':
            return ( this._renderMagnetometer() )
            
        case 'Pedometer':
            return ( this._renderPedometer() )
        }
    }

    _PreviousPage(){
        this.props.navigation.navigate("Sensors", { 
            tableauValeurs: this.state.tableauValeurs,
            nameSave: this.state.nameSave 
        });
    }

    _setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    _GetDuration(){
        return console.log(millisToMinutesAndSeconds(this.state.tableauValeurs[0].time))
    }

    _makeAverage(){
        let accelerometerX = this.state.tableauValeurs.Accelerometer.x / this.state.compteur
        let accelerometerY = this.state.tableauValeurs.Accelerometer.y / this.state.compteur
        let accelerometerZ = this.state.tableauValeurs.Accelerometer.z / this.state.compteur

        let gyroscopeX = this.state.tableauValeurs.Gyroscope.x / this.state.compteur
        let gyroscopeY = this.state.tableauValeurs.Gyroscope.y / this.state.compteur
        let gyroscopeZ = this.state.tableauValeurs.Gyroscope.z / this.state.compteur

        let magnetometerX = this.state.tableauValeurs.Magnetometer.x / this.state.compteur
        let magnetometerY = this.state.tableauValeurs.Magnetometer.y / this.state.compteur
        let magnetometerZ = this.state.tableauValeurs.Magnetometer.z / this.state.compteur

        let pressure = this.state.tableauValeurs.Barometer.pressure / this.state.compteur
        let relativeAltitude = this.state.tableauValeurs.Barometer.relativeAltitude / this.state.compteur

         this.state.tableauValeurs.Accelerometer.x = accelerometerX
         this.state.tableauValeurs.Accelerometer.y = accelerometerY
         this.state.tableauValeurs.Accelerometer.y = accelerometerZ

         this.state.tableauValeurs.Gyroscope.x = gyroscopeX
         this.state.tableauValeurs.Gyroscope.y = gyroscopeY
         this.state.tableauValeurs.Gyroscope.y = gyroscopeZ

        this.state.tableauValeurs.Magnetometer.x = magnetometerX
        this.state.tableauValeurs.Magnetometer.y = magnetometerY
        this.state.tableauValeurs.Magnetometer.z = magnetometerZ

        this.state.tableauValeurs.Barometer.pressure = pressure
        this.state.tableauValeurs.Barometer.relativeAltitude = relativeAltitude
    }

    _recordSensor(){
        if(this.state.compteur == 1){
            this.setState({
                tableauValeurs: {
                    time : Date.now()-this.state.currentTime,
                    nameSave:undefined,   
                    visible:false, 
                    currentTime: Date.now(), 
                    Accelerometer: {
                        x:this.state.accelerometerX,
                        y:this.state.accelerometerY,
                        z:this.state.accelerometerZ,
                    },

                    Gyroscope: {
                        x:this.state.gyroscopeX,
                        y:this.state.gyroscopeX,
                        z:this.state.gyroscopeX,
                    },

                    Magnetometer:   {
                        x:this.state.magnetometerX,
                        y:this.state.magnetometerY,
                        z:this.state.magnetometerZ,
                    },   

                    Barometer:  {
                        pressure:this.state.pressure,
                        relativeAltitude:this.state.relativeAltitude
                            },     

                    Pedometer: {    
                        currrentStep:this.state.currentStepCount
                    }                                    
                }

            })
        }
        else if(this.state.compteur == 0){

        }
        else{
            this.setState({
                tableauValeurs: {
                    time : Date.now()-this.state.currentTime,
                    nameSave:undefined,
                    visible:false, 
                    currentTime: Date.now(), 
                    Accelerometer: {
                        x:this.state.tableauValeurs.Accelerometer.x+this.state.accelerometerX,
                        y:this.state.tableauValeurs.Accelerometer.y+this.state.accelerometerY,
                        z:this.state.tableauValeurs.Accelerometer.z+this.state.accelerometerZ,
                    },

                    Gyroscope: {
                        x:this.state.tableauValeurs.Gyroscope.x+this.state.gyroscopeX,
                        y:this.state.tableauValeurs.Gyroscope.y+this.state.gyroscopeY,
                        z:this.state.tableauValeurs.Gyroscope.z+this.state.gyroscopeZ,
                    },

                    Magnetometer:   {
                        x:this.state.tableauValeurs.Magnetometer.x+this.state.magnetometerX,
                        y:this.state.tableauValeurs.Magnetometer.y+this.state.magnetometerY,
                        z:this.state.tableauValeurs.Magnetometer.z+this.state.magnetometerZ,
                    },   

                    Barometer:  {
                        pressure:this.state.tableauValeurs.Barometer.pressure+this.state.pressure,
                        relativeAltitude:this.state.tableauValeurs.Barometer.relativeAltitude+this.state.relativeAltitude,
                            },     
                    Pedometer: {    
                        currrentStep:this.state.currentStepCount
                    }                                    
                }

            })
        }
        
    }

//---------------------------------------------------------------------------------------------------------------------

    //Accelerometer
    _slowAccelerometer(){
        Accelerometer.setUpdateInterval(150);
    };
    
    _mediumAccelerometer(){
        Accelerometer.setUpdateInterval(150);
    };
    
    _fastAccelerometer(){
        Accelerometer.setUpdateInterval(50);
    };

    //Gyroscope
    _slowGyroscope(){
        Gyroscope.setUpdateInterval(150);
    };
    
    _fastGyroscope(){
        Gyroscope.setUpdateInterval(50);
    };
    
    _stopGyroscope(){
        Gyroscope.setUpdateInterval(100000);
    };

    //Magnetometer
    _slowMagnetometer(){
        Magnetometer.setUpdateInterval(150);
    };
      
    _stopMagnetometer(){
        Magnetometer.setUpdateInterval(100000);
    };
    
    _fastMagnetometer(){
        Magnetometer.setUpdateInterval(50);
    };


    //StopWatch
    toggleStopwatch() {
        this.setState({stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false})
    }
    
    resetStopwatch() {
        this.setState({stopwatchStart: false, stopwatchReset: true})
    }

    handleTimerComplete(){
        if (this.state.stopwatchStart == true){
            this._setModalVisible();
            this._unsubscribe()
            this.resetStopwatch()
            clearInterval(this._interval);
            this._makeAverage()
        }else{
            this._subscribe()
        }
    }

//--------------------------------------------------------------------------------------------------------------------- 


    _renderAccelerometer(){
        return (
            <View style={styles.container_sensor}>
              <Text style={styles.text_sensor}>
                x: {round(this.state.accelerometerX)}{"\n"}
                y: {round(this.state.accelerometerY)}{"\n"}
                z: {round(this.state.accelerometerZ)}
              </Text>
            </View>
         )
    }

    _renderBarometer (){
        return(
        <View style={styles.container_sensor}>
          <Text style={styles.text_sensor}>Pressure: {round(this.state.pressure * 100)} Pa {"\n"}
            Relative Altitude:{' '}
            {Platform.OS === 'ios' ? `${round(this.state.relativeAltitude)} m` : `Only available on iOS`}
          </Text>
        </View>
        )
    }

    _renderGyroscope() {
        return(
        <View style={styles.container_sensor}>
          <Text style={styles.text_sensor}>
            x: {round(this.state.gyroscopeX)}{"\n"}
            y: {round(this.state.gyroscopeY)}{"\n"}
            z: {round(this.state.gyroscopeZ)}
          </Text>
        </View>
    )}

    _renderMagnetometer(){
        return (
          <View style={styles.container_sensor}>
            <Text style={styles.text_sensor}>
              x: {round(this.state.magnetometerX)}{"\n"}
              y: {round(this.state.magnetometerY)}{"\n"}
              z: {round(this.state.magnetometerZ)}
            </Text>
          </View>
    )}

    _renderPedometer() {
        return (
          <View style={styles.container_sensor}>
              
            <Text style={styles.text_sensor} >{this.state.currentStepCount}</Text>
          </View>
        );
    }

    _renderSmartphoneSensorList(){
        return this.state.selected.map((item,key) => {
            return (
                <View key={key}>
                    <Text  style={styles.text}>{"\n"}
                                               {item.key}
                                               {"\n"}
                                               {this._checkSwitch(item.key)}
                    </Text>
                </View>
            )
          })
    }

    _renderPopUp() {
        const { modalVisible } = this.state;
        return (
          <View style={styles.centered_view}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
            >
              <View style={styles.centered_view}>
                <View style={styles.modal_view}>
                  <Text style={styles.modal_title}>Save data</Text>
                    <Input 
                        style={styles.input}
                        placeholder='MySaveName'
                        onChangeText={value => {this.setState({ nameSave: value }); this._changeNameSave(value);}}
                        />
                  <TouchableOpacity style={styles.button_allowed} onPress={() => {this._setModalVisible(false); this._storeData()}}>
                    <Text style={styles.button_text}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        );
      }

    _renderStopWatch() {
        return (
            <View style={styles.timer}>
            <Stopwatch 
                msecs={true}
                start={this.state.stopwatchStart}
                reset={this.state.stopwatchReset}
                options={options}
                />
            </View>
            )
    }

    render(){
        return(
            <View style={styles.main_container}>

                <ScrollView >
                    <View style={styles.description_container}>
                        <Text style={styles.subhead}>Sensors selected :</Text>
                        {this._renderSmartphoneSensorList()}  
                    </View>
                </ScrollView> 

                {this._renderStopWatch()}
                <TouchableOpacity style={styles.button} onPress={ () => { this.toggleStopwatch(); this.handleTimerComplete();} }>
                        <Text style={styles.text_button}>{!this.state.stopwatchStart ? "Start" : "Stop and save"}</Text>
                </TouchableOpacity>

                <View>
                    {this._renderPopUp()}                 
                </View>
            </View>
        );
    };
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

     /* CSS */

const options = {
    text: {
      fontSize: 30,
      color: '#FFF',
    }
  };

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
        
    button: {
        padding: 10,
        backgroundColor: '#862db3',
        borderRadius: 20,
        width: '70%',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 'auto',
        marginBottom: 10
    },
    text: {
        color: '#ffffff',
        fontSize: 17,
    },
    timer: {
        backgroundColor: '#331245',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 10,
        marginTop: 'auto',     
    },

    text_button:{
        color: '#ffffff',
        fontSize: 20
    },

    container_sensor: {
        paddingHorizontal: 15,
    },
  
    text_sensor: {
        color: '#ffffff',
        fontSize: 14,
    },
    centered_view: {
        flex: 1,
        justifyContent: "center",
        marginTop: 22,
        backgroundColor:"#ffffffaa"
    },
    modal_view: {
        margin: 20,
        backgroundColor: "#241332",
        borderTopRightRadius:60,
        borderBottomLeftRadius:60,
        padding: 25,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5 
    },
    modal_title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: "center"
    },
    button_allowed: {
        alignSelf:"center",
        alignItems: "center",
        width:'40%',
        marginTop:0,
        backgroundColor: "#D47FA6",
        borderRadius: 20,
        padding: 10,

    },
    button_text:{
        color: '#ffffff',
        fontSize: 18
    },
    input: {
        textAlign: "center",
        marginTop:15,
        width:'80%',
        height: 40,
        margin: 12,
        color: '#ffffff'
    },

});

/* ------------------ */

export default Record;

