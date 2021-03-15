import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TouchableHighlight  } from 'react-native';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer'



class Record extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            timerStart: false,
            stopwatchStart: false,
            totalDuration: 10000,
            timerReset: false,
            stopwatchReset: false,
        }
    this.toggleTimer = this.toggleTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.toggleStopwatch = this.toggleStopwatch.bind(this);
    this.resetStopwatch = this.resetStopwatch.bind(this);
    }
    
    toggleTimer() {
        this.setState({timerStart: !this.state.timerStart, timerReset: false});
    }
    
    resetTimer() {
        this.setState({timerStart: false, timerReset: true});
    }
    
    toggleStopwatch() {
        this.setState({stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false});
    }
    
    resetStopwatch() {
        this.setState({stopwatchStart: false, stopwatchReset: true});
    }

    componentDidMount(){
        /* FORMAT THE SELECTSENSORS ARRAW TO A MAP */ 
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
    }



    renderSmartphoneSensorList(){
        return this.state.selected.map((item, key) => {
            return (
                <Text style={styles.text}>{item.key}</Text>
            )
          })
    }

    renderTimer() {
        return (
          <View style={styles.timer}>
            <Timer totalDuration={this.state.totalDuration} msecs
                start={this.state.timerStart}
                reset={this.state.timerReset}
                options={options}
                handleFinish={handleTimerComplete}
                getTime={this.getFormattedTime} />
        </View>)
    }

    render(){
        
        return(
            <View style={styles.main_container}>
                 <View style={styles.description_container}>
                    <Text style={styles.subhead}>Sensors selected :</Text>
                    {this.renderSmartphoneSensorList()}
                </View>
                {this.renderTimer()}
                <TouchableOpacity style={styles.button} onPress={this.toggleTimer}>
                        <Text style={styles.text_button}>{!this.state.timerStart ? "Start" : "Stop"}</Text>
                </TouchableOpacity>
            </View> 
        );
    };
}

const handleTimerComplete = () => alert("custom completion function");
const options = {
    container: {

    },
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


export default Record;

