import  React  from 'react';
import { StyleSheet, Text, View ,TouchableHighlight , StatusBar ,  TouchableNativeFeedback,
			ScrollView , Modal } from 'react-native';
import {Button , FormLabel , FormInput} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView from 'react-native-maps';

export default class AddLocation extends React.Component {


	constructor(props){
		super(props);
		this.state = {
	      firstTime: true,
	      region: {
	        latitude: 36.6,
	        longitude: 37.6,
	        latitudeDelta: 0.015,
	        longitudeDelta: 0.0121,
	      },
	      markerPosition: {
	        latitude: 'undefined',
	        longitude: 'undefined'
	      },
	      title : '',
	      description : '',
	      story : ''
	  }

	}

	componentWillReceiveProps(nextProps){
	    if (nextProps.newLocationValue.coords.latitude !== this.state.markerPosition.latitude || nextProps.newLocationValue.coords.latitude !== this.state.markerPosition.longitude) {
	      this.setState({
	        region: {
	          ...this.state.region,
	          latitude: nextProps.newLocationValue.coords.latitude,
	          longitude: nextProps.newLocationValue.coords.longitude
	        },
	        markerPosition : {
        	  latitude: nextProps.newLocationValue.coords.latitude,
	          longitude: nextProps.newLocationValue.coords.longitude
	        },
	        title : nextProps.newLocationValue.name

	      });
	    }
  }

  _saveLocation = () => {
  	var locationObj = {
  		coords : this.state.markerPosition,
  		name : this.state.title,
  		details : {
  			title : this.state.title,
  			description : this.state.description,
  			story : this.state.story
  		},
  		created : (new Date()).toDateString()
  	};

  	this.props.saveNewLocation(locationObj);
  }

	render() {
		let markerLocation = this.state.markerPosition.latitude !== 'undefined' ? this.state.markerPosition : this.state.region ;

		return (


			<Modal
		        animationType={"fade"}
		        transparent={false}
		        visible={this.props.isAddLocationModalVisible}
		        onRequestClose={() => {}}
		        hardwareAccelerated= {true}
		     >

				<View style={styles.container}>


					<View style={styles.topBar}>
			      		<TouchableNativeFeedback style={styles.round} onPress={this.props.closeAddLocationModal} >
			      			<View style={styles.absoluteTopCorner}>
					      		<Icon name="long-arrow-left" style={styles.iconBtn}>
					      		</Icon>
				      		</View>
			      		</TouchableNativeFeedback>
			      		<Text style={styles.heading} >Add new location</Text>
			      	</View>

			      	<ScrollView  style={styles.content}>

			      		<MapView
			             ref = {(mapView) => { _mapView = mapView; }}
			             region={this.state.region}
			             showsUserLocation={true}
			             showsMyLocationButton={false}
			             toolbarEnabled={false}
			             moveOnMarkerPress={true}
			             followsUserLocation={false}
			             showsCompass={false}
			             style={styles.map}             
			            >	
			            	<MapView.Marker
				               coordinate={markerLocation}
				               title='Save this location'				               
				             />
           
			          
			       		 </MapView>

					
				      	<View style={styles.singleForm}>
							<FormLabel>Title</FormLabel>
							<FormInput 
								onChangeText={(text) => this.setState({ title : text})}
							 />
						</View>

						<View style={styles.singleForm}>
							<FormLabel>Description</FormLabel>
							<FormInput 
								onChangeText={(text) => this.setState({description : text})}
							/>
						</View>

						<View style={styles.singleForm}>
							<FormLabel>Story</FormLabel>
							<FormInput 
								onChangeText={(text) => this.setState({story : text})}
								multiline={true}
								inputStyle ={styles.story}
							/>
						</View>

						<View style={styles.singleForm}>
							<Button
					            raised icon={{name: 'save'}}
					            title='Save'
					            accessibilityLabel="Save location"
					            buttonStyle = {styles.saveBtn}
					            onPress = {this._saveLocation}
					         />
						</View>

						
					
					</ScrollView>

					</View>
			</Modal>
			);
	}
}


const styles = StyleSheet.create({
	container : {
		...StyleSheet.absoluteFillObject,
		flex : 1,
		backgroundColor : 'white'
	},
	content : {
		flex : 1
	},
	heading : {
		fontWeight : 'bold',
		fontSize : 20
	},
	topBar : {
		backgroundColor : 'white',
		flexDirection : 'row',
		padding : 10,
		elevation : 4,
		position : 'relative',
		paddingLeft : 50
	},
	absoluteTopCorner : {
		position : 'absolute',
		top : 10,
		left : 5,
	},
	absoluteLeftCorner : {
		position : 'absolute',
		top : 5,
		right : 5
	},
	iconBtn : {
		fontSize : 17,
		color : 'black',
		padding : 7,
		borderRadius : 100
	},
	round:{
		borderRadius : 100
	},
	story : {
		height : 85
	},
	singleForm : {
		margin : 5
	},
	saveBtn : {
		margin : 10,
		marginBottom : 10
	},
	map:{
		height : 200,
		margin : 0
	}
	

});


