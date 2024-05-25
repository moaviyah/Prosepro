import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Button, Icon } from 'react-native-elements';
import { PRIMARY, SECONDARY } from '../colors';

const Scan = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  const handleCaptureImage = async () => {
    if (hasCameraPermission === null) {
      Alert.alert('Error', 'Camera permission is not determined yet.');
      return;
    }

    if (hasCameraPermission === false) {
      Alert.alert('Error', 'No access to camera. Please grant camera permissions.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error capturing image:', error.message);
    }
  };

  const handleSendRequest = async () => {
    try {
      if (!image) {
        Alert.alert('Error', 'Please capture an image first');
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append('image', {
        uri: image,
        name: 'image.jpg',
        type: 'image/jpg',
      });
      const response = await fetch('https://b49f-182-177-63-124.ngrok-free.app/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        console.log(response);
        throw new Error('Network response was not ok', response.status);
      }

      const data = await response.json();
      console.log('Response from server:', data);

      const bookName = data.book_name.split(' ').slice(0, 2).join(' ');
      await fetchBooks(bookName);
    } catch (error) {
      console.error('Error sending request:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async (bookName) => {
    try {
      const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
        params: {
          q: `intitle:${bookName}`,
          maxResults: 6,
        },
      });
  
      const filteredBooks = response.data.items
        .map(item => {
          const authors = Array.isArray(item.volumeInfo.authors) ? item.volumeInfo.authors.join(', ') : 'Unknown author';
          return {
            id: item.id,
            title: item.volumeInfo.title,
            authors: authors,
            cover: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192.png?text=No+Image',
            description: item.volumeInfo.description
          };
        })
        .filter(book => !/[.#$\[\]]/.test(book.title));
  
      console.log('Filtered books:', filteredBooks);
      setBooks(filteredBooks);
    } catch (error) {
      Alert.alert('Something went wrong');
      console.log('Error fetching books:', error.message);
    }
  };
  
  

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('BookDetails', { book: item })}>
      <View style={styles.bookContainer}>
        <Image source={{ uri: item.cover }} style={styles.bookCover} />
        <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>{item.authors}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleReset = () => {
    setImage(null);
    setBooks([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Scan</Text>
      </View>
      <View style={styles.imgCon}>
        <TouchableOpacity style={styles.button} onPress={handleCaptureImage}>
          {
            image ? (
              <Image source={{ uri: image }} style={styles.previewImage} resizeMode='contain' />
            )
              :
              (
                <View style={styles.placeholderContainer}>
                  <Image source={require('../assets/upload.png')} style={styles.img} />
                  <Text style={styles.bookText}>
                    Capture Book Cover
                  </Text>
                </View>
              )
          }
        </TouchableOpacity>
        {
          image && (
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Icon name="close" type="font-awesome" color="black" />
            </TouchableOpacity>
          )
        }
      </View>
      {image && !loading && books.length === 0 && (
        <TouchableOpacity style={styles.buttonSend} onPress={handleSendRequest}>
          <Icon name="send" type="font-awesome" color="#fff" />
          <Text style={styles.sendButtonText}>Send request</Text>
        </TouchableOpacity>
      )}
      {loading && <ActivityIndicator size="large" style={styles.loader} />}
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

export default Scan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SECONDARY,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  imgCon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
    height: 110,
  },
  buttonSend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
    alignSelf: 'center',
  },
  sendButtonText: {
    color: '#fff',
    marginLeft: 10,
  },
  img: {
    height: 60,
    width: 60,
    resizeMode: 'contain',
  },
  bookText: {
    fontWeight: '700',
    marginTop: 10,
    textAlign:'center'
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 100,
    borderRadius: 10,
  },
  resetButton: {
    position: 'absolute',
    top: -10,
    right: 5,
    borderRadius: 20,
    padding: 5,
    color:'black'
  },
  loader: {
    marginVertical: 20,
  },
  flatListContent: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  bookContainer: {
    width: 115,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookCover: {
    width: 100,
    height: 150,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  bookTitle: {
    marginVertical: 5,
    marginHorizontal: 5,
    fontWeight: '700',
    textAlign: 'center',
  },
  bookAuthor: {
    textAlign: 'center',
    fontSize: 12,
    color: '#06070D',
  },
  placeholderContainer: {
    alignItems: 'center',
  },
});
