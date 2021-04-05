import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image,  Modal } from 'react-native';
import smartphoneSensorData from '../../Helpers/smartphoneSensorData'
import watchSensorData from '../../Helpers/watchSensorData'
import { CheckBox } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import { ScrollView } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';



class Sensors extends React.Component{
    

    constructor(props){
        super(props)
        this.state = {
            smartphoneData: smartphoneSensorData,
            watchData: watchSensorData,
            selectedSensors:[],
            permissionsNeeded:[],
            modalVisible: false
        }
        
    }


    onCheckedSmartphone(id){
        const data=this.state.smartphoneData
        const index=data.findIndex(x => x.id === id)
        data[index].checked = !data[index].checked
        if (data[index].checked==true){
            this.state.selectedSensors.push(data[index].name)
        }
        else{
            this.state.selectedSensors.splice(this.state.selectedSensors.indexOf(data[index].name), 1);  
        }
        this.setState(data)
    }
    
    /*
    onCheckedWatch(id){
        const data=this.state.watchData
        const index=data.findIndex(x => x.id === id)
        data[index].checked = !data[index].checked
        if (data[index].checked==true){
            this.state.selectedSensors.push(data[index].name)
        }
        else{
            this.state.selectedSensors.splice(this.state.selectedSensors.indexOf(data[index].name), 1);  
        }
        this.setState(data)

    }*/

    getSelectedSensors(){
        console.log(this.state.selectedSensors)
    }

    getPermissionsNeeded(){
        console.log(this.state.permissionsNeeded)
    }

    _NextPage(){
            this.props.navigation.navigate("Record", { 
                selectedSensors: this.state.selectedSensors,
                permissionsNeeded: this.state.permissionsNeeded 
            });
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    renderPopUp() {
        const { modalVisible } = this.state;
        return (
          <View style={styles.centeredView}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalTitle}>Sensors permissions</Text>
                  <Text style={styles.modalText}>Allow this app to access motion sensors? </Text>
                  <Text style={styles.modalText}> Concerned : {this.state.selectedSensors.length} </Text>

                  <TouchableOpacity style={styles.buttonAllowed} onPress={() => {this.setModalVisible(false); this._NextPage()}}>
                    <Text style={styles.buttonText}>             Allow             </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.buttonDeny} onPress={() => this.setModalVisible(false)}>
                    <Text style={styles.buttonText}>             Deny             </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        );
      }

    _displayRecord = () => {

            if(this.state.selectedSensors.length > 0){
                this.setModalVisible();
            }
            else{
                alert("None sensors selected!")
            }
    }

    renderSmartphoneSensors(){
            return(
                <FlatList
                    data={smartphoneSensorData}
                    keyExtractor= {(item) => item.id.toString()}
                    renderItem={({item}) => <CheckBox containerStyle ={styles.checkbox} textStyle={styles.textCheckBox}
                    title={item.name}
                    checked={item.checked}
                    onPress={()=>this.onCheckedSmartphone(item.id)}  
                    />}
                />
            )
    }
    
    renderWatchSensors(){
        return(
            <FlatList
                data={watchSensorData}
                keyExtractor= {(item) => item.id.toString()}
                renderItem={({item}) => <CheckBox containerStyle ={styles.checkbox} textStyle={styles.textCheckBoxBlock}
                title={item.name}
                checked={item.checked}
                
                />}
            />
        )
    }



    render(){
        LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation']); // Ignore log notification by message
        LogBox.ignoreAllLogs();//Ignore all log notifications
        return(
            <View style={styles.main_container}>

                <ScrollView >
    
                    <View style={styles.description_container}>
                        <Text style={styles.subhead}>Phone Sensors :</Text>
                        {this.renderSmartphoneSensors()}
                    </View>

                    <View style={styles.description_container}>
                        <Text style={styles.subheadBlock}>Watch Sensors (not yet avaible):</Text>
                        {this.renderWatchSensors()}
                    </View>

                </ScrollView>

                <View style={styles.button_container}>
                    <TouchableOpacity style={styles.button} onPress={() => this._displayRecord()}>
                        <Text style={styles.text_button}>Start recording</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button_history}>
                        <Image
                            source={require('../../Images/book.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>

                <View>
                    {this.renderPopUp()}  
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
        subhead: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 5
        },
        subheadBlock: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#939393',
            marginBottom: 5
        },
        description_container: {
            backgroundColor: '#441d59',
            borderRadius: 20,
            margin: 10,
            padding: 10
        },
        button_container:{
            flexDirection: "row",
            marginEnd: 20
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
        textCheckBoxBlock: {
            color: '#939393'
        },
        button: {
            padding: 10,
            backgroundColor: '#862db3',
            borderRadius: 20,
            alignItems: 'center',
            alignSelf: 'center',
            width: '60%',
            marginLeft:80
        },
        text_button:{
            color: '#ffffff',
            fontSize: 20
    },
    button_history: {
        marginLeft: 20,
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 100,
    },

    icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        alignItems: 'center',
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor:"#ffffffaa"
      },
      modalView: {
        margin: 20,
        backgroundColor: "#241332",
        borderTopRightRadius:60,
        borderBottomLeftRadius:60,
        padding: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
        
      },
      modalText: {
        marginTop: 10,
        color: '#ffffff',
        textAlign: "center"
      },
      modalTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: "center"
      },
      buttonAllowed: {
        width:'80%',
        marginTop:35,
        backgroundColor: "#D47FA6",
        borderRadius: 20,
        padding: 10,

      },
      buttonDeny: {
        width:'80%',
        marginTop:10,
        backgroundColor: "#61536C",
        borderRadius: 20,
        padding: 10,


      },
      buttonText:{
        color: '#ffffff',
        fontSize: 18
      },
});


export default Sensors;