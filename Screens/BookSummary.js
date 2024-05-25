import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const BookSummary = ({ navigation, route }) => {
  const { book } = route.params;
  const [summary, setSummary] = useState('');

  useEffect(() => {
    const generateSummary = async () => {
      try {
        const response = await fetch('https://b49f-182-177-63-124.ngrok-free.app/summarize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: book.description,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok', Error.message);
        }
        const data = await response.json();
        console.log(data.huggingface_summary)
        setSummary(data.huggingface_summary);
      } catch (error) {
        console.error('Error generating summary:', error.message);
        Alert.alert('Error', 'Could not generate summary');
      }
    };

    generateSummary();
  }, [book]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.summary}>
        <Text style={styles.titleText}>Book Summary for : <Text style={{fontWeight:'600'}}>{book.title}</Text></Text>
      </View>
      <Text style={styles.summaryText}>{summary}</Text>
    </View>
  );
};

export default BookSummary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  summary: {
    paddingVertical:20
  },
  titleText:{
    fontSize:18
  },
  summaryText:{
    fontSize:20
  }
});
