import React from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Text } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import forms from '../../Helpers/formData'
import FormListItem from './FormListItem';

class FormList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            modalVisible: false
        }
    }

    _setInfoPopUpVisibility(){
        //Change the pop-up visibility
        this.setState({ modalVisible: !this.state.modalVisible });
    }

    displayFormDescription = (form) => {
        //Open a new screen with the selected form
        this.props.navigation.navigate("Description", { form: form });
    }

    getColors(){

        let colors = []; //colors array
        let i = 0;
        //Get colors from all forms. It's use in the FormListItem for the design
        forms.forEach(form => {
            colors[i] = form.color;
            i++;
        });
        return colors;
    }

    render(){
        return(
            <View style={styles.main_container}>
                <FlatList
                style={styles.forms_list}
                data={forms}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => <FormListItem form={item} getColors={this.getColors} displayFormDescription={this.displayFormDescription}/>}
                />
                <View style={styles.button_container}>
                    <TouchableOpacity style={styles.button_info} onPress={() => this._setInfoPopUpVisibility()}>
                        <Image
                            source={require('../../Images/info.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
                {/* Pop-up for legal informations */}
                <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}>
                    <View style={styles.modal_view}>
                        <Text style={styles.modal_title}>Legal information</Text>
                        <ScrollView style={styles.modal_scroll}>
                            <Text style={styles.modal_text}>Add user rights informations and recovered data informations</Text>
                        </ScrollView>
                        <TouchableOpacity style={styles.button} onPress={() => this._setInfoPopUpVisibility()}>
                            <Text style={styles.button_text}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#5075a2',
    },
    button_container: {
        position: 'absolute',
        height: '100%',
        marginLeft: 10
    },
    button_info: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 100,
        marginBottom: 10,
        marginTop: 'auto'
    },
    icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },

    modal_view: {
        margin: 20,
        height: '95%',
        backgroundColor: '#2c3a4e',
        borderTopRightRadius:60,
        borderBottomLeftRadius:60,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0,
        shadowRadius: 4,
        elevation: 5,

    },
    modal_text: {
        marginTop: 10,
        color: '#ffffff',
        textAlign: 'center',
        textAlign: 'justify'
    },
    modal_title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: "center"
    },
    button: {
        padding: 10,
        backgroundColor: '#1a2029',
        borderRadius: 20,
        alignItems: 'center',
        alignSelf: 'center',
        width: '60%'
    },
    button_text: {
        color: '#ffffff'
    },
    modal_scroll: {
        marginBottom: 10
    }

});

export default FormList;
