import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import PieChart from "react-native-pie-chart";
import colors from "../constants/colors";

export default ({ dimensions, values }) => {
  const sliceColor = [colors.green, colors.green, colors.red];
  const total = values.reduce((acc, value) => acc + value, 0);

  return (
    <View style={styles.container}>
      <PieChart
        widthAndHeight={dimensions}
        series={values}
        sliceColor={sliceColor}
        coverRadius={0.5}
        coverFill={colors.lightgray}
      />
      <View>
        <Text style={styles.centeredText}>Total {total}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    margin: 10,
  },
});
