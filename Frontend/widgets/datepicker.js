import React, { useState } from "react";
import { View, Button, Platform, StyleSheet, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import colors from "../constants/colors";

const DateTimePickerComponent = ({ dateTime, setDateTime, title }) => {
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) {
      setShowDate(Platform.OS === "ios"); // Keep the picker visible for iOS
      setShowTime(true); // Show time picker after date is selected
      setDateTime((prevDateTime) => {
        // Create a new date object to avoid mutation of state
        const newDateTime = new Date(selectedDate);
        newDateTime.setHours(prevDateTime.getHours());
        newDateTime.setMinutes(prevDateTime.getMinutes());
        return newDateTime;
      });
    }
  };

  const onChangeTime = (event, selectedTime) => {
    if (selectedTime) {
      setShowTime(Platform.OS === "ios"); // Keep the picker visible for iOS
      setDateTime((prevDateTime) => {
        // Create a new date object to avoid mutation of state
        const newDateTime = new Date(prevDateTime);
        newDateTime.setHours(selectedTime.getHours());
        newDateTime.setMinutes(selectedTime.getMinutes());
        return newDateTime;
      });
    }
  };

  const showDatePicker = () => setShowDate(true);
  const showTimePicker = () => setShowTime(true);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      <Button
        color={colors.darkgreen}
        onPress={showDatePicker}
        title={dateTime.toLocaleString()} // Display both date and time
      />
      {showDate && (
        <DateTimePicker
          value={dateTime}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
      {showTime && (
        <DateTimePicker
          value={dateTime}
          mode="time"
          display="default"
          onChange={onChangeTime}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    paddingBottom: 5,
  },
});

export default DateTimePickerComponent;
