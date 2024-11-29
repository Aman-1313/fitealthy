import React, { useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const YouTubeVideos = ({ videoIds }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVideos, setFilteredVideos] = useState(videoIds || []);
  const navigation = useNavigation();

  // Filter videos based on the search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = videoIds.filter((video) =>
      video.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredVideos(filtered);
  };

  return (
    <View style={styles.container}>
      <View style={styles.appbar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('AccountInfo')}>
          <Ionicons name="menu" size={30} color="#6200ea" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>Media</Text>
      </View>

      <Text style={styles.greeting}>Explore, Learn, and Implement!</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search videos..."
        value={searchQuery}
        onChangeText={(text) => handleSearch(text)}
      />

      {filteredVideos.length === 0 ? (
        <Text style={styles.noResults}>No videos found.</Text>
      ) : (
        <FlatList
          data={filteredVideos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.videoCard}>
              <WebView
                source={{ uri: `https://www.youtube.com/embed/${item.id}?rel=0&playsinline=1` }}
                style={styles.webView}
                javaScriptEnabled
                domStorageEnabled
                allowsFullscreenVideo
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
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
  greeting: {
    fontSize: 18,
    margin: 10,
    fontFamily: 'CustomFont-Bold',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  videoCard: {
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    elevation: 3,
  },
  webView: {
    flex: 1,
  },
  noResults: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },
});

export default YouTubeVideos;
