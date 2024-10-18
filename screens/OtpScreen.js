import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

const OtpScreen = ({ route }) => {
  const { email } = route.params; // Extract the email passed from the registration screen
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // State for individual OTP digits
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]); // Create a ref for the input fields

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text.replace(/[^0-9]/g, ""); // Allow only numeric input
    setOtp(newOtp);

    if (text && index < otp.length - 1) {
      focusNextInput(index + 1);
    } else if (!text && index > 0) {
      focusPreviousInput(index - 1);
    }
  };

  const focusNextInput = (index) => {
    if (index < otp.length) {
      inputRefs.current[index].focus();
    }
  };

  const focusPreviousInput = (index) => {
    if (index >= 0) {
      inputRefs.current[index].focus();
    }
  };

  const handleOtpVerification = async () => {
    setLoading(true);
    const otpString = otp.join(""); // Join the individual OTP digits to form the complete OTP

    try {
      const response = await fetch("https://nivsjewels.com/api/register", { // Replace with your API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          verifyemail: email, // Send the email along with OTP
          otp: otpString,

        }),
      });

      const data = await response.json();

      if (data.status===true) {
        // OTP verified successfully
        Alert.alert("Success", data.message);
        // Navigate to the next screen or perform any other action
      } else {
        // Handle error response
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      // Handle network error
      Alert.alert("Error", "Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    // Logic to resend OTP
    console.log("Resending OTP to", email);
    // Add your resend OTP logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.label}>Enter OTP sent to</Text>
        <Text style={styles.email}>{email}</Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)} // Set ref for each input
              style={[styles.otpInput, digit ? styles.filledInput : null]} // Change style based on filled state
              placeholder="*"
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleOtpVerification}
          disabled={loading}
        >
          <Text style={styles.verifyButtonText}>{loading ? "Verifying..." : "Verify OTP"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleResendOtp} style={styles.resendButton}>
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  box: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
    color: '#343a40',
  },
  email: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#6c757d',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 350,
    marginBottom: 20,
  },
  otpInput: {
    borderColor: '#ced4da',
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    width: 50,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: '#fff',
  },
  filledInput: {
    backgroundColor: '#e9ecef',
  },
  verifyButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 4,
    width: '80%',
    alignItems: 'center',
    marginBottom: 15,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  resendButton: {
    marginTop: 15,
  },
  resendText: {
    color: '#007bff',
    fontSize: 16,
  },
});

export default OtpScreen;
