import AsyncStorage from '@react-native-async-storage/async-storage';

// Store token
export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('@userToken', token);
  } catch (e) {
    console.error('Failed to save the token:', e);
  }
};
export const storelocation = async (token) => {
  try {
    await AsyncStorage.setItem('@location', token);
  } catch (e) {
    console.error('Failed to save the token:', e);
  }
};
// Retrieve token
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('@userToken');
    return token;
  } catch (e) {
    console.error('Failed to retrieve the token:', e);
    return null;
  }
};
export const getlocation = async () => {
  try {
    const token = await AsyncStorage.getItem('@location');
    return token;
  } catch (e) {
    console.error('Failed to retrieve the token:', e);
    return null;
  }
};

export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('@userToken');
    } catch (error) {
        console.error('Failed to remove the token:', error);
    }
};