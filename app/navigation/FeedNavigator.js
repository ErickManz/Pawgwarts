import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FeedScreen from '../screens/FeedScreen';
import UploadImageScreen from '../screens/UploadImageScreen';

const Stack = createStackNavigator();

const FeedNavigator = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, presentation: 'modal' }}
  >
    <Stack.Screen name="MyFeed" component={FeedScreen} />
    <Stack.Screen name="ListingDetails" component={UploadImageScreen} />
  </Stack.Navigator>
);

export default FeedNavigator;
