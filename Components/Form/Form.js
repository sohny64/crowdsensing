import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

class Form extends React.Component{
    render(){
        const form = this.props.navigation.state.params.form;
        return(
            <View style={styles.main_container}>
                <View style={styles.title_container}>
                    <Text style={styles.title}>{form.title}</Text>
                </View>
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
    }
});

export default Form;