import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Image, ScrollView} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { SECONDARY } from '../colors';

const ManageCategories = ({ navigation }) => {
    const [shelves, setShelves] = useState([]);
    const [newShelfName, setNewShelfName] = useState('');
    const [showInput, setShowInput] = useState(false); 
    const auth = getAuth();

    // useEffect(() => {


    //     const database = getDatabase();
    //     const shelvesRef = ref(database, `users/${auth.currentUser.uid}/shelfs/`);

    //     onValue(shelvesRef, (snapshot) => {
    //         const data = snapshot.val();
    //         if (data) {
    //             const shelvesArray = Object.keys(data).map(key => ({ 
    //                 id: key, 
    //                 name: data[key].name, 
    //                 books: Object.keys(data[key]).filter(item => item !== 'newShelfName').map(bookKey => data[key][bookKey])
    //              }));
    //              const book = Object.keys(data).map(shelfKey =>{
    //                 const shelf = data[shelfKey];
    //                 const shelfName = shelf.newShelfName;
    //                 const books = shelf.books ? Object.keys(shelf.books).map(bookKey => shelf.books[bookKey]) : [];
    //                 return {
    //                     name: shelfName,
    //                     books: books
    //                 };
    //              })
    //             console.log(data)
    //             const data1 = JSON.parse(data)
    //             console.log('books', book)
    //             setShelves(data1);
    //         }
    //     });
    // }, []);
    
    useEffect(() => {
        const database = getDatabase();
        const shelvesRef = ref(database, `users/${auth.currentUser.uid}/shelfs/`);
    
        onValue(shelvesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const shelvesArray = Object.keys(data).map(key => ({ 
                    id: key, 
                    name: data[key].newShelfName,
                    books: data[key].books ? Object.values(data[key].books) : [] 
                 }));
                setShelves(shelvesArray);
            }
        });
    }, []);
    

    const BookDetails = ({ genre, books }) => {
        return (
            <View style={styles.container1} >
                <Text style={styles.genre}>{genre}</Text>
                <ScrollView horizontal style={styles.scrollView}>
                    {books.map(book => (
                        <TouchableOpacity key={book.id} style={styles.bookContainer} onPress={()=>navigation.navigate('BookDetails', {book})}>
                            <Image source={{ uri: book.cover }} style={styles.coverImage} />
                            <Text style={styles.title}>{book.title}</Text>
                            <Text style={styles.description} numberOfLines={2}>{book.description}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    };
    

    const handleCreateShelf = () => {
        if (newShelfName.trim() === '') {
            Alert.alert('Error', 'Shelf name cannot be empty');
            return;
        }

        const database = getDatabase();
        const shelfRef = ref(database, `users/${auth.currentUser.uid}/shelfs/${newShelfName}`);

        set(shelfRef, {newShelfName})
            .then(() => {
                Alert.alert('Success', 'New shelf created successfully');
                setNewShelfName('');
                setShowInput(false); 
            })
            .catch(error => {
                console.error('Error creating new shelf:', error.message);
                Alert.alert('Error', 'Failed to create new shelf');
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} >
                    <FontAwesome name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.addCatBtn} onPress={() => setShowInput(true)}>
                    <FontAwesome name='plus' size={24} color={'black'} style={styles.carIcon} />
                    <Text style={styles.catText}>Create New Book Shelf</Text>
                </TouchableOpacity>
            </View>
            {showInput && (
                <View style={styles.newShelfContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Shelf Name"
                        value={newShelfName}
                        onChangeText={setNewShelfName}
                    />
                    <TouchableOpacity style={styles.createButton} onPress={handleCreateShelf}>
                        <Text style={styles.createButtonText}>Create</Text>
                    </TouchableOpacity>
                </View>
            )}
            <ScrollView style={styles.shelvesContainer}>
                {shelves.map((shelf, index) => (
                    <BookDetails key={index} genre={shelf.name} books={shelf.books} />
                ))}
            </ScrollView>

           
        </SafeAreaView>
    );
};

export default ManageCategories;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:SECONDARY
    },
    container1:{
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
        marginTop: 10,
    },
    addCatBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#C5C5C5',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    carIcon: {
        marginRight: 5,
    },
    catText: {
        fontSize: 12,
    },
    newShelfContainer: {
        paddingHorizontal: 15,
        marginTop: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    createButton: {
        backgroundColor: '#C5C5C5',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    shelvesContainer: {
        marginTop: 20,
        flex:1
    },
    shelf: {
        marginBottom: 20,
    },
    shelfName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    booksContainer: {
        marginLeft: 10,
    },
    bookName: {
        fontSize: 16,
        marginBottom: 5,
    },
    genre: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color:'black',
        marginLeft:15
    },
    bookContainer: {
        width:150,
        marginLeft:15
    },
    coverImage: {
        width: 100,
        height: 150,
        marginRight: 10,
        resizeMode:'contain'
    },     
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    authors: {
        marginBottom: 5,
    },
    description: {
        fontSize: 12,
    },
});
