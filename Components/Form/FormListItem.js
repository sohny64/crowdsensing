import React from 'react';
import { View } from 'react-native';
import { StyleSheet, Image, TouchableOpacity, Text } from 'react-native';

class FormListItem extends React.Component{
    constructor(props){
        super(props)
    }

    _getColorNext(){
        const colors = this.props.getColors(); //Array with all forms color
        //Get next form color
        let index = colors.indexOf(this.props.form.color);
        if(index == colors.length-1){
            return '#6394cf';
        }
        return colors[index+1];
    }

    render(){
        const { form, displayFormDescription} = this.props; //Get props
        return(
            <View style={{backgroundColor: this._getColorNext()}}>
                <TouchableOpacity style={[styles.main_container,{backgroundColor: form.color}]} onPress={() => displayFormDescription(form)}>
                    <Text> </Text>
                    <Text style={styles.title}>{form.title}</Text>
                    <Image style={styles.image} source={form.image}/>
                </TouchableOpacity>
            </View>
        );
    };
}

const styles = StyleSheet.create({

    main_container: {
        borderBottomLeftRadius: 120,
    },
    title: {
        left: 50,
        top: 20,
        fontSize: 28,
        fontWeight: "bold",
        color: '#000000'
    },
    image: {
        width: 90,
        height: 130,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 15,
        marginBottom: 15,
        opacity: 0.8,
        marginEnd: 10
    }
});

export default FormListItem;
