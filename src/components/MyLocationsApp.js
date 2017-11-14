import  React from 'react';
import { StyleSheet, View ,AsyncStorage , Alert} from 'react-native';
import StartScreen from './StartScreen';
import commonStyles from '../styles/commonStyles.js';
import LocationSaver from './LocationSaver.js';
import LoginRegister from './LoginRegister';

var STORAGE_KEY = '@MySuperStore:key';

export default class MyLocationsApp extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			renderComponent : 'startScreen',
			isUserLoggedIn : false,
			userToken : '',
			userName : ''
		}
	}

	componentDidMount = () => {
		this._getUserData();
	}


	_getUserData = ()=>{
		
		AsyncStorage.multiGet(['token' , 'username']).then((data)=>{
			var token = data[0][1];
			var username = data[1][1];
			if(token&&username){
				this._userHasLoggedIn(token , username);
			}else{
				this.setState({
					isUserLoggedIn : false,
					renderComponent : 'login'
				});
			}
			
		}).catch((err)=>{
			Alert.alert(
				'error',
				err.toString()
				);
		});
	}


	_userHasLoggedIn = (token , userName)=>{
		this.setState({
			isUserLoggedIn : true,
			userToken : token,
			userName : userName,
			renderComponent : 'main-app'
		})
	}

	logoutUser = ()=>{
		AsyncStorage.multiRemove(['token' , 'username' , STORAGE_KEY]).then(()=>{
			this.setState({
				isUserLoggedIn : false,
				renderComponent : 'login'
			});
		});
	}
	
	render() {

		var componentToRender ; 

		if(this.state.renderComponent==='login'){
			componentToRender = (
				<LoginRegister 
					userHasLoggedIn = {this._userHasLoggedIn}
				/>
				);
		}else if(this.state.renderComponent==='startScreen'){
			componentToRender = (
				<StartScreen />
				);
		}else if(this.state.renderComponent==='main-app'){
			componentToRender = (
				<LocationSaver 
					userToken = {this.state.userToken}
					userName = {this.state.userName}
					logoutUser = {this.logoutUser}
				/>
				);
		}

		return (
			<View style={commonStyles.container} >
				{componentToRender}
			</View>
			);
	}
}

