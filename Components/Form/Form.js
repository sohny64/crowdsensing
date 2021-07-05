import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Toast from 'react-native-easy-toast';
import AudioRecorder from './RecorderSensor/AudioRecorder';
import ImagePicker from './RecorderSensor/ImagePicker';
import PressureRecorder from './RecorderSensor/PressureRecorder';
import {parse, stringify} from 'flatted';
import moment from 'moment';

class Form extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      answers: {},
    }
    this.getAnswer = this.getAnswer.bind(this);
  }

  _displayFormList = () => {
    //Return to FormList sreen
    this.props.navigation.navigate("Forms");
  }

  getAnswer = (answer, question) => {
    //Add the aswer param to the answers
    const answers = this.state.answers;
    answers[question.name] = answer;
    this.setState({ answers: answers });
  }


  _submitForm(){
    //console.log(JSON.stringify(this.state.answers));

    const obj = {
      pollution: this.state.answers.pollutionInCity
    };

    const json = JSON.stringify(obj);
    const blob = new Blob([json], {type : 'application/json'});

    const data = new FormData();
    data.append("image", blob);

    var date = moment()
    .utcOffset(60)
    .format('MM-DD-YYYY hh:mm:ss');


    //pressure: this.state.answers.pressure.toString() + " Pa",
    fetch("http://dev.opencems.fr:3000/",{
      method:"post",
      body: JSON.stringify({
        user_id: Math.floor(Math.random() * 100) + 1,
        device_id: Math.floor(Math.random() * 100) + 1210,
        sensors:{
          pressure: this.state.answers.pressure.toString() + " Pa",
        },
        datetime: date,
      }),
      headers:{
        'Content-Type': 'application/json',
      },
    })
    .then(res=>res.text())
    .then(data=>{
      Alert.alert(`Data saved successfully`)
      this.props.navigation.navigate("FormList")
    })
    .catch(err=>{
      Alert.alert("Something went wrong")
      console.log(err);
    })
    //Show a toast to inform the user that the form is submitted
    this.toast.show('Form submitted !');

    //Wait 500ms that the toast has been shown
    setTimeout(() => {  this._displayFormList(); }, 500);

  }


  _displayQuestionsForm(form){
    var input; //Input use to get data from the user
    return(
      //Get all questions from the form
      form.questions.map((question, index) => {
        //Get input type
        switch (question.type) {
          case "text":
          input = <TextInput
          style={styles.text_input}
          returnKeyType="done"
          multiline={true}
          blurOnSubmit={true}
          onSubmitEditing={()=>{Keyboard.dismiss()}}
          onChangeText={(answer) => this.getAnswer(answer, question)}
          />
          break;

          case "audioRecord":
          input = <AudioRecorder question={question} getAnswer={this.getAnswer}/>
          break;

          case "image":
          input = <ImagePicker question={question} getAnswer={this.getAnswer}/>
          break;

          case "pressure":
          input = <PressureRecorder question={question} getAnswer={this.getAnswer}/>
          break;

          default:
          break;
        }
        //Display data title and his input
        return(
          <View style={styles.container} key={index}>
          <Text style={styles.title_question}> {question.title} </Text>
          {input}
          </View>
        );
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
      <ScrollView>
      <View style={styles.container}>
      <Text style={styles.subhead}>Description</Text>
      <Text style={styles.text}>{form.description}</Text>
      </View>
      {this._displayQuestionsForm(form)}
      <TouchableOpacity style={styles.button} onPress={() => this._submitForm()}>
      <Text style={styles.text_button}>Submit</Text>
      </TouchableOpacity>
      </ScrollView>
      <Toast ref={(toast) => this.toast = toast}/>
      </View>

    );
  };
}

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: '#2c3a4e',
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
  container: {
    backgroundColor: '#1a2029',
    borderRadius: 20,
    margin: 10,
    padding: 10
  },

  title_question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5
  },
  text: {
    color: '#ffffff'
  },
  text_input: {
    color: '#ffffff',
    backgroundColor: '#000',
    borderRadius: 20,
    fontSize: 16,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5
  },
  button: {
    padding: 10,
    backgroundColor: '#1a2029',
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    width: '60%',
    marginTop: 'auto',
    marginBottom: 20
  },
  text_button:{
    color: '#ffffff',
    fontSize: 20
  },
});

export default Form;
