import  React from 'react';
import { StyleSheet, View ,Text ,TouchableNativeFeedback ,AsyncStorage , Alert} from 'react-native';
import {Button , FormLabel , FormInput , FormValidationMessage} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import config from '../variables';


export default class LoginRegister extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			username : '',
			password : '',
			username_signup : '',
			password_signup : '',
			confirmPassword : '',
			doesPasswordmatch : false,
			changeConfirmText : false,
			displayedComponent : 'login',
			loading : false
		}
	}

	_confirmPasswordTextChange =  (text)=>{
		if(text!==this.state.password_signup){
			this.setState({
				confirmPassword : text,
				doesPasswordmatch : false,
				changeConfirmText : true
			});
		}else{
			this.setState({
				confirmPassword : text,
				doesPasswordmatch : true,
				changeConfirmText : true
			})
		}
	}


	_loginError = (message)=>{
		Alert.alert(
        "Login Failed!",
         message ? message : "Something went wrong"
      )
	}

	_signupError = (message)=>{
		Alert.alert(
        "SignUp Failed!",
         message ? message : "Something went wrong"
      )
	}

	_toggleLoader = (flag)=>{
		this.setState({
			loading : flag
		});
	}


	_loginUser = ()=>{
		var userData ;
		if(!this.state.username || !this.state.password){
			return;
		}
		this._toggleLoader(true);

		fetch(config.apiUrl+'/signin', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		    username : this.state.username,
		    password : this.state.password,
		  })

		}).then((response) => {

			this._toggleLoader(false);
		  	return response.json();

		  }).then((data)=>{
		  	
		  	if(data.token && data.username){
		  		userData = data;
		  		return AsyncStorage.multiSet([
		  			['token' , data.token],
		  			['username' , data.username]
		  			]);
		  		
		  	}else{
		  		throw new Error(data.message);
		  	}

		  }).then(()=>{
		  	this.props.userHasLoggedIn(userData.token , userData.username);
		  }).catch((err)=>{
		  	
		  	this._toggleLoader(false);	
		  	this._loginError(err.toString());
		  });
	
	}


	_registerUser = ()=>{
		var userData ; 
		if(!this.state.username_signup || !this.state.password_signup || !this.state.doesPasswordmatch){
			return;
		}
		this._toggleLoader(true);

		fetch(config.apiUrl+'/signup', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		    username : this.state.username_signup,
		    password : this.state.password_signup,
		  })

		}).then((response) => {

			this._toggleLoader(false);
		  	return response.json();

		  }).then((data)=>{
		  	
		  	if(data.token && data.username){
		  		userData = data;
		  		return AsyncStorage.multiSet([
		  			['token' , data.token],
		  			['username' , data.username]
		  			]);
		  	}else{
		  		throw new Error(data.message);
		  	}

		  }).then(()=>{
		  	this.props.userHasLoggedIn(userData.token , userData.username);
		  }).catch((err)=>{
		  	
		  	this._toggleLoader(false);	
		  	this._signupError(err.toString());
		  });


	}

	_showLogin = ()=>{
		this.setState({
			displayedComponent : 'login'
		});
	}

	_showRegister = ()=>{
		this.setState({
			displayedComponent : 'register'
		})
	}

	
	render() {

		var loginJsx =  (

					<View>

						<View style={styles.topBar}>
							<Text style={styles.heading}>Loc-Share Login</Text>
						</View>

						<View style={styles.content}>
					
							<View style={styles.singleForm}>
									<FormLabel>Username</FormLabel>
									<FormInput 
										onChangeText={(text) => this.setState({ username : text})}
									 />
							</View>

							<View style={styles.singleForm}>
									<FormLabel>Password</FormLabel>
									<FormInput 
										onChangeText={(text) => this.setState({ password : text})}
										secureTextEntry = {true}
									 />
							</View>

							<View style={styles.singleForm}>
									<Button
							            raised 
							            title='Login'
							            accessibilityLabel="Login button"
							            buttonStyle = {styles.saveBtn}
							            onPress = {this._loginUser}
							            disabled = {this.state.loading}
							         />
							</View>

							<View style={[styles.singleForm , styles.center]}>
									<TouchableNativeFeedback onPress={this._showRegister}>
										<Text>Create new account</Text>
									</TouchableNativeFeedback> 
							</View> 
						</View>

					</View>

			
			);

		var errorMsg = '';
		if(!this.state.doesPasswordmatch&&this.state.changeConfirmText){
		   errorMsg = "Password doesn't match"	;		
		}

		var registerJSX =  (

					<View>

						<View style={styles.topBar}>
							<Text style={styles.heading}>Loc-Share Register</Text>
						</View>

						<View style={styles.content}>
					
							<View style={styles.singleForm}>
									<FormLabel>Username</FormLabel>
									<FormInput 
										onChangeText={(text) => this.setState({ username_signup : text})}
									 />
							</View>

							<View style={styles.singleForm}>
									<FormLabel>Password</FormLabel>
									<FormInput 
										onChangeText={(text) => this.setState({ password_signup : text , doesPasswordmatch : false})}
										secureTextEntry = {true}
										value = {this.state.password_signup}
									 />
							</View>

							<View style={styles.singleForm}>
									<FormLabel>Confirm Password</FormLabel>
									<FormInput 
										onChangeText={this._confirmPasswordTextChange}
										secureTextEntry = {true}
									 />
									<Text style={styles.inputError}>{errorMsg}</Text>

							</View>

							<View style={styles.singleForm}>
									<Button
							            raised 
							            title='Register'
							            accessibilityLabel="Register button"
							            buttonStyle = {styles.saveBtn}
							            onPress = {this._registerUser}
							            disabled = {this.state.loading}
							         />
							</View>

							<View style={[styles.singleForm , styles.center]}>
									<TouchableNativeFeedback onPress={this._showLogin} >
										<Text>Sign in</Text>
									</TouchableNativeFeedback> 
							</View> 
						</View>

					</View>

			
			);

		var displayedComponent;

		if(this.state.displayedComponent == 'login'){
			displayedComponent = loginJsx;
		}else{
			displayedComponent = registerJSX;
		}

		return (
			<View style={styles.container} >
				{displayedComponent}
			</View>
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
		marginTop : 25,
		alignSelf : 'stretch',
		justifyContent : 'center'
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
		alignItems : 'center',
		justifyContent : 'center'
	},
	
	singleForm : {
		margin : 5
	},
	center:{
		alignItems : 'center'
	},
	saveBtn : {
		margin : 10,
		marginBottom : 10
	},
	inputError : {
		fontSize : 12,
		marginLeft : 15,
		color : 'red'
	}
	

});


