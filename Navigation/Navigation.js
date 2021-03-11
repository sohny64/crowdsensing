import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import FormList from '../Components/Form/FormList';
import FormDescription from '../Components/Form/FormDescription';
import Form from '../Components/Form/Form';

const FormStackNavigator = createStackNavigator({
    Forms: {
        screen: FormList,
        navigationOption: {
            title: "Forms"
        }
    },
    Description: {
        screen: FormDescription
    },
    Form: {
        screen: Form
    }
});

export default createAppContainer(FormStackNavigator);