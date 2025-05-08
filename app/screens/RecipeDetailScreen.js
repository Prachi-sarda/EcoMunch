// import React, { useEffect, useState } from 'react';
// import { ScrollView, View, Text, Image, StyleSheet, Platform } from 'react-native';

// const RecipeDetailScreen = ({ route }) => {
//   const { recipeId } = route.params;
//   const [recipe, setRecipe] = useState(null);

//   useEffect(() => {
//     fetchRecipeDetails();
//   }, []);

//   const fetchRecipeDetails = async () => {
//     try {
//       const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
//       const data = await response.json();
//       setRecipe(data.meals[0]);
//     } catch (error) {
//       console.error('Error fetching recipe details:', error);
//     }
//   };

//   if (!recipe) return <Text>Loading...</Text>;

//   return (
//     <ScrollView contentContainerStyle={styles.scrollViewContainer}>
//       <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
//       <Text style={styles.title}>{recipe.strMeal}</Text>
//       <Text style={styles.category}>{recipe.strCategory}</Text>

//       <Text style={styles.subtitle}>Ingredients:</Text>
//       <View style={styles.ingredientsContainer}>
//         {Object.keys(recipe).filter(key => key.includes('strIngredient') && recipe[key]).map((ingredient, index) => (
//           <Text key={index} style={styles.ingredient}>
//             {recipe[ingredient]} - {recipe[`strMeasure${index + 1}`]}
//           </Text>
//         ))}
//       </View>

//       <Text style={styles.subtitle}>Instructions:</Text>
//       <Text style={styles.instructions}>{recipe.strInstructions}</Text>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollViewContainer: {
//     flexGrow: 1,
//     paddingBottom: Platform.OS === 'ios' ? 80 : 60, // Adjusted to avoid overlap with tab bar (iOS & Android)
//     padding: 16,
//   },
//   image: { width: '100%', height: 250, borderRadius: 8, marginBottom: 16 },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
//   category: { fontSize: 18, color: '#888', marginBottom: 16 },
//   subtitle: { fontSize: 20, fontWeight: '600', marginBottom: 8, marginTop: 16 },
//   ingredientsContainer: { marginBottom: 16 },
//   ingredient: { fontSize: 16, color: '#333', marginBottom: 4 },
//   instructions: { fontSize: 16, color: '#333', lineHeight: 24 },
// });

// export default RecipeDetailScreen;
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const RecipeDetailScreen = ({ route }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  
  useEffect(() => {
    // Fetch the recipe details using the recipeId
    const fetchRecipeDetail = async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
        const data = await response.json();
        setRecipe(data.meals[0]);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      }
    };

    if (recipeId) {
      fetchRecipeDetail();
    }
  }, [recipeId]);

  if (!recipe) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
      <Text style={styles.title}>{recipe.strMeal}</Text>
      <Text>{recipe.strInstructions}</Text>
      {/* Add other details of the recipe as necessary */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default RecipeDetailScreen;
