import  React  from 'react';
import { StyleSheet, Text, View , ActivityIndicator } from 'react-native';

export default class StartScreen extends React.Component {
  render() {
    return (
      <View style={styles.start_screen}>
      	<Text style={styles.heading} >Loc-Share</Text>
      	<Text style={styles.subHeading1}>Save and share your location with friends</Text>
      	<Text style={styles.subHeading}>by: A-H-P-S group </Text>
      	<ActivityIndicator 
      		size='large'
      	/>
      </View>
    );
  }
}


const styles = StyleSheet.create({
	start_screen : {
		flex : 1,
		justifyContent : 'center',
		backgroundColor : 'black',
		alignItems : 'center'
	},
	heading : {
		fontSize : 45,
		fontWeight : 'bold',
		margin : 25,
		color : 'white'
	},
	subHeading1 : {
		fontSize : 17,
		marginBottom  : 20,
		color : 'white'
	},
	subHeading : {
		fontSize : 17,
		marginBottom  : 70,
		color :'white'
	}
});


