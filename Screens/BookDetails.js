import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Modal, FlatList, Dimensions, Alert } from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { PRIMARY, SECONDARY } from '../colors';
import { getDatabase, ref, onValue, set, push, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

const BookDetails = ({ navigation, route }) => {
    const { book } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [shelves, setShelves] = useState([]);
    const auth = getAuth();
    
    useEffect(() => {
        fetchShelves();
    }, []);

    const fetchShelves = () => {
        const database = getDatabase();
        const shelvesRef = ref(database, `users/${auth.currentUser.uid}/shelfs`);

        onValue(shelvesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const shelvesArray = Object.keys(data).map(key => ({
                    id: key,
                    name: data[key].newShelfName
                }));
                setShelves(shelvesArray);
            }
        });
    };

    const handleAddToLibrary = () => {
        setModalVisible(true);
    };

    const addToShelf = (shelfId) => {
        console.log('Shelf ID:', shelfId);
        console.log('Book title:', book.title);
        const database = getDatabase();
        const shelfRef = ref(database, `users/${auth.currentUser.uid}/shelfs/${shelfId}/books/${book.title}`);
        const interestRef = ref(database, `users/${auth.currentUser.uid}/interests`)
        set(shelfRef, book)
            .then(() => {
                const bookInterestVar = book.title
                push(interestRef,  bookInterestVar)
                setModalVisible(false);
                console.log('Book added to shelf successfully');
            })
            .catch(error => {
                Alert.alert('Error adding book to shelf:', error.message);
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesome name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.bookDetailsContainer}>
                    <Image source={{ uri: book.cover }} style={styles.bookCover} />
                    <Text style={styles.title}>{book.title}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleAddToLibrary}>
                            <Ionicons name="add-circle-outline" size={24} color={PRIMARY} />
                            <Text style={styles.buttonText}>Add to Library</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('BookSummary', {book})}>
                            <Ionicons name="clipboard-outline" size={24} color={PRIMARY} />
                            <Text style={styles.buttonText}>Check Summary</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.author}>{book.authors}</Text>
                        <Text style={styles.publishedDate}>{book.publishedDate}</Text>
                    </View>
                    <Text style={styles.description}>{book.description}</Text>
                </View>
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Select Shelf</Text>
                        <FlatList
                            data={shelves}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.shelfItem}
                                    onPress={() => addToShelf(item.id)}
                                >
                                    <Text>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item.id}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default BookDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: SECONDARY,
    },
    header: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    bookDetailsContainer: {
        paddingBottom: 20,
    },
    bookCover: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    author: {
        fontWeight: 'bold',
    },
    publishedDate: {
        fontStyle: 'italic',
    },
    description: {
        marginBottom: 10,
        fontSize: 20,
        textAlign: 'justify',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8ff8',
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 5,
    },
    buttonText: {
        marginLeft: 5,
    },
    centeredView: {
        flex: 1,
        marginTop: '50%',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
    },
    shelfItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        width:windowWidth,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: PRIMARY,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
