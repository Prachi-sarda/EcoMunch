import React, { useState, useEffect } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from 'react-native';

const RecipeGeneratorScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=chicken`);
      const data = await response.json();
      setSuggestions(data.meals || []);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  };

  const fetchRecipes = async () => {
    if (!searchTerm.trim()) return;

    try {
      Keyboard.dismiss();
      setHasSearched(true);
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm.trim())}`);
      const data = await response.json();
      setRecipes(data.meals || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
      <Text style={styles.title}>{item.strMeal}</Text>
      <Text style={styles.category}>{item.strCategory}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.idMeal })} // Navigating to RecipeDetail
      >
        <Text>See Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper>
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Recipe Finder</Text>

      <TextInput
        style={styles.input}
        placeholder="Search for a recipe..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={fetchRecipes}
      />
      <TouchableOpacity onPress={fetchRecipes} style={styles.button}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {hasSearched && (
        <>
          <Text style={styles.subHeading}>Search Results</Text>
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.idMeal}
            renderItem={renderItem}
            style={styles.list}
            ListEmptyComponent={<Text style={styles.noResults}>No search results</Text>}
          />
        </>
      )}

      <Text style={styles.subHeading}>Suggested Recipes</Text>
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.idMeal}
        renderItem={renderItem}
        style={[styles.list, { height: hasSearched ? '50%' : 'auto' }]}
      />
    </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  subHeading: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  input: {
    borderColor: '#ccc', borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10,
  },
  button: {
    backgroundColor: '#6c5ce7', padding: 12, borderRadius: 8, alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  list: { marginBottom: 20 },
  card: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 12,
    padding: 12, alignItems: 'center',
  },
  image: { width: 200, height: 200, borderRadius: 8, marginBottom: 8 },
  title: { fontSize: 18, fontWeight: 'bold' },
  category: { color: '#666' },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});

export default RecipeGeneratorScreen;
