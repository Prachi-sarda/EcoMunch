import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenWrapper from '../components/ScreenWrapper';
import { realm } from '../components/Schema.js';

const HomeScreen = ({ navigation }) => {
  const [usageData, setUsageData] = useState({ consumed: 0, binned: 0, donated: 0 });
  const [expiringItems, setExpiringItems] = useState([]);
  const [recipeSuggestions, setRecipeSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipeRequested, setRecipeRequested] = useState(false); // To track if recipe suggestions are requested
  const [weeklyStats, setWeeklyStats] = useState({ purchased: 0, consumed: 0, binned: 0, donated: 0 });

  useEffect(() => {
    // Initialize data on mount
    fetchUsageData();
    fetchExpiringItems();
    fetchWeeklyStats();
    
    // Set up the listeners safely
    try {
      const usageObjects = realm.objects('UsageDB');
      const itemsObjects = realm.objects('ItemDB');
      
      // Add listeners with safer callbacks
      const usageListener = () => {
        fetchUsageData();
        fetchWeeklyStats();
      };
      const itemsListener = () => {
        fetchExpiringItems();
        fetchWeeklyStats();
      };
      
      usageObjects.addListener(usageListener);
      itemsObjects.addListener(itemsListener);

      // Cleanup listeners when the component unmounts
      return () => {
        try {
          usageObjects.removeListener(usageListener);
          itemsObjects.removeListener(itemsListener);
        } catch (error) {
          console.log('Error removing listeners:', error);
        }
      };
    } catch (error) {
      console.log('Error setting up listeners:', error);
    }
  }, []);

  const fetchUsageData = () => {
    try {
      const usageEntries = realm.objects('UsageDB');
      let consumed = 0, binned = 0, donated = 0;

      usageEntries.forEach((entry) => {
        if (entry.eaten) consumed += entry.eaten;
        if (entry.binned) binned += entry.binned;
        if (entry.donated) donated += entry.donated; // Add donated tracking
      });

      setUsageData({ consumed, binned, donated });
    } catch (error) {
      console.log('Error fetching usage data:', error);
    }
  };

  const fetchExpiringItems = () => {
    try {
      const currentDate = new Date();
      const items = realm.objects('ItemDB');
      
      // Filter items that are not binned/used and have an expiration date
      const activeItems = items.filtered('expirationDate != null');
      
      // Sort by expiration date (ascending) and take the first 3
      const sortedItems = Array.from(activeItems).sort((a, b) => {
        return a.expirationDate - b.expirationDate;
      }).slice(0, 3);
      
      setExpiringItems(sortedItems);
    } catch (error) {
      console.log('Error fetching expiring items:', error);
    }
  };

  const fetchWeeklyStats = () => {
    try {
      // Get timestamp for 7 days ago
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      // Get items created in the last week (purchased)
      const recentItems = realm.objects('ItemDB').filtered('createdTimestamp >= $0', oneWeekAgo);
      const purchased = recentItems.length;
      
      // Get usage data for the last week
      const recentUsage = realm.objects('UsageDB').filtered('createdTimestamp >= $0', oneWeekAgo);
      
      let consumed = 0;
      let binned = 0;
      let donated = 0;
      
      recentUsage.forEach(entry => {
        if (entry.eaten) consumed += entry.eaten;
        if (entry.binned) binned += entry.binned;
        if (entry.donated) donated += entry.donated; // Add donated tracking
      });
      
      setWeeklyStats({ purchased, consumed, binned, donated });
    } catch (error) {
      console.log('Error fetching weekly stats:', error);
    }
  };
  
  const fetchRecipeSuggestions = async (ingredient) => {
    setLoading(true);
    setRecipeSuggestions([]); // Clear previous suggestions
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${ingredient}`);
      const data = await response.json();
      setRecipeSuggestions(data.meals || []);
    } catch (err) {
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
      setRecipeRequested(true); // Mark that suggestions have been requested
    }
  };
  
  const calculateDaysLeft = (expirationDate) => {
    try {
      const currentDate = new Date();
      const expiryDate = new Date(expirationDate);
      const timeDiff = expiryDate - currentDate;
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
      return daysLeft > 0 ? daysLeft : 0;
    } catch (error) {
      console.log('Error calculating days left:', error);
      return 0;
    }
  };

  const renderRecipeItem = ({ item }) => (
    <View style={styles.recipeCard}>
      <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle}>{item.strMeal}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('RecipeStack', { screen: 'RecipeDetail', params: { recipeId: item.idMeal } })}>
        <Text style={styles.viewDetails}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  // Calculate consumption percentage safely - now includes donated as positive usage
  const getConsumptionPercentage = () => {
    const totalUsed = weeklyStats.consumed + weeklyStats.binned + weeklyStats.donated;
    if (totalUsed === 0) return 0;
    // Count both consumed and donated as positive usage (not waste)
    return Math.round(((weeklyStats.consumed + weeklyStats.donated) / totalUsed) * 100);
  };

  // Calculate wastage percentage safely - now includes donated in total
  const getWastagePercentage = () => {
    const total = usageData.consumed + usageData.binned + usageData.donated;
    if (total === 0) return 0;
    return (usageData.binned / total * 100).toFixed(1);
  };

  // Calculate donation percentage
  const getDonationPercentage = () => {
    const total = usageData.consumed + usageData.binned + usageData.donated;
    if (total === 0) return 0;
    return (usageData.donated / total * 100).toFixed(1);
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        {/* <View style={styles.header}>
          <TouchableOpacity style={styles.profileIcon}>
            <Icon name="person-circle-outline" size={30} color="black" />
          </TouchableOpacity>
        </View> */}

        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>ALERT! ITEMS EXPIRING SOON!</Text>
          {expiringItems.length === 0 ? (
            <Text>No items expiring soon.</Text>
          ) : (
            expiringItems.map((item, index) => {
              const daysLeft = calculateDaysLeft(item.expirationDate);
              return (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>- {item.name}</Text>
                    <Text style={styles.daysLeft}>{daysLeft} days left</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => fetchRecipeSuggestions(item.name)}
                  >
                    <Text style={styles.viewRecipes}>Get Recipe</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
          <View style={styles.viewAllContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('RecipeStack')}>
              <Text style={styles.viewAll}>View All Recipes →</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MyItems')}>
              <Text style={styles.viewAll}>View All Items →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recipe Suggestions Container */}
        {recipeRequested && (
          <View style={styles.recipeBox}>
            <Text style={styles.sectionTitle}>Recipe Suggestions</Text>
            {loading ? (
              <Text>Loading recipes...</Text>
            ) : (
              <FlatList
                data={recipeSuggestions}
                keyExtractor={(item) => item.idMeal}
                renderItem={renderRecipeItem}
                style={styles.recipeList}
                ListEmptyComponent={<Text>No recipes found</Text>}
              />
            )}
          </View>
        )}

        {/* Analysis Dashboard */}
        <View style={styles.dashboard}>
          <Text style={styles.sectionTitle}>ANALYSIS DASHBOARD</Text>
          
          <View style={styles.insightCard}>
            <Icon name="trash-outline" size={24} color="#ff3b30" style={styles.insightIcon} />
            <View style={styles.insightContent}>
              <Text style={styles.wastageText}>Food Wasted: {getWastagePercentage()}%</Text>
              <Text style={styles.wastageNote}>Reducing waste helps the environment!</Text>
            </View>
          </View>
          
          {/* Added Donation Card
          <View style={styles.insightCard}>
            <Icon name="gift-outline" size={24} color="#4CAF50" style={styles.insightIcon} />
            <View style={styles.insightContent}>
              <Text style={styles.donationText}>Food Donated: {getDonationPercentage()}%</Text>
              <Text style={styles.donationNote}>Your donations help those in need!</Text>
            </View>
          </View> */}
          
          {/* Weekly Food Management Stats */}
          <View style={styles.weeklyStatsContainer}>
            <Text style={styles.weeklyStatsTitle}>Last 7 Days Activity</Text>
            
            <View style={styles.statsRow}>
              <View style={[styles.statItem, { backgroundColor: '#E3F2FD' }]}>
                <Icon name="cart-outline" size={22} color="#2196F3" />
                <Text style={styles.statValue}>{weeklyStats.purchased}</Text>
                <Text style={styles.statLabel}>Purchased</Text>
              </View>
              
              <View style={[styles.statItem, { backgroundColor: '#E8F5E9' }]}>
                <Icon name="restaurant-outline" size={22} color="#4CAF50" />
                <Text style={styles.statValue}>{weeklyStats.consumed}</Text>
                <Text style={styles.statLabel}>Consumed</Text>
              </View>
              
              <View style={[styles.statItem, { backgroundColor: '#FFEBEE' }]}>
                <Icon name="trash-bin-outline" size={22} color="#F44336" />
                <Text style={styles.statValue}>{weeklyStats.binned}</Text>
                <Text style={styles.statLabel}>Trashed</Text>
              </View>
            </View>
            
            {/* Progress bar showing consumption ratio */}
            <View style={styles.progressContainer}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>Utilization Rate</Text>
                <Text style={styles.progressPercentage}>
                  {getConsumptionPercentage()}%
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${getConsumptionPercentage()}%` }
                  ]} 
                />
              </View>
            </View>
          </View>
          
          {/* Food Usage Tips - Based on actual data */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>
              <Icon name="bulb-outline" size={18} color="#FFC107" /> Food Management Tips
            </Text>
            {weeklyStats.binned > (weeklyStats.consumed + weeklyStats.donated) ? (
              <Text style={styles.tipText}>You're throwing away more than you use. Try meal planning to reduce waste.</Text>
            ) : weeklyStats.binned > ((weeklyStats.consumed + weeklyStats.donated) * 0.3) ? (
              <Text style={styles.tipText}>You're doing okay, but could improve by checking expiration dates regularly.</Text>
            ) : weeklyStats.donated > 0 ? (
              <Text style={styles.tipText}>Great job donating food and keeping waste minimal! Keep tracking your items to maintain this trend.</Text>
            ) : (
              <Text style={styles.tipText}>Great job keeping waste minimal! Consider donating unused items before they expire.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileIcon: { padding: 8 },

  alertBox: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#ffe4e1',
  },
  alertTitle: { fontWeight: 'bold', marginBottom: 12 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ffcccb',
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10,
  },
  itemName: {
    flex: 1,
  },
  daysLeft: {
    width: 80,
    textAlign: 'center',
  },
  viewRecipes: {
    color: 'blue',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  viewAll: {
    color: 'blue',
    marginTop: 8,
  },

  recipeBox: {
    marginTop: 24,
    padding: 16,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#f0fff0',
  },

  recipeCard: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  recipeImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  recipeTitle: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  viewDetails: {
    color: 'blue',
    marginTop: 4,
  },
  
  recipeList: {
    marginTop: 16,
  },

  dashboard: {
    marginTop: 24,
    padding: 16,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#e6f7ff',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 16,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  insightIcon: {
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  wastageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff3b30',
  },
  wastageNote: {
    fontStyle: 'italic',
    marginTop: 4,
    color: '#666',
  },
  donationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  donationNote: {
    fontStyle: 'italic',
    marginTop: 4,
    color: '#666',
  },
  weeklyStatsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  weeklyStatsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    alignItems:'center'
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },

    tipsCard: {
      backgroundColor: '#FFFDE7',
      borderRadius: 8,
      padding: 12,
      marginVertical: 4,
      borderLeftWidth: 4,
      borderLeftColor: '#FFC107',
    },
    tipsTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#333',
    },
    tipText: {
      fontSize: 13,
      color: '#555',
      lineHeight: 18,
    },
  });
  
  export default HomeScreen;