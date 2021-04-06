import React from "react";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import FormList from '../Components/Form/FormList';
import FormDescription from '../Components/Form/FormDescription';
import Form from '../Components/Form/Form';
import UserLocation from '../Components/Location/UserLocation';
import LocationHistory from '../Components/Location/LocationHistory';
import Sensors from '../Components/Sensors/Sensors';
import Record from '../Components/Sensors/Record';
import { Icon, Text } from "react-native-elements";
import { StyleSheet } from 'react-native';
import RecordHistory from "../Components/Sensors/RecordHistory";

//Top bar navigator
const TabNavigator = createMaterialTopTabNavigator(
    {
        Location: {
            screen: UserLocation
        },
        Forms: {
            screen: FormList
        },
        Sensors: {
            screen: Sensors
        }
    },
    {
        navigationOptions:{
            headerShown: false,
        },
        tabBarOptions: {
            style: {backgroundColor: '#ffffff', paddingTop:'8%', height:'10%', height: 'auto'}, //borderBottomLeftRadius: 80
            labelStyle: { color: '#000000'},
            indicatorStyle: { backgroundColor: '#ababab'},
            showLabel: true,
            showIcon: true,
            
        },
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: () => {
                const { routeName } = navigation.state; //Name of the route
                let iconName; //icon display on the top of the title tab
                //Select the good icon for the tab
                if (routeName === "Forms") {
                    iconName = "message-circle";
                } else if (routeName === "Location") {
                    iconName = "map-pin";
                } else if (routeName === "Sensors") {
                    iconName = "radio";
                }
                //Display icon tab
                return <Icon name={iconName} type="feather"/>;
            },
            tabBarLabel: () => {
                const { routeName } = navigation.state; //Name of the route
                //Display the title of each route
                return <Text style={styles.text} >{routeName}</Text>;
            }
          })
    },
    
);

//Stack navigator
const StackNavigator = createStackNavigator(
    {
        Forms: {
            screen: TabNavigator,
        },
        Description: {
            screen: FormDescription
        },
        Form: {
            screen: Form
        },
        LocationHistory:{
            screen: LocationHistory
        },
        Record:{
            screen: Record
        },
        RecordHistory:{
            screen: RecordHistory
        },
    }
);

const styles = StyleSheet.create({
    text: {
        marginTop: 5
    }
});


export default createAppContainer(StackNavigator);