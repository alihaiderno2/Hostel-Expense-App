import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

interface SignupProps {
  onSignup: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Success: Account created!");
        onSignup();
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.log("Connection Error:", error);
      alert(
        "Error: Could not connect to the backend server. Make sure your Node.js server is running on port 5000.",
      );
    }
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>JOIN US</Text>
      </View>
      <View style={styles.diagonalClip} />

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={(text) => setName(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.signupButton} onPress={handleRegister}>
          <Text style={styles.signupButtonText}>SIGN UP</Text>
        </TouchableOpacity>

        {/* Footer Link */}
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.footerText}>
            Have an account? <Text style={styles.boldText}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    height: height * 0.3,
    backgroundColor: "#000",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 42,
    fontWeight: "900",
  },
  diagonalClip: {
    height: 80,
    backgroundColor: "#000",
    borderBottomRightRadius: width * 2,
    transform: [{ scaleX: 2 }],
  },
  formContainer: {
    paddingHorizontal: 40,
    paddingTop: 40,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: "#EEE",
    height: 50,
    marginBottom: 25,
    fontSize: 16,
    color: "#000",
  },
  signupButton: {
    backgroundColor: "#000",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  signupButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    letterSpacing: 2,
  },
  footerText: {
    textAlign: "center",
    marginTop: 30,
    color: "#666",
  },
  boldText: {
    color: "#000",
    fontWeight: "bold",
  },
});
