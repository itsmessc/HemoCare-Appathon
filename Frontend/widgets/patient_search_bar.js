import debounce from "lodash.debounce";
import { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import colors from "../constants/colors";
import { Button, Text, TextInput } from "react-native-paper";

const PatientSearchBar = ({ state, onChange, label, onFocus, onBlur }) => {
  const [onFocuss, setOnFocus] = useState(false);
  const [searchText, setSearchText] = useState("search");
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
        theme={{ roundness: 25 }}
        value={searchText}
        mode="outlined"
        selectionColor={colors.darkgreen}
        cursorColor={colors.darkgreen}
        activeOutlineColor={colors.darkgrey}
        outlineColor={colors.grey}
        onChangeText={handleSearch}
        onFocus={() => {
          if (suggestions.length > 0) {
            //inputRef.current.blur();
            //inputRef.current.focus();
          } else {
            setSuggestions(["Sai Charan", "Banana", "Ayush", "Paliya"]);
          }
        }}
      />

      <View>
        {suggestions.map((item) => (
          <Button
            key={item}
            style={styles.suggestionItem}
            onPress={() => {
              handleSuggestionPress(item);
            }}
          >
            <Text style={styles.suggestionText}>{item}</Text>
          </Button>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  input: {
    marginTop: 10,
    height: 50,
    marginBottom: 2,
    backgroundColor: colors.white,
    color: colors.darkgreen,
  },
  flatlist: {
    marginVertical: 4,
    borderColor: colors.darkgreen,
    borderWidth: 0,
    borderRadius: 5,
  },
  suggestionItem: {
    alignItems: "flex-start",
    width: "100%",
  },
  suggestionText: {
    paddingHorizontal: 10,
    width: "100%",
    textAlign: "left",
  },
});

export default PatientSearchBar;
