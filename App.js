import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';
import MyLocationsApp from './src/components/MyLocationsApp';


export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <MyLocationsApp />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
