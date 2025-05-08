import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SeedItem = ({ seed }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.name}>{seed.name}</Text>
      <Text style={styles.details}>Quantity: {seed.quantity}</Text>
      {seed.description ? (
        <Text style={styles.details}>{seed.description}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 8,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  details: {
    fontSize: 14,
    color: "#555",
  },
});

export default SeedItem;
