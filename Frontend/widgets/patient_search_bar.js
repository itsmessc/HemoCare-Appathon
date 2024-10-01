import debounce from "lodash.debounce";
import { useCallback, useRef, useState } from "react";
import { View, StyleSheet, FlatList, ScrollView } from "react-native";
import colors from "../constants/colors";
import { Button, Text, TextInput } from "react-native-paper";

const PatientSearchBar = ({}) => {
  const [onFocuss, setOnFocus] = useState(false);
  const [searchText, setSearchText] = useState("Search");
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
        theme={{ roundness: 25 }}
        value={searchText}
        mode="outlined"
        selectionColor={colors.darkgreen}
        cursorColor={colors.darkgreen}
        activeOutlineColor={colors.darkgrey}
        outlineColor={colors.grey}
        onChangeText={handleSearch}
        right={<TextInput.Icon icon="magnify" />}
        onFocus={() => {
          if (suggestions.length > 0) {
            //inputRef.current.blur();
            //inputRef.current.focus();
          } else {
            setSuggestions(["Sai Charan", "Banana", "Ayush", "Paliya"]);
          }
        }}
      />

      <View
        style={{
          ...styles.suggestionContainer,
          padding: suggestions.length > 0 ? 5 : 0,
        }}
      >
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
    marginTop: 10,
    height: 50,
    marginBottom: 2,
    backgroundColor: colors.white,
    color: colors.darkgreen,
  },
  suggestionContainer: {
    borderRadius: 25,
    backgroundColor: colors.white,
  },

  suggestionItem: {
    alignItems: "flex-start",
    width: "100%",
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
