import React, { useState, useEffect } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { realm } from '../components/Schema';
import moment from 'moment';

// Categories for food items
const CATEGORIES = [
  'Dairy', 'Meat', 'Fruit', 'Vegetable', 'Bakery', 
  'Frozen', 'Canned', 'Beverage', 'Snack', 'Other'
];

const AddItemScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const productData = route.params?.productData;
  
  // Form state
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [category, setCategory] = useState('Other');
  const [expirationDate, setExpirationDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // Default: 1 week
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [barcode, setBarcode] = useState('');
  const [imageUrl, setImageUrl] = useState(null);

  // Pre-fill form if product data is available from barcode scan
  useEffect(() => {
    if (productData) {
      setName(productData.name || '');
      setQuantity(String(productData.quantity) || '1');
      setCategory(productData.category || 'Other');
      setExpirationDate(productData.expirationDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
      setBarcode(productData.barcode || '');
      setImageUrl(productData.imageUrl || null);
    }
  }, [productData]);

  const onDateChange = (event, selectedDate) => {
    // Always hide date picker first
    setShowDatePicker(false);
    
    // Only update if a date was actually selected
    if (selectedDate) {
      setExpirationDate(selectedDate);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const saveItem = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for the item');
      return;
    }
  
    try {
      const newName = name.trim();
      const newQuantity = parseInt(quantity.trim() || '1', 10);
      const newNotes = notes.trim();
  
      const items = realm.objects('ItemDB');
      const highestId = items.sorted('id', true)[0]?.id ?? 0;
      const newId = highestId + 1;
  
      realm.write(() => {
        realm.create('ItemDB', {
          id: newId,
          name: newName,
          quantity: newQuantity,
          category: category,
          expirationDate: expirationDate,
          createdTimestamp: new Date(),
          image: imageUrl,
          notes: newNotes,
          barcode: barcode,
          binned: false,
          used: false,
        });
      });
  
      Alert.alert(
        'Success',
        'Item added successfully!',
        [
          {
            text: 'Add Another',
            onPress: resetForm,
            style: 'cancel',
          },
          {
            text: 'Go to Items',
            onPress: () => navigation.navigate('MyItems'),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert('Error', 'Could not save the item. Please try again.');
    }
  };
  
  const resetForm = () => {
    setName('');
    setQuantity('1');
    setCategory('Other');
    setExpirationDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    setNotes('');
    setBarcode('');
    setImageUrl(null);
  };

  // Calculate days until expiration
  const daysUntilExpiration = () => {
    const today = moment().startOf('day');
    const expiry = moment(expirationDate).startOf('day');
    return expiry.diff(today, 'days');
  };

  // Get color for expiration date display
  const getExpirationColor = () => {
    const days = daysUntilExpiration();
    if (days < 0) return '#FF6B6B'; // Expired - red
    if (days <= 2) return '#FFA500'; // Soon - orange
    return '#3CB371'; // Good - green
  };

  return (
    <ScreenWrapper>
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          {/* Product Image */}
          {imageUrl ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUrl }} style={styles.productImage} />
            </View>
          ) : null}

          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Item Name*</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter item name"
              placeholderTextColor="#999"
            />
          </View>

          {/* Quantity & Category Row */}
          <View style={styles.rowContainer}>
            {/* Quantity Input */}
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                placeholder="1"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            {/* Category Picker */}
            <View style={[styles.inputGroup, { flex: 2 }]}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerContainer}>
                {(
                  <View style={styles.androidPickerWrapper}>
                    <Picker
                      selectedValue={category}
                      onValueChange={(itemValue) => setCategory(itemValue)}
                      style={styles.androidPicker}
                      dropdownIconColor="#555"
                    >
                      {CATEGORIES.map((cat) => (
                        <Picker.Item key={cat} label={cat} value={cat} style={{color: '#000'}} />
                      ))}
                    </Picker>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Expiration Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Expiration Date</Text>
            <TouchableOpacity onPress={showDatepicker} style={styles.dateButton}>
              <Text style={[styles.dateText, { color: getExpirationColor() }]}>
                {moment(expirationDate).format('MMM DD, YYYY')} 
                {' '}
                <Text style={styles.daysText}>
                  ({daysUntilExpiration()} days {daysUntilExpiration() >= 0 ? 'remaining' : 'overdue'})
                </Text>
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={expirationDate}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>
          {/* Notes Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional information"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Barcode Display (if scanned) */}
          {barcode ? (
            <View style={styles.barcodeContainer}>
              <Text style={styles.barcodeLabel}>Barcode: {barcode}</Text>
            </View>
          ) : null}

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={saveItem}>
            <Text style={styles.saveButtonText}>Save Item</Text>
          </TouchableOpacity>
          
          {/* Scan Barcode Button
          <TouchableOpacity 
            style={styles.scanButton} 
            onPress={() => navigation.navigate('BarcodeScanner')}
          >
            <Text style={styles.scanButtonText}>Scan Barcode Instead</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
      
    </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  productImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#000',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#000',
  },
  pickerItem: {
    color: '#000',
    fontSize: 16,
  },
  androidPickerWrapper: {
    height: 50,
    justifyContent: 'center',
  },
  androidPicker: {
    height: 50,
    color: '#000',
    backgroundColor: 'transparent',
  },
  dateButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  daysText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#666',
  },
  barcodeContainer: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  barcodeLabel: {
    color: '#666',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#3CB371',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3CB371',
  },
  scanButtonText: {
    color: '#3CB371',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AddItemScreen;