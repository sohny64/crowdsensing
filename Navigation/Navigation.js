import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import FormList from '../Components/Form/FormList';
import FormDescription from '../Components/Form/FormDescription';
import Form from '../Components/Form/Form';
import UserLocation from '../Components/Location/UserLocation'
import LocationHistory from '../Components/Location/LocationHistory'
import Sensors from '../Components/Sensors/Sensors'
import Record from '../Components/Sensors/Record'


const TabNavigator = createMaterialTopTabNavigator(
    {
        Forms: {
            screen: FormList
        },
        Location: {
            screen: UserLocation
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
            style: {backgroundColor: '#ffffff', paddingTop:'8%', height:'10%'}, //borderBottomLeftRadius: 80
            labelStyle: { color: '#000000'},
            indicatorStyle: { backgroundColor: '#ababab'},
        }
        
    }
);

const FormStackNavigator = createStackNavigator(
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
        }
    }
);


export default createAppContainer(FormStackNavigator);