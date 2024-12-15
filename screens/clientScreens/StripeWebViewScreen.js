import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function StripeWebViewScreen({route}) {
  const {link} = route.params;
  console.log(link);
    const handleWebViewMessage = (event) => {
      const { status } = JSON.parse(event.nativeEvent.data);
      console.log(status);
      if (status === 'success') {
        Alert.alert('Payment Successful', 'Thank you for your payment!');
        navigation.goBack(); // Navigate back to the previous screen
      } else if (status === 'failure') {
        Alert.alert('Payment Failed', 'Your payment could not be completed.');
        navigation.goBack();
      }
    };
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: 'https://buy.stripe.com/test_5kA00t15U0x85i0144' }}
        style={{ flex: 1 }}
        onMessage={handleWebViewMessage}
        onError={(error) => {
          console.error('WebView error:', error);
          alert('There was an error loading the payment page.');
        }}
      />
    </View>
  );
}
