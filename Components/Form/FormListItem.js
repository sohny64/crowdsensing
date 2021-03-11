import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Text } from 'react-native';

class FormListItem extends React.Component{
    render(){
        const { form, displayFormDescription } = this.props;
        return(
            <TouchableOpacity style={[styles.main_container,{backgroundColor: form.color}]} onPress={() => displayFormDescription(form)}>
                <Text style={styles.date}>{form.publication_date}</Text>
                <Text style={styles.title}>{form.title}</Text>
                <Image style={styles.image} source={form.image}/>
            </TouchableOpacity>
        );
    };
}

const styles = StyleSheet.create({
    
    main_container: {
        borderBottomLeftRadius: 60
    },
    date: {
        fontSize: 8,
        color: '#ffffff'
    },
    title: {
        fontSize: 28,
        color: '#ffffff'
    },
    image: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
        alignSelf: 'flex-end',
        marginTop: 10,
        opacity: 0.8,
        marginEnd: 10
    }
});

export default FormListItem;