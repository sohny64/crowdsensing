import React from 'react'
import { View } from 'react-native';
import { StyleSheet, FlatList } from 'react-native'
import forms from '../../Helpers/formData'
import FormListItem from './FormListItem';

class FormList extends React.Component{
    displayFormDescription = (form) => {
        this.props.navigation.navigate("Description", { form: form });
    }

    render(){
        return(
            <View style={styles.main_container}>
                <FlatList
                style={styles.forms_list}
                data={forms}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => <FormListItem form={item} t={item+1} displayFormDescription={this.displayFormDescription}/>}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#441d59',
    }
});

export default FormList;