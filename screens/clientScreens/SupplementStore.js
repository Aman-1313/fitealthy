import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
export default function SupplementStore({ navigation }){
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://910692-da.myshopify.com/' }}
        style={styles.webView}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator size="large" color="#6200ea" style={styles.loading} />
        )}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webView: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
  },
});
