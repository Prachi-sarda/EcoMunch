import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { realm } from '../components/Schema'; // Ensure Realm is properly set up
import ScreenWrapper from '../components/ScreenWrapper';
import Dialog from "react-native-dialog";

class MyItemsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [], 
      selectedItem: null,
      showLogDialog: false,
      showDeleteDialog: false,
      eaten: '',
      binned: '',
      donated: '', 
    };
  }

  componentDidMount() {
    this.loadItems();
      this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.loadItems();
    });
  }
  
  componentWillUnmount() {
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  // Load items from Realm
  loadItems = () => {
    try {
      const items = realm.objects('ItemDB'); // Fetch all items from the 'ItemDB' schema
      this.setState({ items: Array.from(items) }); // Convert to array to avoid realm issues
    } catch (error) {
      console.log('Error loading items:', error);
    }
  };

  formatExpirationDate = (date) => {
    return new Date(date).toLocaleDateString(); // Simple formatting for the date
  };

  deleteItem = (itemId) => {
    try {
      realm.write(() => {
        const itemToDelete = realm.objects('ItemDB').filtered(`id == "${itemId}"`)[0];
        if (itemToDelete) {
          realm.delete(itemToDelete);
        }
      });
      this.loadItems(); // Reload the items after deletion
      Alert.alert('Item deleted successfully!');
    } catch (error) {
      console.log('Error deleting item:', error);
      Alert.alert('Error', 'Failed to delete item');
    }
  };
  
  logUsagePrompt = (item) => {
    this.setState({ 
      selectedItem: item, 
      showLogDialog: true, 
      eaten: '', 
      binned: '',
      donated: '' // Reset donated field
    });
  };
  
  confirmDeleteWithWaste = (item) => {
    this.setState({ 
      selectedItem: item, 
      showDeleteDialog: true, 
      binned: '',
      donated: '' // Reset donated field
    });
  };
  
  handleLogSave = () => {
    const { selectedItem, eaten, binned, donated } = this.state;
    
    // Parse input values as integers, defaulting to 0 if invalid
    const eatenInt = parseInt(eaten) || 0;
    const binnedInt = parseInt(binned) || 0;
    const donatedInt = parseInt(donated) || 0;
    
    // Calculate total usage
    const totalUsed = eatenInt + binnedInt + donatedInt;
  
    // Validate total doesn't exceed available quantity
    if (totalUsed > selectedItem.quantity) {
      Alert.alert('Error', 'Total exceeds available quantity');
      return;
    }
  
    try {
      // Log the usage
      this.logUsage(selectedItem.name, binnedInt, eatenInt, donatedInt);
    
      realm.write(() => {
        const itemToUpdate = realm.objects('ItemDB').filtered(`id == "${selectedItem.id}"`)[0];
        if (itemToUpdate) {
          const remaining = itemToUpdate.quantity - totalUsed;
          if (remaining <= 0) {
            realm.delete(itemToUpdate);
          } else {
            itemToUpdate.quantity = remaining;
          }
        }
      });
    
      this.setState({ showLogDialog: false });
      this.loadItems();
    } catch (error) {
      console.log('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item');
    }
  };
  
  handleDeleteConfirm = () => {
    const { selectedItem, binned, donated } = this.state;
    
    // Parse input values as integers, defaulting to 0 if invalid
    const binnedInt = parseInt(binned) || 0;
    const donatedInt = parseInt(donated) || 0;
    const totalDisposed = binnedInt + donatedInt;
  
    if (totalDisposed > selectedItem.quantity) {
      Alert.alert('Error', 'Invalid quantity');
      return;
    }
    
    try {
      // Log usage with eaten=0
      this.logUsage(selectedItem.name, binnedInt, 0, donatedInt);
      
      // Delete the item
      this.deleteItem(selectedItem.id);
      this.setState({ showDeleteDialog: false });
    } catch (error) {
      console.log('Error in delete confirmation:', error);
      Alert.alert('Error', 'Operation failed');
    }
  };
  
  // Updated to include donated parameter
  logUsage = (itemName, binned, eaten, donated) => {
    try {
      realm.write(() => {
        realm.create('UsageDB', {
          id: `${itemName}-${new Date().getTime()}`,
          itemName,
          binned,
          eaten,
          donated, // Add donated to usage log
          createdTimestamp: new Date(),
        });
      });
    } catch (error) {
      console.log('Error logging usage:', error);
      throw error; // Re-throw to be caught by caller
    }
  };
    
  // Render each item in the list
  renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemBoldText}>{item.name}</Text>
        <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
        <Text style={styles.itemText}>Expires on: {this.formatExpirationDate(item.expirationDate)}</Text>
        {/* <Text style={styles.itemText}>Notes: {item.notes}</Text> */}
        {item.notes && item.notes.trim() !== '' && (
      <Text style={styles.itemText}>Notes: {item.notes}</Text>
    )}
  
        {/* EDIT BUTTON */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => this.logUsagePrompt(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
  
        {/* DELETE BUTTON */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => this.confirmDeleteWithWaste(item)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        
      </View>
    );
  };

  render() {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <FlatList
            data={this.state.items}
            keyExtractor={(item) => item.id}
            renderItem={this.renderItem}
            contentContainerStyle={styles.listContainer}
            extraData={this.state} // Add extraData to ensure re-render when state changes
          />
          
          {/* Usage Logging Dialog - Now with donated field */}
          <Dialog.Container visible={this.state.showLogDialog}>
            <Dialog.Title>Log Usage</Dialog.Title>
            <Dialog.Input
              label="How much did you eat?"
              keyboardType="numeric"
              onChangeText={(text) => this.setState({ eaten: text })}
              value={this.state.eaten}
            />
            <Dialog.Input
              label="How much did you throw away?"
              keyboardType="numeric"
              onChangeText={(text) => this.setState({ binned: text })}
              value={this.state.binned}
            />
            <Dialog.Input
              label="How much did you donate?"
              keyboardType="numeric"
              onChangeText={(text) => this.setState({ donated: text })}
              value={this.state.donated}
            />
            <Dialog.Button label="Cancel" onPress={() => this.setState({ showLogDialog: false })} />
            <Dialog.Button label="Save" onPress={this.handleLogSave} />
          </Dialog.Container>

          {/* Waste/Donate Before Deletion Dialog */}
          <Dialog.Container visible={this.state.showDeleteDialog}>
            <Dialog.Title>Disposal Details</Dialog.Title>
            <Dialog.Input
              label="How much did you throw away?"
              keyboardType="numeric"
              onChangeText={(text) => this.setState({ binned: text })}
              value={this.state.binned}
            />
            <Dialog.Input
              label="How much did you donate?"
              keyboardType="numeric"
              onChangeText={(text) => this.setState({ donated: text })}
              value={this.state.donated}
            />
            <Dialog.Button label="Cancel" onPress={() => this.setState({ showDeleteDialog: false })} />
            <Dialog.Button label="Delete" onPress={this.handleDeleteConfirm} />
          </Dialog.Container>
        </View>
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  itemBoldText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#3CB371',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default MyItemsScreen;