import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform} from 'react-native';
import { Stopwatch } from 'react-native-stopwatch-timer'
import { Accelerometer, Barometer, Gyroscope, Magnetometer, Pedometer } from 'expo-sensors';
import * as Permissions from 'expo-permissions';
import { ScrollView } from 'react-native-gesture-handler';



class Record extends React.Component{

    constructor(props) {
        super(props);
        this.state = {

            //selected
            selected: [],

            //Stopwatch
            stopwatchStart: false,
            totalDuration: 10000,
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

            //Magnetometer
            magnetometerX: 0,
            magnetometerY: 0,
            magnetometerZ: 0,

            //Pedometer
            currentStepCount: 0,
            pastStepCount: 0,

            //Array value
            tableauValeurs: [
                                {
                                    time : 0,
                                    Accelerometer: {
                                                        x:0,
                                                        y:0,
                                                        z:0
                                                   },

                                    Gyroscope: {
                                                        x:0,
                                                        y:0,
                                                        z:0
                                                    },

                                    Magnetometer:   {
                                                        x:0,
                                                        y:0,
                                                        z:0
                                                    },   
                                    Barometer:  {
                                                    pressure:0,
                                                    relativeAltitude:0
                                               },     

                                    Pedometer: {    
                                                    currrentStep:0
                                               }                                    
                                }
                            ]

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
    };

    _subscribe = () => {
        this._subscriptionAccelerometer =
            Accelerometer.addListener(accelerometerData => {
                this.setState({
                accelerometerX: Object.values(accelerometerData)[2],
                accelerometerY: Object.values(accelerometerData)[1],
                accelerometerZ: Object.values(accelerometerData)[0],
                })
            }) 
        this._subscriptionGyroscope =
            Gyroscope.addListener(gyroscopeData => {
                this.setState({
                gyroscopeX: Object.values(gyroscopeData)[2],
                gyroscopeY: Object.values(gyroscopeData)[1],
                gyroscopeZ: Object.values(gyroscopeData)[0],
                })
            }) 
        this._subscriptionMagnetometer =
            Magnetometer.addListener(magnetometerData => {
                this.setState({
                magnetometerX: Object.values(magnetometerData)[2],
                magnetometerY: Object.values(magnetometerData)[1],
                magnetometerZ: Object.values(magnetometerData)[0],
                })
            }) 
        this._subscriptionBarometer =
            Barometer.addListener(barometerData => {
                this.setState({
                  pressure: Object.values(barometerData)[0],
                  relativeAltitude: Object.values(barometerData)[1],
                })
            }) 
        this._subscriptionPedometer =
            Pedometer.watchStepCount(result => {
                this.setState({
                  currentStepCount: result.steps,
                })
            })
        
        
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
        this._subscribe()
        this.toggleStopwatch()
    }


    componentWillUnmount() {
        this._unsubscribe()
      }




//---------------------------------------------------------------------------------------------------------------------



    //Accelerometer
    _slowAccelerometer(){
        Accelerometer.setUpdateInterval(350);
    };
    
    _stopAccelerometer(){
        Accelerometer.setUpdateInterval(100000);
    };
    
    _fastAccelerometer(){
        Accelerometer.setUpdateInterval(50);
    };

    _renderAccelerometer(){
        return (
            <View style={styles.containerSensor}>
              <Text style={styles.textSensor}>
                x: {round(this.state.accelerometerX)}{"\n"}
                y: {round(this.state.accelerometerY)}{"\n"}
                z: {round(this.state.accelerometerZ)}
              </Text>
            </View>
         )
    }

    //Barometer
    renderBarometer (){
        return(
        <View style={styles.containerSensor}>
          <Text style={styles.textSensor}>Pressure: {round(this.state.pressure * 100)} Pa {"\n"}
            Relative Altitude:{' '}
            {Platform.OS === 'ios' ? `${round(this.state.relativeAltitude)} m` : `Only available on iOS`}
          </Text>
        </View>
        )
    }
    

    //Gyroscope
    _slowGyroscope(){
        Gyroscope.setUpdateInterval(350);
    };
    
    _fastGyroscope(){
        Gyroscope.setUpdateInterval(50);
    };
    
    _stopGyroscope(){
        Gyroscope.setUpdateInterval(100000);
    };
    
    renderGyroscope() {
        return(
        <View style={styles.containerSensor}>
          <Text style={styles.textSensor}>
            x: {round(this.state.gyroscopeX)}{"\n"}
            y: {round(this.state.gyroscopeY)}{"\n"}
            z: {round(this.state.gyroscopeZ)}
          </Text>
        </View>
    )}

    //Magnetometer
    _slowMagnetometer(){
        Magnetometer.setUpdateInterval(350);
    };
      
    _stopMagnetometer(){
        Magnetometer.setUpdateInterval(100000);
    };
    
    _fastMagnetometer(){
        Magnetometer.setUpdateInterval(50);
    };

    renderMagnetometer(){
      return (
        <View style={styles.containerSensor}>
          <Text style={styles.textSensor}>
            x: {round(this.state.magnetometerX)}{"\n"}
            y: {round(this.state.magnetometerY)}{"\n"}
            z: {round(this.state.magnetometerZ)}
          </Text>
        </View>
    )};

    //Pedometer
    renderPedometer() {
        return (
          <View style={styles.containerSensor}>
              
            <Text style={styles.textSensor} >{Platform.OS === 'ios' ? `${this.state.currentStepCount} m` : `Only available on iOS`}</Text>
          </View>
        );
    }

    //StopWatch
    toggleStopwatch() {
        this.setState({stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false})
    }
    
    resetStopwatch() {
        this.setState({stopwatchStart: false, stopwatchReset: true})
    }

    handleTimerComplete(){
        if (this.state.stopwatchStart == true){
            this._unsubscribe()
            this.resetStopwatch()
        }
    }


//---------------------------------------------------------------------------------------------------------------------

    /* RENDER EACH SENSORS CHECKED */ 
    checkSwitch=(param)=>{
        switch(param) {
          case 'Accelerometer':
            return ( this._renderAccelerometer() )

          case 'Barometer':
            return ( this.renderBarometer() )

          case 'Gyroscope':
            return ( this.renderGyroscope() )

          case 'Magnetometer':
            return ( this.renderMagnetometer() )
              
          case 'Pedometer':
            return ( this.renderPedometer() )
        }
      }

    renderSmartphoneSensorList(){
        return this.state.selected.map((item,key) => {
            return (
                <View key={key}>
                    
                    <Text  style={styles.text}>{"\n"}
                                               {item.key}
                                               {"\n"}
                                               {this.checkSwitch(item.key)}
                    </Text>
                </View>
            )
          })
    }
    /* ------------------ */

    renderStopWatch() {
        return (
            <View style={styles.timer}>
            <Stopwatch laps msecs start={this.state.stopwatchStart}
                reset={this.state.stopwatchReset}
                options={options}
                getTime={this.getFormattedTime} />
            </View>
            )
    }

    render(){
        console.log("---------------------------------")
        console.log(this.state.tableauValeurs)
        console.log("---------------------------------")
        return(
            
            <View style={styles.main_container}>

                <ScrollView >
                    <View style={styles.description_container}>
                        <Text style={styles.subhead}>Sensors selected :</Text>
                        {this.renderSmartphoneSensorList()}  
                    </View>
                </ScrollView> 

                {this.renderStopWatch()}
                <TouchableOpacity style={styles.button} onPress={ () => { this.toggleStopwatch(); this.handleTimerComplete();} }>
                        <Text style={styles.text_button}>{!this.state.stopwatchStart ? "Start" : "Stop"}</Text>
                </TouchableOpacity>

            </View>
        );
    };
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

    containerSensor: {
        paddingHorizontal: 15,
      },
  
      textSensor: {
        color: '#ffffff',
        fontSize: 14,
    },

});

/* ------------------ */

export default Record;

