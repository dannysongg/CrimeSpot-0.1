import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import MapView from 'react-native-maps';
import {createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import BottomNavigation, {
  FullTab,
} from 'react-native-material-bottom-navigation';
import Geolocation from '@react-native-community/geolocation';

class MapScreen extends Component {
  state = {
    dangerPoints: [],
    theftPoints: [],
    parkingPoints: [],
    trafficPoints: [],
    userLatitude: '-37.3337',
    userLongitude: '-121.8907',
    userLocationFound: false,
    loading: true,
    activeTab: 'Danger',
    gotDanger: false,
    gotTheft: false,
    gotParking: false,
    gotTraffic: false,
  };

  async requestUserLocation() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(position => {
          const latitude = JSON.stringify(position.coords.latitude);
          const longitude = JSON.stringify(position.coords.longitude);
          this.setState({
            userLatitude: latitude,
            userLongitude: longitude,
            userLocationFound: true,
          });
          console.log(latitude);
          console.log(longitude);
        });
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn("jdlkafs");
    }
  }

  render() {
    console.disableYellowBox = true;
    if (!this.state.userLocationFound) {
      this.requestUserLocation();
    }
    if (!this.state.gotDanger) {
      this.state.gotDanger = true;
      this.getDangerData();
    }
    if (this.state.loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!this.state.userLocationFound) {
      // console.log("fdsl");
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
    
    var points;

    if (this.state.activeTab == 'Danger') {
      points = this.state.dangerPoints;
    }
    if (this.state.activeTab == 'Theft') {
      points = this.state.theftPoints;
    }
    if (this.state.activeTab == 'Parking') {
      points = this.state.parkingPoints;
    }
    if (this.state.activeTab == 'Traffic') {
      points = this.state.trafficPoints;
    }

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            // 37.3337, -121.8907
            latitude: parseFloat(this.state.userLatitude),
            longitude: parseFloat(this.state.userLongitude),
            latitudeDelta: 0.19,
            longitudeDelta: 0.1121,
          }}>
          <MapView.Heatmap
            points={points}
            opacity={0.6}
            radius={15}
            maxIntensity={50}
            gradientSmoothing={15}
            heatmapMode={'POINTS_DENSITY'}
          />
        </MapView>
        <BottomNavigation
          onTabPress={this.handleTabPress}
          renderTab={this.renderTab}
          tabs={this.tabs}
          activeTab={this.state.activeTab}
        />
      </View>
    );
  }
  async getDangerData() {
    try {
      this.setState({loading: true});
      const response = await fetch('https://crimespot.herokuapp.com/danger');
      const crimeData = await response.json();
      this.setState({dangerPoints: crimeData, loading: false, gotDanger: true});
      console.log('got danger');
    } catch (e) {
      console.log('Error', e.message);
    }
  }
  async getTheftData() {
    try {
      this.setState({loading: true});
      const response = await fetch('https://crimespot.herokuapp.com/theft');
      const crimeData = await response.json();
      this.setState({theftPoints: crimeData, loading: false, gotTheft: true});
      console.log('loaded theft data');
    } catch (e) {
      console.log('Error', e.message);
    }
  }
  async getParkingData() {
    try {
      this.setState({loading: true});
      const response = await fetch(
        'https://crimespot.herokuapp.com/parkingviolations',
      );
      const crimeData = await response.json();
      this.setState({
        parkingPoints: crimeData,
        loading: false,
        gotParking: true,
      });
      console.log('loaded parking data');
    } catch (e) {
      console.log('Error', e.message);
    }
  }
  async getTrafficData() {
    try {
      this.setState({loading: true});
      const response = await fetch('https://crimespot.herokuapp.com/traffic');
      const crimeData = await response.json();
      this.setState({
        trafficPoints: crimeData,
        loading: false,
        gotTraffic: true,
      });
      console.log('loaded traffic data');
    } catch (e) {
      console.log('Error', e.message);
    }
  }

  handleTabPress = (newTab, oldTab) => {
    this.setState({activeTab: newTab.key});
    if (newTab.key == 'Theft' && !this.state.gotTheft) {
      this.getTheftData();
    }
    if (newTab.key == 'Parking' && !this.state.gotParking) {
      this.getParkingData();
    }
    if (newTab.key == 'Traffic' && !this.state.gotTraffic) {
      this.getTrafficData();
    }
  };

  tabs = [
    {
      key: 'Danger',
      icon: 'exclamation',
      label: 'Danger',
      barColor: '#B71C1C',
      pressColor: 'rgba(255, 255, 255, 0.16)',
    },
    {
      key: 'Theft',
      icon: 'wallet',
      label: 'Theft',
      barColor: '#E64A19',
      pressColor: 'rgba(255, 255, 255, 0.16)',
    },
    {
      key: 'Traffic',
      icon: 'car',
      label: 'Traffic Tickets',
      barColor: '#218fde',
      pressColor: 'rgba(255, 255, 255, 0.16)',
    },
    {
      key: 'Parking',
      icon: 'parking',
      label: 'Parking Tickets',
      barColor: '#388E3C',
      pressColor: 'rgba(255, 255, 255, 0.16)',
    },
  ];

  renderIcon = icon => ({isActive}) => (
    <FontAwesome5 size={24} color="white" name={icon} />
  );

  renderTab = ({tab, isActive}) => (
    <FullTab
      isActive={isActive}
      key={tab.key}
      label={tab.label}
      renderIcon={this.renderIcon(tab.icon)}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
export default MapScreen;
