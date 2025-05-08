import React, { useState } from "react";
import { Modal, View, TextInput, Button, StyleSheet, Text } from "react-native";

const AddSeedModal = ({ visible, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (!name || !quantity) return;
    onAdd({ name, quantity: parseInt(quantity), description });
    setName("");
    setQuantity("");
    setDescription("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add New Seed</Text>
          <TextInput
            placeholder="Seed name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />
          <View style={styles.buttons}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Add" onPress={handleAdd} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modal: {
    margin: 20,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginVertical: 6,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
});

export default AddSeedModal;
