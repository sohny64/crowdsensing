import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Modal } from 'react-native';
import { Stopwatch } from 'react-native-stopwatch-timer'
import { Input } from 'react-native-elements';
import { Accelerometer, Barometer, Gyroscope, Magnetometer, Pedometer } from 'expo-sensors';
import { ScrollView } from 'react-native-gesture-handler';



class Record extends React.Component{

    constructor(props) {
        super(props);
        this.state = {

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

        this._interval = setInterval(() => {
            this.recordSensor()
            //console.log(this.state.tableauValeurs)
            //console.log("---------------------")
            //console.log(this.state.tableauValeurs[0].Accelerometer.x)
            //console.log(this.state.tableauValeurs[1].y)
            //console.log(this.state.tableauValeurs[1].z)
            //console.log("---------------------")

        }, 350);

       
    }


    componentWillUnmount() {
        this._unsubscribe()
        clearInterval(this._interval);

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

    _PreviousPage(){
        this.props.navigation.navigate("Sensors", { 
            selectedSensors: this.state.selectedSensors,
            permissionsNeeded: this.state.permissionsNeeded 
        });
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    recordSensor(){
        this.setState({
            tableauValeurs: [{
                time : Date.now()-this.state.currentTime,
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
        ]

        })
    }

//---------------------------------------------------------------------------------------------------------------------

    //Accelerometer
    _slowAccelerometer(){
        Accelerometer.setUpdateInterval(350);
    };
    
    _mediumAccelerometer(){
        Accelerometer.setUpdateInterval(150);
    };
    
    _fastAccelerometer(){
        Accelerometer.setUpdateInterval(50);
    };

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


    //StopWatch
    toggleStopwatch() {
        this.setState({stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false})
    }
    
    resetStopwatch() {
        this.setState({stopwatchStart: false, stopwatchReset: true})
    }

    handleTimerComplete(){
        if (this.state.stopwatchStart == true){
            console.log(new Date().getTime())
            this.setModalVisible();
            this._unsubscribe()
            this.resetStopwatch()
        }else{
            this._subscribe()
        }
    }

//--------------------------------------------------------------------------------------------------------------------- 
      
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

    renderMagnetometer(){
        return (
          <View style={styles.containerSensor}>
            <Text style={styles.textSensor}>
              x: {round(this.state.magnetometerX)}{"\n"}
              y: {round(this.state.magnetometerY)}{"\n"}
              z: {round(this.state.magnetometerZ)}
            </Text>
          </View>
    )}

    renderPedometer() {
        return (
          <View style={styles.containerSensor}>
              
            <Text style={styles.textSensor} >{Platform.OS === 'ios' ? `${this.state.currentStepCount} m` : `Only available on iOS`}</Text>
          </View>
        );
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

    renderPopUp() {
        const { modalVisible } = this.state;
        return (
          <View style={styles.centeredView}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalTitle}>Save data</Text>
                    <Input 
                        style={styles.input}
                        placeholder='MySaveName'
                        onChangeText={value => this.setState({ nameSave: value })}
                        />
                  <TouchableOpacity style={styles.buttonAllowed} onPress={() => {this.setModalVisible(false); this._PreviousPage();}}>
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>

                </View>
              </View>
            </Modal>
          </View>
        );
      }

    renderStopWatch() {
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
                        {this.renderSmartphoneSensorList()}  
                    </View>
                </ScrollView> 

                {this.renderStopWatch()}
                <TouchableOpacity style={styles.button} onPress={ () => { this.toggleStopwatch(); this.handleTimerComplete();} }>
                        <Text style={styles.text_button}>{!this.state.stopwatchStart ? "Start" : "Stop and save"}</Text>
                </TouchableOpacity>

                <View>
                    {this.renderPopUp()}                 
                </View>
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        marginTop: 22,
        backgroundColor:"#ffffffaa"
      },
      modalView: {
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
      modalText: {
        marginTop: 10,
        color: '#ffffff',
        textAlign: "center"
      },
      modalTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: "center"
      },
      buttonAllowed: {
        alignSelf:"center",
        alignItems: "center",
        width:'40%',
        marginTop:0,
        backgroundColor: "#D47FA6",
        borderRadius: 20,
        padding: 10,

      },
      buttonDeny: {
        width:'80%',
        marginTop:10,
        backgroundColor: "#61536C",
        borderRadius: 20,
        padding: 10,
      },

      buttonText:{
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

