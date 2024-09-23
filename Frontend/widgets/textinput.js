import { View } from "react-native";
import { TextInput } from "react-native-paper";
import colors from "../constants/colors";

export default function MyTextInput({
  state,
  onChange,
  label,
  numberOfLines = 1,
}) {
  return (
    <View>
      <TextInput
        numberOfLines={numberOfLines}
        label={label ?? ""}
        mode="outlined"
        value={state}
        selectionColor={colors.darkgreen}
        cursorColor={colors.darkgreen}
        activeOutlineColor={colors.darkgreen}
        outlineColor={colors.green}
        onChangeText={onChange}
      />
    </View>
  );
}
