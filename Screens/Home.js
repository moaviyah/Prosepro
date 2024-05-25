import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PRIMARY } from '../colors';
import axios from 'axios';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth } from '@firebase/auth';

const Home = ({navigation}) => {
  const [libraryBooks, setLibraryBooks] = useState([]);
  const [similarBooks, setSimilarBooks] = useState([]);
  const database = getDatabase();
  const auth = getAuth();
  
  const fixData = {
    title:'Apollo',
    description:   'Fritz Graf here presents a survey of a god once thought of as the most powerful of gods, and capable of great wrath should he be crossed: Apollo the sun god. From his first attestations in Homer, through the complex question of pre-Homeric Apollo, to the opposition between Apollo and Dionysos in nineteenth and twentieth-century thinking, Graf examines Greek religion and myth to provide a full account of Apollo in the ancient world. For students of Greek religion and culture, of myth and legend, and in the fields of art and literature, Apollo will provide an informative and enlightening introduction to this powerful figure from the past.'
  }
  useEffect(() => {
    fetchBooks();
    fetchLibraryBooks();
  }, []);
  
  const fetchBooks = async () => {
    const currentUser = auth.currentUser.uid; // Replace this with the actual user ID
    const userRef = ref(database, `users/${currentUser}/interests`);

    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const interests = snapshot.val();
        const booksPromises = Object.values(interests).map(async interest => {
          const similarBook = await fetchSimilarBook(interest);
          return similarBook;
        });
        const fetchedBooks = await Promise.all(booksPromises);
        setSimilarBooks(fetchedBooks.flat().reverse());
      } else {
        console.log('Interest not found for the current user.');
      }
    } catch (error) {
      console.error('Error fetching interest:', error);
    }
  };
  const fetchLibraryBooks = async () => {
    const currentUser = auth.currentUser.uid;
    const userRef = ref(database, `users/${currentUser}/shelfs`);
  
    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const shelfs = snapshot.val();
        if (shelfs && typeof shelfs === 'object') {
          const allBooks = Object.values(shelfs).flatMap(shelf => shelf.books ? Object.values(shelf.books) : []);
          setLibraryBooks(allBooks);
        } else {
          console.log('Shelfs data is not an object:', shelfs);
        }
      } else {
        console.log('No shelfs found for the current user.');
      }
    } catch (error) {
      console.error('Error fetching shelfs:', error);
    }
  };
  
  const fetchSimilarBook = async (bookTitle) => {
    try {
      const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
        params: {
          q: `intitle:${bookTitle}`,
          maxResults: 5, // Fetch more results to ensure we have enough after filtering
        },
      });
      if (response.data.items && response.data.items.length > 0) {
        const books = response.data.items
          .map(item => {
            const bookInfo = item.volumeInfo;
            return {
              title: bookInfo.title,
              authors: bookInfo.authors,
              description: bookInfo.description,
              cover: bookInfo.imageLinks?.thumbnail,
            };
          })
          .filter(book => book.title.toLowerCase() !== bookTitle.toLowerCase()) // Filter out books with the exact same title
          .slice(0, 5)
          ; // Limit the results to 5 books
        return books;
      } else {
        console.log(`No similar book found for '${bookTitle}'.`);
        return [];
      }
    } catch (error) {
      console.error('Error fetching similar book:', error);
      return [];
    }
  };
  
  return (
    <View style={styles.container}>
      <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar barStyle={'dark-content'} />
        <Image source={require('../assets/mainIcon.png')} style={{height:200, width:200, alignSelf:'center'}} resizeMode='contain' />
        <View style={styles.bookOfTheWeek}>
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle}>This week’s Book</Text>
            <Text style={styles.bookSubtitle}>Apollo</Text>
            <TouchableOpacity style={styles.checkSummaryButton} onPress={()=>navigation.navigate('BookSummary', {book: fixData})}>
              <Text style={styles.checkSummaryButtonText}>Check Summary</Text>
            </TouchableOpacity>
          </View>
          <Image
            style={styles.bookImage}
            source={require('../assets/appolo.png')}
          />
        </View>

        {
          libraryBooks.length > 0 ? 
          <Text style={styles.recommendationsTitle}>Recommended for you:</Text> :
          <Text style={styles.recommendationsTitle}>No new recommendations</Text>
        }
  
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={similarBooks}
          renderItem={({item}) => (
            <TouchableOpacity style={[styles.recommendationItem, { maxWidth: 200 }]} onPress={() => navigation.navigate('BookDetails', {book: item})}>
              <Image style={styles.recommendationImage} source={{ uri: item.cover }} resizeMode='contain' />
              <Text style={styles.recommendationTitle} numberOfLines={3}>{item.title}</Text>
              <Text style={styles.recommendationAuthors} numberOfLines={2}>{item.authors?.join(', ')}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => `${item.title}-${index}`}
        />
        {
          similarBooks.length > 0 ? 
          <Text style={styles.recommendationsTitle}>Your Library:</Text> : 
          <Text style={styles.recommendationsTitle}>Nothing in Library</Text>
        }
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={libraryBooks}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.recommendationItem, { maxWidth: 200 }]} onPress={() => navigation.navigate('BookDetails', {book: item})}>
              <Image style={styles.recommendationImage} source={{ uri: item?.cover }} resizeMode='contain' />
              <Text style={styles.recommendationTitle} numberOfLines={3}>{item?.title}</Text>
              <Text style={styles.recommendationAuthors} numberOfLines={2}>{item?.authors?.join(', ')}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      </ScrollView>
      </SafeAreaView>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal:20,
  },
  header: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bookOfTheWeek: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bookSubtitle: {
    fontSize: 16,
    color: 'gray',
  },
  checkSummaryButton: {
    backgroundColor: PRIMARY,
    borderRadius: 20,
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center'
  },
  checkSummaryButtonText: {
    color: '#fff',
  },
  recommendationsTitle:{
    fontSize:16,
    fontWeight:'600',
    marginBottom:10
  },
  bookImage: {
    width: 100,
    height: 130,
    borderRadius: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'purple',
    marginHorizontal: 4,
  },
  inactiveDot: {
    backgroundColor: 'lightgray',
  },
  recommendationTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: 150,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  recommendationItem: {
    alignItems: 'center',
  },
  recommendationImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  recommendationTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  recommendationPrice: {
    color: 'purple',
  },

  recommendationItem: {
    alignItems: 'center',
    marginBottom: 20,
  },
  recommendationImage: {
    width: 150,
    height: 200,
    borderRadius: 10,
  },
  recommendationTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recommendationAuthors: {
    marginTop: 5,
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  recommendationDescription: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Home;
