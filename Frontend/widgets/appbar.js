import React from "react";
import { StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";
import colors from "../constants/colors";

const MyAppBar = ({ title }) => {
  return (
    <Appbar.Header style={styles.appbars}>
      <Appbar.Content title={title} titleStyle={styles.font} />
      <Appbar.Action
        icon="dots-vertical"
        onPress={() => {}}
        color={colors.white}
      />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  appbars: {
    backgroundColor: colors.darkgreen,
    color: colors.white,
  },
  font: {
    color: colors.white,
  },
});

export default MyAppBar;
