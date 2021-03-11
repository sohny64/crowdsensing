import React from 'react'
import { StyleSheet, FlatList } from 'react-native'
import forms from '../../Helpers/FormData'
import FormListItem from './FormListItem';

class FormList extends React.Component{
    displayFormDescription = (form) => {
        this.props.navigation.navigate("Description", { form: form });
    }

    render(){
        return(
            <FlatList
                style={styles.main_container}
                data={forms}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => <FormListItem form={item} displayFormDescription={this.displayFormDescription}/>}
            />
        );
    };
}

const styles = StyleSheet.create({
    main_container: {
        backgroundColor: '#97a0ad',
        width: '100%'
    }
});

export default FormList;