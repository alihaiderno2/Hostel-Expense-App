import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../../context/AuthContext";

const { width, height } = Dimensions.get("window");

interface SignupProps {
  onSignup: () => void;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const router = useRouter();
  const auth = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return emailRegex;
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateInputs = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateInputs()) {
      return;
    }

    const result = await auth?.signup(name, email, password);

    if (result?.success) {
      if (onSignup) {
        onSignup();
      } else {
        router.replace("/");
      }
    } else {
      Alert.alert("Signup Failed", result?.message || "An error occurred during signup");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>JOIN US</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <TouchableOpacity style={styles.signupButton} onPress={handleRegister}>
            <Text style={styles.signupButtonText}>SIGN UP</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.footerText}>
              Have an account? <Text style={styles.boldText}>Login</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  formContainer: {
    paddingHorizontal: 40,
    paddingTop: 40,
    paddingBottom: 40,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: "#EEE",
    height: 50,
    fontSize: 16,
    color: "#000",
    paddingBottom: 8,
  },
  inputError: {
    borderBottomColor: "#FF6B6B",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
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
