import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, FlatList, TouchableOpacity,TextInput, Image, ActivityIndicator, ScrollView } from 'react-native';
import { PRIMARY, SECONDARY } from '../colors';

const Explore = ({ navigation }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1); 
    const [searchQuery, setSearchQuery] = useState('');
    const genres = ['History', 'Fiction', 'Biography', 'Programming', 'Science fiction', 'Self-help'];
    const [selectedGenre, setSelectedGenre] = useState(null);
    const randomGenre = genres[Math.floor(Math.random() * genres.length)];

    useEffect(() => {
        fetchBooks(); 
    }, []);

    // const fetchBooks = async () => {
    //     setLoading(true);
    //     const apiKey = 'AIzaSyAmg66vWmqsOhAiZBrNu0rX6f4cf1JZc7E';
    //     const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=programming&maxResults=30&page=${page}&key=${apiKey}`;

    //     try {
    //         const response = await fetch(apiUrl);
    //         const data = await response.json();
    //         const newBooks = data.items.map(item => ({
    //             id: item.id,
    //             title: item.volumeInfo.title,
    //             cover: item.volumeInfo.imageLinks?.thumbnail,
    //         }));
    //         setBooks(prevBooks => [...prevBooks, ...newBooks]);
    //     } catch (error) {
    //         console.error('Error fetching books:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const fetchBooks = async () => {
        const query = searchQuery.trim() ? searchQuery : randomGenre;

        setLoading(true);
        const apiKey = 'AIzaSyAmg66vWmqsOhAiZBrNu0rX6f4cf1JZc7E';
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5&page=${page}&key=${apiKey}`;
    
        try {
            const response = await fetch(apiUrl);
            console.log(response)
            const data = await response?.json();
            console.log('data', data)
            const newBooks = data?.items.map(item => ({
                id: item?.id,
                key: item?.id + Math.random(), 
                title: item?.volumeInfo.title,
                authors: item?.volumeInfo.authors || [], 
                publishedDate: item?.volumeInfo.publishedDate,
                description: item?.volumeInfo.description,
                cover: item?.volumeInfo.imageLinks?.thumbnail,
            }));
            setBooks(prevBooks => [...prevBooks, ...newBooks]);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleSearch = () => {
        setBooks([]); // Clear existing books
        setPage(1); // Reset page to 1
        fetchBooks();
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
    const selectGenre = (genre) => {
        setSelectedGenre(genre);
        setBooks([]); // Clear existing books when selecting a new genre
        setPage(1); // Reset page to 1
        fetchBooks()
    };

    const loadMoreBooks = () => {
        setPage(page + 1);
        fetchBooks();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Image source={require('../assets/sesarchBook.png')} style={{height:30, width:30}}/>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>
            <ScrollView horizontal style={styles.genreScrollView} showsHorizontalScrollIndicator={false}>
                {genres.map((genre, index) => (
                    <TouchableOpacity key={index} onPress={() => selectGenre(genre)} style={selectedGenre === genre ? styles.genreButton : styles.selectedGenreButton}>
                        <Text style={styles.genreButtonText}>{genre}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <FlatList
                data={books}
                renderItem={renderItem}
                // keyExtractor={item => item.id}
                numColumns={3}
                contentContainerStyle={styles.flatListContent}
                onEndReached={loadMoreBooks}
                onEndReachedThreshold={0.1}
                ListFooterComponent={loading ? 
                
                    <ActivityIndicator size="large" color="black" />
               
                 : null}
            />
        </SafeAreaView>
    );
};

export default Explore;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal:5,
        backgroundColor: SECONDARY,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        height: 45,
        borderWidth: 1,
        borderColor: PRIMARY,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    searchButton: {
        marginLeft: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    searchButtonText: {
        fontSize:10
    },
    genreScrollView: {
        paddingVertical: 10,
    },
    genreButton: {
        paddingHorizontal: 15,
        marginHorizontal: 5,
        borderRadius: 5,
        backgroundColor: PRIMARY,
        height:30,
        alignItems:'center',
        justifyContent:'center'
    },
    selectedGenreButton: {
        paddingHorizontal: 15,
        height:30,
        marginHorizontal: 10,
        borderRadius: 5,
        backgroundColor: 'orange', 
        alignItems:'center',
        justifyContent:'center'
    },
    genreButtonText: {
        color: SECONDARY,
        fontWeight: 'bold',
    },
    flatListContent: {
      justifyContent:'center',
      alignItems:'center',
      
    },
    bookContainer: {
        width:115,
        marginVertical:10,
        borderRadius:10,

    },
    bookCover: {
        width: 100,
        height: 150,
        resizeMode: 'contain',
        borderRadius:10
    },
    bookTitle: {
       marginVertical:5, 
       marginHorizontal:5,
       fontWeight:'700',
    },
    bookAuthor:{
        textAlign:'left',
        fontSize:12,
        color:'#06070D'
    }
});
