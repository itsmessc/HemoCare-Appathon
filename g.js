import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Keyboard } from 'react-native';
import io from 'socket.io-client';
import { getToken, removeToken, storeToken } from '../store';
import jwtDecode from 'jwt-decode'; // Ensure this is imported correctly
import { ip } from '../constants/variables';
import { Appbar, Menu } from 'react-native-paper'; // For app bar and dropdown menu
import { Picker } from '@react-native-picker/picker'; // Import Picker from the correct package

const socket = io(ip); // Replace with your server address

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [currentUser, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [location, setLocation] = useState('');
    const [locationMenuVisible, setLocationMenuVisible] = useState(false); // For dropdown in app bar
    const [availableLocations] = useState(['VIP', 'General', 'ICU']); // Sample locations

    const handleSend = () => {
        if (messageText.trim()) {
            socket.emit('message', {
                sender_id: token,
                content: messageText,
                location: location, // Include location in the message
                staff: currentUser
            });
            setMessageText('');
            Keyboard.dismiss();
        }
    };

    useEffect(() => {
        // Fetch historical messages and listen for new messages
        const fetchHistory = () => {
            socket.emit('getHistory');
        };
        const fetchToken = async () => {
            const token = await getToken();
            const decoded = jwtDecode(token);
            setUsername(decoded.name);
            console.log("Name",decoded.name)
            setToken(decoded.id);
        };
        fetchToken();
        
        socket.on('history', (historicalMessages) => {
            console.log(historicalMessages);
            
            const formattedMessages = historicalMessages.map((msg) => ({
                _id: msg._id.toString(),
                text: msg.content,
                createdAt: new Date(msg.createdAt),
                user: {
                    _id: msg.sender_id,
                    name: msg.staff, // Replace with actual user names if available
                },
            }));
            // Sort messages in descending order
            formattedMessages.sort((a, b) => b.createdAt - a.createdAt);
            setMessages(formattedMessages);
        });

        socket.on('message', (message) => {
            const newMessage = {
                _id: message._id.toString(),
                text: message.content,
                createdAt: new Date(message.createdAt),
                user: {
                    _id: message.sender_id,
                    name: message.staff, // Replace with actual user names if available
                },
            };
            setMessages((prevMessages) => [newMessage, ...prevMessages]);
        });

        fetchHistory();

        // Cleanup on component unmount
        return () => {
            socket.off('history');
            socket.off('message');
        };
    }, []);

    const renderItem = ({ item }) => (
        <View
            style={[
                styles.messageContainer,
                item.user._id === token ? styles.currentUser : styles.otherUser, // Conditional styles based on user
                { alignSelf: item.user._id === token ? 'flex-end' : 'flex-start' } // Align right for the current user
            ]}
        >
            {item.user._id !== token && <Text style={styles.userIdText}>{item.user.name}</Text>}
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    // Dropdown handler for location selection
    const handleLocationChange = (selectedLocation) => {
        setLocation(selectedLocation);
    };

    // Show location dropdown in Appbar
    const toggleMenu = () => {
        setLocationMenuVisible(!locationMenuVisible);
    };

    return (
        <View style={{ flex: 1 }}>
            {location ? (
                <>
                    {/* App Bar with Dropdown Menu */}
                    <Appbar.Header>
                        <Appbar.Content title="Chat" />
                        <Menu
                            visible={locationMenuVisible}
                            onDismiss={toggleMenu}
                            anchor={<Appbar.Action icon="menu" color="black" onPress={toggleMenu} />}
                        >
                            {availableLocations.map((loc) => (
                                <Menu.Item
                                    key={loc}
                                    onPress={() => {
                                        handleLocationChange(loc);
                                        toggleMenu();
                                    }}
                                    title={loc}
                                />
                            ))}
                        </Menu>
                    </Appbar.Header>

                    {/* Chat Interface */}
                    <FlatList
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id}
                        inverted
                        contentContainerStyle={styles.messageList}
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={messageText}
                            onChangeText={setMessageText}
                            placeholder="Type a message..."
                        />
                        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                            <Text style={styles.sendButtonText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                // If location is not selected, show dropdown to select location
                <View style={styles.locationContainer}>
                    <Text style={styles.locationPrompt}>Select a location to join the chat:</Text>
                    <Picker
                        selectedValue={location}
                        style={styles.picker}
                        onValueChange={(itemValue) => handleLocationChange(itemValue)}
                    >
                        <Picker.Item label="Select Location" value="" />
                        {availableLocations.map((loc) => (
                            <Picker.Item key={loc} label={loc} value={loc} />
                        ))}
                    </Picker>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    messageList: {
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    messageContainer: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 5,
        maxWidth: '80%',
    },
    currentUser: {
        backgroundColor: '#5FCD9E', // Green background for current user's messages
    },
    otherUser: {
        backgroundColor: '#fff', // White background for other users' messages
    },
    messageText: {
        fontSize: 16,
        color: '#000', // Black text for messages
    },
    userIdText: {
        fontSize: 10,
        color: 'grey',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    locationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationPrompt: {
        fontSize: 18,
        marginBottom: 10,
    },
    picker: {
        width: 200,
        height: 50,
    },
});
