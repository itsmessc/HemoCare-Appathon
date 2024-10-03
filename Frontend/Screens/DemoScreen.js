import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Function to send push notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Notification Title',
    body: 'This is the body of the notification.',
    data: { someData: 'goes here' },
  };

  console.log('Sending notification with payload:', message);

  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  const responseData = await response.json();
  console.log('Notification response:', responseData);
}

// Handle registration error
function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

// Register for push notifications
async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted for push notifications!');
      return;
    }
    
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }

    try {
      const pushToken = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log('Push token:', pushToken);
      return pushToken;
    } catch (e) {
      handleRegistrationError(`Error obtaining push token: ${e}`);
    }
  } else {
    handleRegistrationError('Must use a physical device for push notifications');
  }
}

// Main App component
export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token || ''))
      .catch(error => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Text>Your Expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification?.request?.content?.title}</Text>
        <Text>Body: {notification?.request?.content?.body}</Text>
        <Text>Data: {notification?.request?.content?.data ? JSON.stringify(notification.request.content.data) : ''}</Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          if (expoPushToken) {
            await sendPushNotification(expoPushToken);
          } else {
            alert('No push token available. Please check the token generation.');
          }
        }}
      />
    </View>
  );
}
