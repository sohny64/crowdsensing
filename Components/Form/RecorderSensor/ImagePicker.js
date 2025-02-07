import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";
import * as Picker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {parse, stringify} from 'flatted';

export default class ImagePicker extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            image: null
        }
    }

    _setImage(image){
        this.setState({ image: image });
    }

    getPermissionAsync = async () => {
          const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
          const { status1 } = await Permissions.askAsync(Permissions.CAMERA);
          if (status1 !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
          const { status2 } = await Permissions.askAsync(Permissions.WRITE_EXTERNAL_STORAGE);
          if (status2 !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
    };

    useEffect(){
        getPermissionAsync();
    };

    _pickImage = async () => {
        //Ask storage permission to user
        /*const { status } = await Picker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        } else {*/
            //If permission allowed -> pick picture from storage
            let result = await Picker.launchImageLibraryAsync({
                mediaTypes: Picker.MediaTypeOptions.All,
                allowsEditing: false,
                base64: true,
                aspect: [4, 3],
                quality: 1,
              });

              if (!result.cancelled) {
                  //If picture has been picked -> send to the form
                this._setImage(result.uri);
                this.props.getAnswer(result.uri, this.props.question);
              }
        //}
    };

    _takePicture = async () => {
        //Ask camera permission to user
        /*const { status } = await Picker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        } else {*/
            //If permission allowed -> Take picture
            let result = await Picker.launchCameraAsync({
                mediaTypes: Picker.MediaTypeOptions.All,
                allowsEditing: false,
                base64: true,
                aspect: [4, 3],
                quality: 1,
                storageOptions: {
                  cameraRoll: false
                }
              });

              if (!result.cancelled) {
                //If picture has been taken -> send to the form
                this._setImage(result.uri);
                this.props.getAnswer(result.uri, this.props.question);

            }
        //}
    }



    render(){
        const image = this.state.image;
        return(
            <View>
                {image && <Image source={{uri: image}} style={styles.image}/>}
                <View style={styles.buton_container}>
                    <TouchableOpacity style={styles.button} onPress={() => this._pickImage()}>
                        <Text style={styles.text}>Pick from Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => this._takePicture()}>
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
        backgroundColor: '#2c3a4e',
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
