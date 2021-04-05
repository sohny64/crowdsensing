import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform} from 'react-native';
import { Stopwatch } from 'react-native-stopwatch-timer'
import { Accelerometer, Barometer, Gyroscope, Magnetometer, Pedometer } from 'expo-sensors';
import * as Permissions from 'expo-permissions';



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

            //Tableau valeurs
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
        this._subscription && this._subscription.remove();
        this._subscription = null;
    };

    _subscribe = () => {
        let temp=[]
        this._subscription =
            Accelerometer.addListener(accelerometerData => {
                temp=[]
                temp.push(
                    {
                        Accelerometer: {
                            x:Object.values(accelerometerData)[2],
                            y:Object.values(accelerometerData)[1],
                            z:Object.values(accelerometerData)[0]
                        },
                    })
                this.setState({
                accelerometerX: Object.values(accelerometerData)[2],
                accelerometerY: Object.values(accelerometerData)[1],
                accelerometerZ: Object.values(accelerometerData)[0],
                })
            })
            Gyroscope.addListener(gyroscopeData => {
                temp.push(
                    {
                        Gyroscope: {
                            x:Object.values(gyroscopeData)[2],
                            y:Object.values(gyroscopeData)[1],
                            z:Object.values(gyroscopeData)[0]
                        },
                    })
                this.setState({
                gyroscopeX: Object.values(gyroscopeData)[2],
                gyroscopeY: Object.values(gyroscopeData)[1],
                gyroscopeZ: Object.values(gyroscopeData)[0],
                })
            })
            Magnetometer.addListener(magnetometerData => {
                temp.push(
                    {
                        Magnetometer: {
                            x:Object.values(magnetometerData)[2],
                            y:Object.values(magnetometerData)[1],
                            z:Object.values(magnetometerData)[0]
                        },
                    })
                this.setState({
                magnetometerX: Object.values(magnetometerData)[2],
                magnetometerY: Object.values(magnetometerData)[1],
                magnetometerZ: Object.values(magnetometerData)[0],
                })
            })
            Barometer.addListener(barometerData => {
                temp.push(
                    {
                        Barometer: {
                            pressure: Object.values(barometerData)[0],
                            relativeAltitude: Object.values(barometerData)[1],
                        },
                    })
                this.setState({
                  pressure: Object.values(barometerData)[0],
                  relativeAltitude: Object.values(barometerData)[1],
                  tableauValeurs: temp
                })
            })
            Pedometer.watchStepCount(result => {
                temp.push(
                    {
                        Pedometer: {
                            currentStepCount: result.steps,
                        },
                    })
                this.setState({
                  currentStepCount: result.steps,
                  
                })
            })
            

    /*
                    Gyroscope: {
                        x:this.state.gyroscopeX,
                        y:this.state.gyroscopeY,
                        z:this.state.gyroscopeZ
                    },
    
                    Magnetometer:   {
                        x:this.state.magnetometerX,
                        y:this.state.magnetometerY,
                        z:this.state.magnetometerZ
                    },   
    
                    Barometer:  {
                        pressure:this.state.pressure,
                        relativeAltitude:this.state.relativeAltitude
                    },     
    
                    Pedometer: {    
                        currrentStep:this.state.currentStepCount
                    }          
                }
            )
            this.setState({tableauValeurs:temp})*/
        
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
        this._unsubscribe();
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
            this._slowGyroscope()
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
                 <View style={styles.description_container}>
                    <Text style={styles.subhead}>Sensors selected :</Text>
                    {this.renderSmartphoneSensorList()}
                    
                    
                </View>
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
      marginLeft: 7,
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
    text: {
        color: '#ffffff',
        fontSize: 17,
    },
    timer: {
        backgroundColor: '#331245',
        width: '70%',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 80,
        flexDirection: "row",
        bottom: 20,
        right: 20,
        position: 'absolute',
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

