import { View } from "react-native";
import { TextInput } from "react-native-paper";
import colors from "../constants/colors";

export default function MyTextInput({
  state,
  onChange,
  label,
  numberOfLines = 1,
  onBlur,
  onFocus,
}) {
  return (
    <View>
      <TextInput
        numberOfLines={numberOfLines}
        label={label ?? ""}
        mode="outlined"
        value={state}
        selectionColor={colors.teal}
        cursorColor={colors.teal}
        activeOutlineColor={colors.teal}
        outlineColor={colors.teal}
        onChangeText={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        borderColor={colors.teal}
        style={{ borderColor: colors.teal, marginBottom: 10 }}
      />
    </View>
  );
}
