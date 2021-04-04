import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { Stopwatch } from 'react-native-stopwatch-timer'
import Accelerometer from './Accelerometer'
import Barometer from './Barometer'
import Gyroscope from './Gyroscope'
import Magnetometer from './Magnetometer'
import Pedometer from './Pedometer'



class Record extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            stopwatchStart: false,
            totalDuration: 10000,
            stopwatchReset: false,
            resultSensor: []
        }
    this.toggleStopwatch = this.toggleStopwatch.bind(this);
    this.resetStopwatch = this.resetStopwatch.bind(this);
    }

    /* STOP WATCH */
    toggleStopwatch() {
        this.setState({stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false})
    }
    
    resetStopwatch() {
        this.setState({stopwatchStart: false, stopwatchReset: true})
    }

    handleTimerComplete(){
        if (this.state.stopwatchStart == true){
            alert("Lancer la fonction pour enregistrer")
            this.resetStopwatch()
        }
    }
    /* ------------------ */

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


        {this.toggleStopwatch(); this.handleTimerComplete();}


    }

    /* ------------------ */

    

    /* RENDER EACH SENSORS CHECKED */ 
    checkSwitch=(param)=>{
        switch(param) {
          case 'Accelerometer':
              return ( <Accelerometer /> )

          case 'Barometer':
              return ( <Barometer/>)

          case 'Gyroscope':
              return ( <Gyroscope/>)

          case 'Magnetometer':
              return ( <Magnetometer/>)
              
          case 'Pedometer':
              return ( <Pedometer/>)
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
        return(
            <View style={styles.main_container}>
                 <View style={styles.description_container}>
                    <Text style={styles.subhead}>Sensors selected :</Text>
                    {this.renderSmartphoneSensorList()}
                    
                    
                </View>
                {this.renderStopWatch()}
                <TouchableOpacity style={styles.button} onPress={ () => { this.toggleStopwatch(); this.handleTimerComplete();}}>
                        <Text style={styles.text_button}>{!this.state.stopwatchStart ? "Start" : "Stop"}</Text>
                </TouchableOpacity>
            </View> 
        );
    };
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
});

/* ------------------ */

export default Record;

