import debounce from "lodash.debounce";
import { useCallback, useRef, useState } from "react";
import { View, StyleSheet, FlatList, ScrollView } from "react-native";
import colors from "../constants/colors";
import { Button, Text, TextInput } from "react-native-paper";

const PatientSearchBar = ({ state, onChange, label, onFocus, onBlur }) => {
  const [onFocuss, setOnFocus] = useState(false);
  const [searchText, setSearchText] = useState("search");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = useCallback((val) => {
    console.log("Searching for: handle", val);
    setSearchText(val);
    debouncedSearch(val);
  }, []);

  const debouncedSearch = useCallback(
    debounce((text) => {
      console.log("Searching for:", text);

      // Implement your search logic here to

      //fetch suggestions based on the text

      // and set suggestions
    }, 500),
    []
  );

  const handleSuggestionPress = (suggestion) => {
    console.log("Selected: ", suggestion);
    setSearchText(suggestion);
    setSuggestions([]);
    handleSearch(suggestion);
  };

  const onTap = (item) => {
    console.log("Selected: ", item);
    setSearchText(item);
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        value={searchText}
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
  input: {
    backgroundColor: "white",
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
    backgroundColor: colors.white,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderColor: colors.darkgreen,
  },
  suggestionText: {
    paddingHorizontal: 10,
    width: "100%",
    display: "flex",
    textAlign: "left",
    alignContent: "flex-start",
  },
});

export default PatientSearchBar;
