import  React  from 'react';
import { 
	StyleSheet, 
	Text, 
	View ,
	ActivityIndicator , 
	StatusBar ,
	TouchableNativeFeedback ,
	ScrollView ,
	TouchableHighlight,
	Share, 
	Modal,
	Linking
} from 'react-native';
import { Button ,  Icon1} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView from 'react-native-maps';

export default class LocationDetail extends React.Component {

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
	      }
	  }
	}

	componentWillReceiveProps(nextProps){
	    if (nextProps.location.coords.latitude !== this.state.markerPosition.latitude || nextProps.location.coords.latitude !== this.state.markerPosition.longitude) {
	      this.setState({
	        region: {
	          ...this.state.region,
	          latitude: nextProps.location.coords.latitude,
	          longitude: nextProps.location.coords.longitude
	        },
	        markerPosition : {
        	  latitude: nextProps.location.coords.latitude,
	          longitude: nextProps.location.coords.longitude
	        },
	        title : nextProps.location.name

	      });
	    }
	}


	onShareClick = ()=>{

		var locationObject = this.props.location;
		var url = 'http://maps.google.com/?q=' + locationObject.coords.latitude + ',' + locationObject.coords.longitude;

		var message = `*${this.props.location.details.title}*\n${this.props.location.details.description}\n${url}`;

		Share.share({
		    message: message,
		    url: url,
		    title: 'See this location'
		  }, {
		    // Android only:
		    dialogTitle: 'Share this location',
		    // iOS only:
		    excludedActivityTypes: [
		      'com.apple.UIKit.activity.PostToTwitter'
		    ]
		  });
	}


	_onNavigateClick = ()=>{
		var locationObject = this.props.location;
		var url = 'http://maps.google.com/?q=' + locationObject.coords.latitude + ',' + locationObject.coords.longitude;

	    Linking.canOpenURL(url).then(supported => {
	      if (!supported) {
	        console.log('Can\'t handle url: ' + url);
	      } else {
	        console.log(supported);
	        return Linking.openURL(url);
	      }
	    }).catch(err => console.error('An error occurred', err));
	}


  render() {

	let markerLocation = this.state.markerPosition.latitude !== 'undefined' ? this.state.markerPosition : this.state.region ;

    return (

		<Modal
	        animationType={"fade"}
	        transparent={false}
	        visible={this.props.isLocationDetailModalVisible}
	        onRequestClose={() => {}}
	        hardwareAccelerated= {true}
	     >
		      <View style={styles.container}>

		      	<ScrollView style={styles.content}>	

			      	<View style={styles.topBar}>
			      		<TouchableNativeFeedback style={styles.round} onPress={this.props.closeDetailsModal} >
			      			<View style={styles.absoluteTopCorner}>
					      		<Icon name="long-arrow-left" style={styles.iconBtn}>
					      		</Icon>
				      		</View>
			      		</TouchableNativeFeedback>
			      		<Text style={styles.heading} >{this.props.location.name}</Text>
			      	</View>
			      	<View>

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
				               title={this.props.location.details.title}				               
				             />
				          
				        </MapView>

				        <View style={styles.details}>  	
				        	
				        	<View style={styles.row}>
				        		<Icon name="info-circle" style={styles.icon} >
						      	</Icon>
					      		<Text style={styles.subHeading}>{this.props.location.details.description}</Text>
				      		</View>

					      	<View style={styles.row}>
						      	<Icon name="comment-o" style={styles.icon}>
						      	</Icon>
						      	<Text style={styles.story}>{this.props.location.details.story}</Text>
					      	</View>

					      	<View style={styles.row}>
						      	<Icon name="calendar" style={styles.icon}>
						      	</Icon>
					      		<Text> {this.props.location.created ? this.props.location.created  : ''}</Text>
				      		</View>
				      	</View>
			      	</View>

		      	</ScrollView>
		      	
		      	<View style={styles.btnWrapper}>
		      		<View style={styles.footerButtonWrapper}>
		      			<TouchableNativeFeedback onPress={this.onShareClick}>
		      				<View style={[styles.myBtn , styles.shareBtn]}>
			      				<Icon name="share-alt" style={styles.btnTextIcon} >
			      				</Icon>
				            	<Text style={styles.btnText}>Share</Text>
			            	</View>
		            	</TouchableNativeFeedback>
			         </View>
			         <View style={styles.footerButtonWrapper}>
			         	<TouchableNativeFeedback  onPress={this._onNavigateClick}>
			         		<View style={[styles.myBtn , styles.navigateBtn]}>
				         		<Icon name="location-arrow" style={styles.btnTextIcon}>
			      				</Icon>
				         		<Text  style={styles.btnText}>Navigate</Text>
			         		</View>
		         		</TouchableNativeFeedback>
			         </View>

		      	</View>
		      </View>
	      </Modal>
    );
  }
}


const styles = StyleSheet.create({
	container : {
		...StyleSheet.absoluteFillObject,
		flex : 1
	},
	content : {
		flex : 1,
		backgroundColor : '#f5f5f5',
		alignSelf : 'stretch'
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
	icon:{
		fontSize : 15,
		color : 'black',
		padding : 5,
		marginRight : 10,
		borderRadius : 100
	},
	round:{
		borderRadius : 100
	},
	btnWrapper : {
		backgroundColor : 'white',
		elevation : 4,
		height : 50,
		flexDirection : 'row',
		justifyContent : 'center'
	},
	footerButtonWrapper : {
		alignSelf : 'stretch',
		alignItems : 'center',
		backgroundColor : 'white',
		flex : 1,
		margin : 0

	},
	btnText:{
		color : ' #008080'
	},
	myBtn : {
		alignSelf : 'stretch',
		flex: 1,
		padding : 7,
		flexDirection : 'row',
		alignItems : 'center',
		justifyContent : 'center',
		borderWidth : 0
	},
	navigateBtn : {
		borderLeftColor : '#ccffff',
		borderLeftWidth : 1
	},
	shareBtn : {
		borderRightColor : '#ccffff',
		borderRightWidth : 1
	},
	btnText : {
		justifyContent : 'center',
		fontSize : 16

	},
	btnTextIcon : {
		margin : 5,
		fontSize : 16

	},
	map:{
		height : 200,
		margin : 0
	},
	details : {
		padding : 15
	},
	subHeading:{
		fontSize : 18,
		fontWeight : 'bold',
	},
	story : {
		fontSize : 15
	},
	row : {
		flexDirection : 'row',
		marginTop : 20
	}

})


