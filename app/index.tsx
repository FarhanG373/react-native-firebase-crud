import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebaseConnection";

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onPress = async () => {
    if (!name || !phone || !age) {
      alert("All fields are required");
      return;
    }

    if (isNaN(Number(age))) {
      alert("Age must be a number");
      return;
    }

    try {
      setIsLoading(true);

      await setDoc(doc(db, `users`, phone), {
        name,
        phone, // keep as string
        age: Number(age),
        createdAt: new Date(),
      });

      setName("");
      setPhone("");
      setAge("");
      alert("User Added successfully");
    } catch (error) {
      console.error("Error adding document:", error);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserByPhone = async () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phone", "==", phone));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      alert("User not found");
      return;
    }

    try {
      setIsLoading(true);

      await updateDoc(snapshot.docs[0].ref, {
        name,
        age: Number(age),
        updatedAt: new Date(),
      });

      alert("User updated successfully");
    } catch (error) {
      console.error(error);
      alert("Update failed");
    } finally {
      setIsLoading(false);
    }
  };
  const deleteUserByPhone = async () => {
    if (!phone) {
      alert("Phone number is required");
      return;
    }

    try {
      setIsLoading(true);

      await deleteDoc(doc(db, "users", phone));

      alert("User deleted successfully");
      setName("");
      setPhone("");
      setAge("");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };
  const viewUserByPhone = async () => {
    if (!phone) {
      alert("Phone number is required");
      return;
    }

    try {
      setIsLoading(true);

      const ref = doc(db, "users", phone);
      const snapshot = await getDoc(ref);

      if (!snapshot.exists()) {
        alert("User not found");
        return;
      }

      const data = snapshot.data();

      setName(data.name);
      setAge(String(data.age));
      setPhone(data.phone);
    } catch (error) {
      console.error("View failed:", error);
      alert("Failed to fetch user");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ padding: 20 }}>
        <ThemedText
          type="title"
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          CRUD App
        </ThemedText>
      </ThemedView>
      <ThemedView
        style={{
          padding: 20,
          flex: 1,
          justifyContent: "center",
        }}
      >
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          style={inputStyle}
        />

        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone Number"
          keyboardType="number-pad"
          maxLength={10}
          style={inputStyle}
        />

        <TextInput
          value={age}
          onChangeText={setAge}
          placeholder="Age"
          keyboardType="number-pad"
          style={inputStyle}
        />

        <Pressable
          onPress={onPress}
          disabled={isLoading}
          style={[buttonStyle, { opacity: isLoading ? 0.6 : 1 }]}
        >
          <ThemedText style={{ textAlign: "center" }}>
            {isLoading ? "Saving..." : "Insert"}
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={updateUserByPhone}
          disabled={isLoading}
          style={[buttonStyle, { opacity: isLoading ? 0.6 : 1 }]}
        >
          <ThemedText style={{ textAlign: "center" }}>{"Update"}</ThemedText>
        </Pressable>
        <Pressable
          onPress={deleteUserByPhone}
          disabled={isLoading}
          style={[buttonStyle, { opacity: isLoading ? 0.6 : 1 }]}
        >
          <ThemedText style={{ textAlign: "center" }}>{"Delete"}</ThemedText>
        </Pressable>
        <Pressable
          onPress={viewUserByPhone}
          disabled={isLoading}
          style={[buttonStyle, { opacity: isLoading ? 0.6 : 1 }]}
        >
          <ThemedText style={{ textAlign: "center" }}>{"View"}</ThemedText>
        </Pressable>
      </ThemedView>
    </SafeAreaView>
  );
}

const inputStyle = {
  fontSize: 12,
  fontWeight: "bold",
  marginBottom: 10,
  borderRadius: 5,
  padding: 10,
};

const buttonStyle = {
  padding: 10,
  borderWidth: 1,
  borderRadius: 5,
  marginTop: 10,
};
