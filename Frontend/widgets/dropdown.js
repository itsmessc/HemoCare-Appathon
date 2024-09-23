import React from "react";
import { View, Text, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import colors from "../constants/colors";

const Dropdown = ({ label, placeholder, options, value, onValueChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.dropdownContainer}>
        <RNPickerSelect
          onValueChange={onValueChange}
          items={options}
          placeholder={placeholder || { label: "Select an option...", value: null }}
          value={value || null}
          style={pickerSelectStyles}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
  },
  dropdownContainer: {
    backgroundColor: colors.white,
    borderColor: colors.green,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    color: "#000",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    color: "#000",
  },
});

export default Dropdown;
