import debounce from "lodash.debounce";
import { useCallback, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import colors from "../constants/colors";
import MyTextInput from "./textinput";
import { Button, Text } from "react-native-paper";

const PatientSearchBar = ({ state, onChange, label, onFocus, onBlur }) => {
  const [onFocuss, setOnFocus] = useState(false);
  const [searchText, setSearchText] = useState("search");

  const debouncedSearch = useCallback(
    debounce((text) => {
      console.log("Searching for: ", text);
    }, 500),
    []
  );

  const suggestions = ["Sai Charan", "Banana", "Ayush", "Paliya"];

  const handleSearch = (val) => {
    if (val === "") {
      setSearchText("search");
      return;
    }
    setSearchText(val);
    debouncedSearch(val);
  };

  const onTap = (item) => {
    console.log("Selected: ", item);
    setSearchText(item);
  };

  return (
    <View>
      <MyTextInput
        label={searchText}
        state={searchText}
        onChange={handleSearch}
        iconName="magnify"
        iconSize={20}
        onFocus={() => {
          setOnFocus(true);
        }}
      />
      {suggestions.length > 0 && onFocuss ? (
        <FlatList
          style={styles.flatlist}
          data={suggestions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Button style={styles.suggestionItem} onPress={() => onTap(item)}>
              <Text style={styles.suggestionText}>{item}</Text>
            </Button>
          )}
        />
      ) : (
        <Text></Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
  },
  flatlist: {
    marginVertical: 4,
    borderColor: colors.darkgreen,
    borderWidth: 1,
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
});

export default PatientSearchBar;
