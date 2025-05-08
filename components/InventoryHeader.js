import React from "react";
import { View, Text, StyleSheet } from "react-native";

const InventoryHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Inventory</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: "#4CAF50",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default InventoryHeader;
