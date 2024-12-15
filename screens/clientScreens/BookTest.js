import React, { useState } from 'react';
import { View, StyleSheet, Alert, Platform, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Menu, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ea',
    accent: '#03dac4',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#333333',
  },
  roundness: 12,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  appbar: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  iconButton: {
    padding: 10,
  },
  appTitle: {
    fontSize: 20,
    color: '#6200ea',
    fontFamily: 'CustomFont-Bold',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    padding: 20,
    elevation: 4,
    width: '100%',
    maxWidth: 400,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ea',
    marginBottom: 15,
    textAlign: 'center',
  },
  input1: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  listView: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
  },
  inlinePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 5,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },

  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  iconButtonText: {
    fontSize: 16,
    color: '#6200ea',
    marginLeft: 8,
  },
});

export default function BookTest({ navigation }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [houseAddress, setHouseAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleNext = () => {
    if (step === 1) {
      if (!name || !phone || !email) {
        Alert.alert('Validation Error', 'Please provide your name, phone, and email.');
        return;
      }
    } else if (step === 2) {
      if (city !== 'Chandigarh') {
        Alert.alert('Service Unavailable', 'The service is currently unavailable in your city.');
        return;
      }
      if (!address || !city || !state || !houseAddress || !landmark || !pincode) {
        Alert.alert('Validation Error', 'Please complete all address fields.');
        return;
      }
    } else if (step === 3 && (!date || !time)) {
      Alert.alert('Validation Error', 'Please select a date and time.');
      return;
    }
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    if (!paymentDetails) {
      Alert.alert('Validation Error', 'Please provide payment details.');
      return;
    }

    Alert.alert('Booking Confirmed', `Your consultation is booked for ${date} at ${time}.`);
    navigation.navigate('Main');
  };

  const showDatePickerHandler = () => setShowDatePicker(true);
  const showTimePickerHandler = () => setShowTimePicker(true);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    if (selectedDate) setDate(currentDate.toLocaleDateString());
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    if (selectedTime) setTime(currentTime.toLocaleTimeString());
  };

  return (
    <View style={styles.container}>
      <View style={styles.appbar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('AccountInfo')}
        >
          <Ionicons name="menu" size={30} color="#6200ea" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>CHECK-UP</Text>
      </View>
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={10}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {step === 1 && (
            <>
              <Text style={styles.heading}>Step 1: Provide Your Details</Text>
              <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholder="Enter your full name"
              />
              <TextInput
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
              <Button mode="contained" onPress={handleNext} style={styles.button}>
                Next
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.heading}>Step 2: Select Your Address</Text>
              <GooglePlacesAutocomplete
                placeholder="Search for your pincode"
                onPress={(data, details = null) => {
                  const addressComponents = details.address_components;
                  setAddress(data.description);
                  addressComponents.forEach(component => {
                    if (component.types.includes('locality')) setCity(component.long_name);
                    if (component.types.includes('administrative_area_level_1')) setState(component.long_name);
                    if (component.types.includes('postal_code')) setPincode(component.long_name);
                  });
                }}
                query={{
                  key: 'AIzaSyA2j64TE-eDVL98WHNlQKVMJjT9eogz2K8',
                  language: 'en',
                  components: 'country:in',
                }}
                styles={{
                  textInput: styles.input1,
                  listView: styles.listView,
                }}
                fetchDetails
                nearbyPlacesAPI="GooglePlacesSearch"
                debounce={400}
              />
              <TextInput
                label="City"
                value={city}
                onChangeText={(text) => setCity(text)}
                style={styles.input}
                placeholder="Enter city"
              />
              <TextInput
                label="State"
                value={state}
                onChangeText={(text) => setState(text)}
                style={styles.input}
                placeholder="Enter state"
              />
              <TextInput
                label="House Address"
                value={houseAddress}
                onChangeText={setHouseAddress}
                style={styles.input}
                placeholder="Enter full house address"
              />
              <TextInput
                label="Landmark"
                value={landmark}
                onChangeText={setLandmark}
                style={styles.input}
                placeholder="Enter landmark"
              />
              <TextInput
                label="Pincode"
                value={pincode}
                onChangeText={setPincode}
                style={styles.input}
                placeholder="Enter pincode"
                keyboardType="numeric"
              />
              <Button mode="outlined" onPress={handlePrev} style={styles.button}>
                Back
              </Button>
              <Button mode="contained" onPress={handleNext} style={styles.button}>
                Next
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.heading}>Step 3: Select Date and Time</Text>
              <View style={styles.inlinePickerContainer}>
                <TouchableOpacity style={styles.iconButton} onPress={showDatePickerHandler}>
                  <Ionicons name="calendar-outline" size={24} color="#6200ea" />
                  <Text style={styles.iconButtonText}>
                    {date ? `Date: ${date}` : 'Select Date'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                  />
                )}
              </View>

              <View style={styles.inlinePickerContainer}>
                <TouchableOpacity style={styles.iconButton} onPress={showTimePickerHandler}>
                  <Ionicons name="time-outline" size={24} color="#6200ea" />
                  <Text style={styles.iconButtonText}>
                    {time ? `Time: ${time}` : 'Select Time'}
                  </Text>
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker
                    value={new Date()}
                    mode="time"
                    display="spinner"
                    onChange={onTimeChange}
                  />
                )}
              </View>

              <Button mode="outlined" onPress={handlePrev} style={styles.button}>
                Back
              </Button>
              <Button mode="contained" onPress={handleNext} style={styles.button}>
                Next
              </Button>
            </>
          )}

          {step === 4 && (
            <>
              <Text style={styles.heading}>Step 4: Payment Details</Text>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Button mode="outlined" onPress={() => setMenuVisible(true)}>
                    Payment Method: {paymentDetails || 'Select'}
                  </Button>
                }
              >
                <Menu.Item onPress={() => setPaymentDetails('Credit Card')} title="Credit Card" />
                <Menu.Item onPress={() => setPaymentDetails('UPI')} title="UPI" />
                <Menu.Item onPress={() => setPaymentDetails('Net Banking')} title="Net Banking" />
              </Menu>
              <Button mode="outlined" onPress={handlePrev} style={styles.button}>
                Back
              </Button>
              <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                Submit
              </Button>
            </>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
