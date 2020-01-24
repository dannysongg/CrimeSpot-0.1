import React, {Component} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    ActivityIndicator
  } from 'react-native';
import { createBottomTabNavigator, createAppContainer} from 'react-navigation';  
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';  
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';  
import MapScreen from './App.js';

const TabNavigator = createMaterialBottomTabNavigator(  
  {  
      Danger: { screen: MapScreen,  
          navigationOptions:{  
              tabBarLabel:'Danger',  
              tabBarIcon: ({ tintColor }) => (  
                  <View>  
                      <FontAwesome5 style={[{color: tintColor}]} size={25} name={'exclamation'}/>  
                  </View>),  
              
          }  
      },  
      Theft: { screen: MapScreen,  
          navigationOptions:{  
              tabBarLabel:'Theft',  
              tabBarIcon: ({ tintColor }) => (  
                  <View>  
                      <FontAwesome5 style={[{color: tintColor}]} size={25} name={'wallet'}/>  
                  </View>),  
              activeColor: '#f60c0d',  
              inactiveColor: '#f65a22',  
              barStyle: { backgroundColor: '#f69b31' },  
              // tabBarOnPress: async ({navigation, defaultHandler }) => {
              //   const response = await fetch('https://crimespot.herokuapp.com/theft');
              //   const crimeData =  await response.json();
              //   console.log("getting theft")
              //   defaultHandler();
              // }
              tabBarOnPress: ({navigation, defaultHandler }) => {
                
                defaultHandler();
              }
          }  
      },  
      Traffic: { screen: MapScreen,  
          navigationOptions:{  
              tabBarLabel:'Traffic Tickets',  
              tabBarIcon: ({ tintColor }) => (  
                  <View>  
                      <FontAwesome5 style={[{color: tintColor}]} size={25} name={'car'}/>  
                  </View>),  
              activeColor: '#615af6',  
              inactiveColor: '#46f6d7',  
              barStyle: { backgroundColor: '#67baf6' },  
          }  
      },  
      Parking: {  
          screen: MapScreen,  
          navigationOptions:{  
              tabBarLabel:'Parking Violations',  
              tabBarIcon: ({ tintColor }) => (  
                  <View>  
                      <FontAwesome5 style={[{color: tintColor}]} size={25} name={'parking'}/>  
                  </View>),  
          }  
      },  
  },  
  {  
    initialRouteName: "Danger",  
    activeColor: '#f0edf6',  
    inactiveColor: '#226557',  
    barStyle: { backgroundColor: '#3BAD87' },  
  },  
);  


export default createAppContainer(TabNavigator);  
