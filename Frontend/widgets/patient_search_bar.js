import debounce from "lodash.debounce";
import { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import colors from "../constants/colors";
import { Button, Text, TextInput } from "react-native-paper";

const PatientSearchBar = ({ data, set }) => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = useCallback((val) => {
    setSearchText(val);
    debouncedSearch(val);
  }, []);

  const debouncedSearch = useCallback(
    debounce((text) => {
      if (text) {
        const filteredSuggestions = data
          .filter((item) =>
            item.name.toLowerCase().includes(text.toLowerCase()) ||
            item.patient_id.toString().includes(text) // Convert patient_id to string and check
          )
          .map((item) => `${item.name}-${item.patient_id}`); // Format suggestions
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    }, 100), // Ensure the closing parenthesis is here
    [data] // Dependency array should be outside the debounce function
  );

  const handleSuggestionPress = (suggestion) => {
    const [name, patientId] = suggestion.split('-'); // Split the suggestion to get patient_id
    setSearchText(suggestion); // Set the input to the patient's name
    set(patientId.trim()); // Send the patient_id to the set function
    setSuggestions([]); // Clear suggestions
    console.log("Selected patient_id: ", patientId);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={searchText}
        onChangeText={handleSearch}
        placeholder="Search Patient..."
      />

      {suggestions.length > 0 && (
        <View style={styles.suggestionContainer}>
          {suggestions.map((item) => (
            <Button
              key={item}
              style={styles.suggestionItem}
              onPress={() => handleSuggestionPress(item)}
            >
              <Text style={styles.suggestionText}>{item}</Text>
            </Button>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  input: {
    backgroundColor: "white",
    color: colors.darkgreen,
    borderColor: colors.teal, // Set border color to green
    borderWidth: 2,            // Ensure the border is visible
    borderRadius: 5, 
  },
  suggestionContainer: {
    zIndex: 2,
    position: 'absolute',
    top: 50,
    width: '100%',
    backgroundColor: colors.white,
  },
  suggestionItem: {
    alignItems: "flex-start",
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderColor: colors.teal, // Changed border color to teal
  },
  suggestionText: {
    paddingHorizontal: 10,
    width: "100%",
    textAlign: "left",
  },
});

export default PatientSearchBar;
