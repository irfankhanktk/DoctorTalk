import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'

const CustomeSearchBar = ({ placeholder, onChangeText, value }) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerView}>
        <View style={{ marginRight: 5 }}>
          <AntDesign name='search1' size={15}/>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder ? placeholder : 'Search here'}
          onChangeText={onChangeText}
          value={value}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 55,
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 10,
    borderBottomWidth: 1,
    backgroundColor: '#f7f7f7',
  },
  containerView: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 30,
    padding: 10,
  },
  textInput: {
    width: '90%',
    height: 40,
    fontSize: 15,
    // padding: 5,
  },
});

export { CustomeSearchBar };
