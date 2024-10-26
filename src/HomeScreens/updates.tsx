import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Updates = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Updates Screen</Text>
      {/* Add your custom Updates design here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181818',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});

export default Updates;