import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import colors from "../constants/colors";

const PasswordInput = ({ label, value, onChange, secureTextEntry, onTogglePassword }) => {
  return (
    <View>
      <TextInput
        label={label ?? ""}
        mode="outlined"
        value={value}
        selectionColor={colors.darkgreen}
        cursorColor={colors.darkgreen}
        activeOutlineColor={colors.darkgreen}
        outlineColor={colors.green}
        onChangeText={onChange}
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />
      <TouchableOpacity onPress={onTogglePassword} style={styles.toggleButton}>
        <Text style={styles.toggleText}>{secureTextEntry ? "Show" : "Hide"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    top: 15, // Adjust this to position the button inside the TextInput
  },
  toggleText: {
    color: "#22895D",
    fontSize: 16,
  },
});

export default PasswordInput;
