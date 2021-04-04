import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { Stopwatch } from 'react-native-stopwatch-timer'

export default class AudioRecorder extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            isRecording: false,
            uri: "",
            recording: undefined,
            stopwatchStart: false,
            totalDuration: 10000,
            stopwatchReset: false
        }
        this.toggleStopwatch = this.toggleStopwatch.bind(this);
        this.resetStopwatch = this.resetStopwatch.bind(this);
    }  

    toggleStopwatch() {
        this.setState({stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false});
    }

    resetStopwatch() {
        this.setState({stopwatchStart: false, stopwatchReset: true});
    }

    startRecording = async () =>  {
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            await Audio.getPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            }); 
            console.log('Starting recording..');
            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await recording.startAsync();
            this.setState({ recording: recording, isRecording:true });
          
            //Start and reset timer
            this.resetStopwatch()
            this.toggleStopwatch();
          
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    stopRecording = async () => {
        const getAnswer = this.props.getAnswer;
        const recording = this.state.recording;
        console.log('Stopping recording..');
        this.setState({ recording: undefined, isRecording:false });
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        this.setState({ uri: uri });
        getAnswer(uri, this.props.question);
        console.log('Recording stopped and stored at', uri);

        //Stop timer
        this.toggleStopwatch();
    }

    render(){
        return(
            <View>
                 <Stopwatch
                    msecs={true}
                    start={this.state.stopwatchStart}
                    reset={this.state.stopwatchReset}
                    options={options}
                />
                <TouchableOpacity style={styles.button} onPress={this.state.isRecording ? () => this.stopRecording() : () => this.startRecording() }>
                    <Text style={styles.text}>{this.state.isRecording ? 'Stop' : 'Start'}</Text>
                </TouchableOpacity>
            </View>
        )
    }

}

const options = {
    text: {
      fontSize: 30,
      color: '#ffffff',
      marginLeft: 7,
      alignSelf: 'center',
      marginTop: 10,
      marginBottom: 10
    }
  };

const styles = StyleSheet.create({
    button: {
        padding: 10,
        backgroundColor: '#862db3',
        borderRadius: 20,
        alignItems: 'center',
        alignSelf: 'center',
        width: '60%',
        marginTop: 'auto',
        marginBottom: 20
    },
    text: {
        color: '#ffffff'
    }
});