import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import * as Picker from 'expo-image-picker';

export default class ImagePicker extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            image: undefined
        }
    }

    setImage(image){
        this.setState({ image: image });
    }



    pickImage = async () => {
        //Ask storage permission to user
        const { status } = await Picker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        } else {
            //If permission allowed -> pick picture from storage
            let result = await Picker.launchImageLibraryAsync({
                mediaTypes: Picker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
              });
          
              console.log(result);
          
              if (!result.cancelled) {
                  //If picture has been picken -> send to the form
                this.setImage(result.uri);
                this.props.getAnswer(result.uri, this.props.question);
              }
        }
    };

    takePicture = async () => {
        //Ask camera permission to user
        const { status } = await Picker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        } else {
            //If permission allowed -> Take picture
            let result = await Picker.launchCameraAsync({
                mediaTypes: Picker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
              });
          
              if (!result.cancelled) {
                //If picture has been taken -> send to the form
                this.setImage(result.uri);
                this.props.getAnswer(result.uri, this.props.question);
              }
        }
    }



    render(){
        const image = this.state.image;
        return(
            <View>
                {image && <Image source={{uri: image}} style={styles.image}/>}
                <View style={styles.buton_container}>
                    <TouchableOpacity style={styles.button} onPress={() => this.pickImage()}>
                        <Text style={styles.text}>Pick from Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => this.takePicture()}>
                        <Text style={styles.text}>Take a picture</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buton_container:{
        flexDirection: 'row',
        justifyContent: 'space-around'
    },

    button: {
        padding: 10,
        backgroundColor: '#862db3',
        borderRadius: 20,
        alignItems: 'center',
        alignSelf: 'center',
        width: '45%',
        marginTop: 10,
        marginBottom: 20
    },
    text: {
        color: '#ffffff'
    },
    image: {
        borderRadius: 60,
        alignSelf: 'center',
        width: 250,
        height: 250,
        resizeMode: 'contain'
    }
});