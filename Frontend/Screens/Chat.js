import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Keyboard } from 'react-native';
import io from 'socket.io-client';
import { getToken, removeToken, storeToken } from '../store';
import {jwtDecode} from 'jwt-decode';
import { ip } from '../constants/variables';
// Connect to the WebSocket server
const socket = io(ip); // Replace with your server address

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [currentUser,setusername]=useState(''); // Replace with the actual current user ID
    const [token,settoken]=useState('')
    // Handle sending messages
    const handleSend = async () => {
        if (messageText.trim()) {
          
            socket.emit('message', {
                sender_id: token,
                content: messageText,
                location: 'VIP',
                staff:currentUser
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
            setusername(decoded.name);
            console.log("Name",decoded.name)
            settoken(decoded.id);
            
            
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
                item.user._id === token ? styles.currentUser : styles.otherUser
            ]}
        >
            {item.user._id === token ? "" : <Text style={styles.userIdText}>{item.user.name}</Text>}
            <Text style={styles.messageText}>{item.text}</Text>
            
        </View>
    );

    return (
        <View style={styles.container}>
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
        backgroundColor: '#5FCD9E', // Blue background for current user's messages
        alignSelf: 'flex-end',
        
    },
    otherUser: {
        backgroundColor: '#fff', // Grey background for other users' messages
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        color: '#000', // White text for current user's messages
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
});
