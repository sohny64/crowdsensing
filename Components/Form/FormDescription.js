import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

class FormDescription extends React.Component{
    displayForm = (form) => {
        //Open a new screen with the form selected
        this.props.navigation.navigate("Form", { form: form });
    }

    displaySensorsForm(form){
        return(
            //Display all sensors use in the form 
            form.sensors.map((sensor) => {
                return(<Text style={styles.text} key={sensor.toString()}> -{sensor}</Text>);
            })
        );
    }

    render(){
        const form = this.props.navigation.state.params.form; //Form
        return(
            <View style={styles.main_container}>
                <View style={styles.title_container}>
                    <Text style={styles.title}>{form.title}</Text>
                </View>
                <View style={styles.duration_container}>
                    <Text style={styles.subhead}>Form Duration</Text>
                    <Text style={styles.text}>{form.duration}</Text>
                </View>
                <View style={styles.description_container}>
                    <Text style={styles.subhead}>Description</Text>
                    <Text style={styles.text}>{form.description}</Text>
                </View>
                <View style={styles.sensors_container}>
                    <Text style={styles.subhead}>Sensor used</Text>
                    <View>
                        {this.displaySensorsForm(form)}
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => this.displayForm(form)}>
                        <Text style={styles.text_button}>Start</Text>
                </TouchableOpacity>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    main_container: {
        backgroundColor: '#331245',
        flex: 1
    },
    title_container: {
        padding: 30,
        borderBottomLeftRadius: 60,
        backgroundColor: '#ffffff'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subhead: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 5
    },
    duration_container: {
        flexDirection: 'row',
        backgroundColor: '#441d59',
        borderRadius: 18,
        margin: 10,
        padding: 10,
        paddingBottom: 5,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    description_container: {
        backgroundColor: '#441d59',
        borderRadius: 20,
        margin: 10,
        padding: 10
    },
    sensors_container: {
        backgroundColor: '#441d59',
        borderRadius: 20,
        margin: 10,
        padding: 10
    },
    text: {
        color: '#ffffff'
    },
    text_button:{
        color: '#ffffff',
        fontSize: 20
    },
    button: {
        padding: 10,
        backgroundColor: '#862db3',
        borderRadius: 20,
        width: '70%',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 'auto',
        marginBottom: 30
    }
});

export default FormDescription;