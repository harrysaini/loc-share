import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
  ListView,
  LayoutAnimation,
  Linking,
  AsyncStorage,
  TouchableHighlight
} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import LocationList from '../components/LocationList';
import RenameModal from '../components/RenameModal';
import MapModal from '../components/MapModal';
import AddLocation from './AddLocation';
import LocationDetail from './LocationDetail';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";


var STORAGE_KEY = '@MySuperStore:key';


class LocationSaver extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      buttonDisable: true,
      buttonTitle: 'Loading your location....',
      lastPosition: {
        coords: {
          latitude: 30.7680, 
          longitude: 76.7827
        }
      },
      locationsArray: {
        locations: [
        ]
      },
    
      messages: [],
      initialPosition: 'uknown',
     
      //rename modal
      modalIsVisible: false,

      locationServices : true,

      //is used to find the item on the array of locations and change its name on save
      locationIndexInModal: '0',
      //Map modal visibility
      isMapModalVisible: false,
      // this will get true when user clicks find location inside modal
      modalMarkerLocation: 0,
      // the location that rename modal shows
      modalLocationName: 'Dummy Location',

      isAddLocationModalVisible : false,

      isLocationDetailModalVisible : false,

      newLocationValue : {
        coords: {
          latitude: 30.7680, 
          longitude: 76.7827
        }
      },
      detailsDisplayLocation : {
        coords: {
          latitude: 30.7680, 
          longitude: 76.7827
        },
        details : {}
      },
      syncBtnText : 'Sync',
      syncBtnDisabled : false
      
    };
  }

  

  watchID: ?number = null;

  componentDidMount() {
    this._loadInitialState().done();
    this._findUserPosition();
    this._fetchSyncLocations();
  }

  _loadInitialState = async () => {
    //try to find locations from localstorage
    try {
      var value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value !== null){
        //setting the state will trigger the render inside the list
        this.setState({
          locationsArray: {
            locations: JSON.parse(value)
          }
        });
        this._appendMessage('Recovered selection from disk: ' + value);
      }
      else {
        this._appendMessage('Initialized with no selection on disk.');
      }
    } catch (error) {
      this._appendMessage('AsyncStorage error: ' + error.message);
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  _findUserPosition = (e) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = position;
        this.setState({
          initialPosition,
          lastPosition: position
        });
        this._enableTheButton();
        // if e exists then the call is from inside the map modal
        if (typeof e !== "undefined") {
          this.setState({
            modalMarkerLocation: initialPosition
          })
        }
      },
      (error) => {
        console.log('inside error', error);
        this.setState({
          locationServices: false
        });
      },
      {timeout: 100000, maximumAge: 1000}
    );

    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = position;
      // TODO: check why allowing this console is run many times - might be from
      // the geolocation trying to find the exact location of the user
      // console.log(position);
      this.setState({
        lastPosition: position
      });
      this._enableTheButton();
    });
  }

  //enable the button and hide the yellow box
  _enableTheButton = () => {
    this.setState({
      buttonDisable: false,
      buttonTitle: 'Add my current location',
      locationServices: true
    });
  }

  // gets the location from geolocation and saves it to the location array
  _getLocation = () => {
    var lastPositionWithName = { ...this.state.lastPosition };
    lastPositionWithName["name"] = 'Location ' + parseInt(this.state.locationsArray.locations.length + 1);
    // var locations = this.state.locationsArray.locations;
    // locations.push(lastPositionWithName);
    // this.setState({
    //   locations: locations
    // });
    this.setState({
      newLocationValue : lastPositionWithName
    });
    this._closeMapModal();
    this._openAddLocationModal();

  }



  _locationsTouched = () => {
    this._saveLocationStorage(JSON.stringify(this.state.locationsArray.locations));
  }

  _saveLocationStorage = async (locations) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, locations)
      this._appendMessage('Saved selection to disk: ' + locations);
    } catch (error) {
      this._appendMessage('AsyncStorage error: ' + error.message);
    }
  }

  //gets the location from marker and saves it to the location array
  _getMarkerLocation = (location) => {
    //location parameter is the region object in the state of mapmodal
    var newMarkerLocation = {};
    newMarkerLocation["name"] = 'Marker Location ' + parseInt(this.state.locationsArray.locations.length + 1);
    newMarkerLocation["coords"] = { ...location }
    // var locations = this.state.locationsArray.locations;
    // locations.push(newMarkerLocation);
    // this.setState({
    //   locations: locations
    // });
    // this._locationsTouched();
    // // and finally close the modal
    this.setState({
      newLocationValue : newMarkerLocation
    });
    this._closeMapModal();
    this._openAddLocationModal();
  }

  _saveNewLocation = (locationObj) =>{
    this._closeAddLocationModal();
    var locations = this.state.locationsArray.locations;
    locations.push(locationObj);
    this.setState({
      locationsArray: {
        locations: locations        
      }
    });
    this._locationsTouched();
    
  }

  _deleteRow = async (rowID) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({
      locations: this.state.locationsArray.locations.splice(rowID, 1)
    });
    //save the new locations to local storage as well since we deleted a row
    this._locationsTouched();
  }

  _renameRow = (rowData, rowID) => {
    // first show the modal
    this._setModalVisible(true, rowID);
    // change the name inside the modal
    this.setState({
      modalLocationName: rowData.name
    })
  }

  _onClickRow = (rowData) => {
    this.setState({
      detailsDisplayLocation : rowData
    });
    this._openDetailsModal();
  }



  _setModalVisible = (visible, rowID) => {
    // as we open the rename modal we need to set visibility of modal to true
    // but also the index of that location inside the textinput so we know
    // which location we will edit later when user clicks save
    this.setState({
      modalIsVisible: visible,
      locationIndexInModal: rowID
    });
  }

  _modalLocationName = (name) => {
    // sets the location that will be inside the textinput
    // inside the modal
    this.setState({
      modalLocationName: name
    })
  }
  // this function is triggered when you click save inside the rename modal
  _renameLocation = (name) => {
    //hide the modal since you clicked save
    var indexed = this.state.locationIndexInModal;
    this._setModalVisible(false);
    // add the old array in a var
    var oldLocationArray = this.state.locationsArray.locations;
    oldLocationArray[indexed].name = name
    this.setState({
      oldLocationArray
    });
    //save the new locations to local storage as well
    this._locationsTouched();
  }

  _showMapModal = () => {
    this.setState({
      'isMapModalVisible': true
    })
  }

  _closeMapModal = () => {
    this.setState({
      'isMapModalVisible': false
    })
  }

  _appendMessage = (message) => {
    console.log(message);
    this.setState({messages: this.state.messages.concat(message)});
  }

  _openLocationSettings = () => {
    let self = this;
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
        ok: "YES",
        cancel: "NO"
    }).then(function(success) {
        self._findUserPosition();
        self.setState({
          locationServices: true
        });
    }).catch((error) => {
        console.log(error.message); // error.message => "disabled"
    });
  }

  _openAddLocationModal = ()=>{
    this.setState({
      isAddLocationModalVisible : true
    });
  }

  _closeAddLocationModal = ()=>{
    this.setState({
      isAddLocationModalVisible : false
    });
  }

  _openDetailsModal = ()=>{
    this.setState({
      isLocationDetailModalVisible : true
    });
  }

  _closeDetailsModal = ()=>{
    this.setState({
      isLocationDetailModalVisible : false
    });
  }


  _syncError = (message)=>{
    this.setState({
        syncBtnText : 'Sync',
        syncBtnDisabled  : false
      });

    Alert.alert(
        "Sync Failed!",
         message ? message : "Something went wrong"
      )
  }

  _syncSucess =  ()=>{
    this.setState({
      syncBtnText : 'Sync successfull',
      syncBtnDisabled  : true
    });

    setTimeout(()=>{
      this.setState({
        syncBtnText : 'Sync',
        syncBtnDisabled  : false
      });
    }, 1000);
  }

  _syncLocations = () => {
      
      this.setState({
        syncBtnText : 'Syncing',
        syncBtnDisabled  : true
      });

      fetch(config.apiUrl+'/syncLocations', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization' : 'JWT '+ this.props.userToken
        },
        body: JSON.stringify({
          locations  : this.state.locationsArray.locations
        })

      }).then((response)=>{
        return response.json();
      }).then((data)=>{
        if(data.status==='success'){

          this._syncSucess();
        }else{
          this._syncError(data.message);
        }
      }).catch((err)=>{
        this._syncError(err.toString());
      });
  }

  _fetchSyncLocations = ()=>{
      fetch(config.apiUrl+'/fetchSyncLocations', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization' : 'JWT '+this.props.userToken
        }
      }).then((response)=>{
        return response.json();
      }).then((data)=>{
        if(data.locations){
          this.setState({
            locationsArray : {
              locations : data.locations
            }
          });
        }
      }).catch((err)=>{
        this._syncError(err.toString());
      });
  }


  _logout = ()=>{
    this.props.logoutUser();
  }

  render() {
    let self = this;
    var locationServicesStyle = {
      bottom: this.state.locationServices ? -100 : 0
    }


    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>
          Add your location instantly or from the Map Modal
        </Text>
        <View>
          <Button
            raised icon={{name: 'room'}}
            title={this.state.buttonTitle}
            buttonStyle={styles.button}
            onPress={this._getLocation}
            disabled={this.state.buttonDisable}
            accessibilityLabel="Add your location"
          />
          <Button
            title='Open Map Modal'
            buttonStyle={styles.button}
            onPress={this._showMapModal}
          />
           <Button
            title={this.state.syncBtnText}
            buttonStyle={styles.button}
            onPress={this._syncLocations}
            disabled={this.state.syncBtnDisabled}
          />
          <Button
            title="Logout"
            buttonStyle={styles.button}
            onPress={this._logout}
          />
        </View>
        <Text style={ styles.heading }>Your saved locations</Text>
        <View style={styles.locationListContainer}>
          <LocationList
            key={this._data}
            style={styles.locationList}
            dataSource={this.state.locationsArray.locations}
            onDelete={ this._deleteRow }
            onRename={ this._renameRow }
            onClickRow={ this._onClickRow }
          />
        </View>
        <View>
          <RenameModal
            isVisible={ this.state.modalIsVisible }
            setModalVisible={ this._setModalVisible }
            renameLocation={ this._renameLocation }
            locationName={ this.state.modalLocationName }
            onChangeCallback={ this._modalLocationName }
            />
        </View>

      {/*map model*/}
        <MapModal
          isMapModalVisible={ this.state.isMapModalVisible }
          closeMapModal={ this._closeMapModal }
          initialLatitude={ this.state.lastPosition.coords.latitude }
          initialLongitude={ this.state.lastPosition.coords.longitude }
          onFindLocation={
            (e) => {
              self._findUserPosition('callFromChild');
            }
          }
          onAddLocation={ this._getMarkerLocation }
          onFindLocationTriggered={ this.state.modalMarkerLocation }
          userLocation={ this.state.lastPosition }
        />

        <AddLocation 
          isAddLocationModalVisible={this.state.isAddLocationModalVisible}
          closeAddLocationModal={this._closeAddLocationModal}
          newLocationValue={this.state.newLocationValue}
          saveNewLocation={this._saveNewLocation}

          />

        <LocationDetail
          location = {this.state.detailsDisplayLocation}
          closeDetailsModal = {this._closeDetailsModal}
          isLocationDetailModalVisible = {this.state.isLocationDetailModalVisible}

          />




        
      <TouchableHighlight
        onPress={ this._openLocationSettings }
        style={[styles.locationNotificationBox, locationServicesStyle]}
        underlayColor={ '#f8b03a' }
      >
        <View style={styles.locationNotificationBoxInner}>
          <Icon
            name="alert"
            type="foundation"
            color='#f50'
            size={30}
            iconStyle={styles.locationBoxIcon}
          />
          <Text style={styles.locationNotificationBoxText}>
            Your location is disabled.{"\n"}
            Tap to enable.
          </Text>
        </View>
      </TouchableHighlight>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10
  },
  locationListContainer: {
    flex: 1,
    alignSelf: 'stretch'
  },
  locationList: {
    alignSelf: 'stretch'
  },
  button: {
    backgroundColor: '#00998a',
    borderRadius: 5,
    marginTop: 10
  },
  locationNotificationBox: {
    backgroundColor: '#ff4d4d',
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    position: 'absolute',
    bottom: 0,
    left:0,
    right: 0
  },
  locationNotificationBoxText: {
    color: '#ffffff',
    fontWeight: 'bold',
    paddingLeft: 20
  },
  locationBoxIcon: {
    color: '#ffffff'
  },
  locationNotificationBoxInner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingLeft: 20
  },
  heading: {
    'paddingTop': 40,
    'textAlign': 'center',
    'fontSize': 20,
  },
  smallNote: {
    'fontSize': 10,
    'fontStyle': 'italic',
  }
});

export default LocationSaver;
