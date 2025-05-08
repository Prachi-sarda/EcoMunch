    // Dummy logic to simulate permission request (no actual camera functionality)

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const BarcodeScanner = ({ navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  useEffect(() => {
    console.log("BarcodeScanner: Component mounted");
    setHasCameraPermission(true);
  }, []);

  return (
    <View style={styles.container}>
      {hasCameraPermission ? (
        <Text>Camera permission granted. (Camera not functional here)</Text>
      ) : (
        <Text>Requesting Camera Permission...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BarcodeScanner;

// // import React, { useState, useEffect } from 'react';
// // import { 
// //   StyleSheet, 
// //   Text, 
// //   View, 
// //   TouchableOpacity, 
// //   ActivityIndicator, 
// //   Alert,
// //   Linking
// // } from 'react-native';
// // import { RNCamera } from 'react-native-camera';
// // import { useNavigation } from '@react-navigation/native';
// // import { realm } from '../components/Schema';
// // import moment from 'moment';

// // const BarcodeScanner = () => {
// //   const [scanning, setScanning] = useState(true);
// //   const [processingBarcode, setProcessingBarcode] = useState(false);
// //   const [torchOn, setTorchOn] = useState(false);
// //   const [product, setProduct] = useState(null);
// //   const navigation = useNavigation();

// //   // Reset scanning when coming back to this screen
// //   useEffect(() => {
// //     const unsubscribe = navigation.addListener('focus', () => {
// //       setScanning(true);
// //       setProcessingBarcode(false);
// //       setProduct(null);
// //     });

// //     return unsubscribe;
// //   }, [navigation]);

// //   // const handleBarCodeRead = async ({ type, data }) => {
// //   //   // Prevent multiple scans
// //   //   if (processingBarcode) return;
    
// //   //   try {
// //   //     setProcessingBarcode(true);
// //   //     setScanning(false);
      
// //   //     // Fetch product data from Open Food Facts API
// //   //     const productData = await fetchProductFromAPI(data);
      
// //   //     if (productData) {
// //   //       setProduct(productData);
// //   //       // Navigate to AddItem screen with the product data
// //   //       navigation.navigate('AddItem', { 
// //   //         productData: productData
// //   //       });
// //   //     } else {
// //   //       Alert.alert(
// //   //         "Product Not Found", 
// //   //         "We couldn't find information for this barcode. Would you like to add it manually?",
// //   //         [
// //   //           {
// //   //             text: "Cancel",
// //   //             onPress: () => {
// //   //               setScanning(true);
// //   //               setProcessingBarcode(false);
// //   //             },
// //   //             style: "cancel"
// //   //           },
// //   //           { 
// //   //             text: "Add Manually", 
// //   //             onPress: () => navigation.navigate('AddItem')
// //   //           }
// //   //         ]
// //   //       );
// //   //     }
// //   //   } catch (error) {
// //   //     console.error('Barcode processing error:', error);
// //   //     Alert.alert(
// //   //       "Error", 
// //   //       "There was a problem scanning this barcode. Please try again or add the item manually.",
// //   //       [
// //   //         { 
// //   //           text: "OK", 
// //   //           onPress: () => {
// //   //             setScanning(true);
// //   //             setProcessingBarcode(false);
// //   //           }
// //   //         }
// //   //       ]
// //   //     );
// //   //   }
// //   // };
// //   const handleBarCodeRead = async ({ type, data }) => {
// //     if (processingBarcode) return;
  
// //     try {
// //       setProcessingBarcode(true);
// //       setScanning(false);
  
// //       const productData = await fetchProductFromAPI(data);
  
// //       if (productData) {
// //         setProduct(productData);
// //         // Use setTimeout to delay navigation slightly to ensure the component is not prematurely unmounted
// //         setTimeout(() => {
// //           navigation.navigate('AddItem', { productData });
// //           setProcessingBarcode(false);
// //         }, 100); 
// //       } else {
// //         Alert.alert(
// //           "Product Not Found", 
// //           "We couldn't find information for this barcode. Would you like to add it manually?",
// //           [
// //             {
// //               text: "Cancel",
// //               onPress: () => {
// //                 setScanning(true);
// //                 setProcessingBarcode(false);
// //               },
// //               style: "cancel"
// //             },
// //             { 
// //               text: "Add Manually", 
// //               onPress: () => navigation.navigate('AddItem')
// //             }
// //           ]
// //         );
// //       }
// //     } catch (error) {
// //       console.error('Barcode processing error:', error);
// //       Alert.alert(
// //         "Error", 
// //         "There was a problem scanning this barcode. Please try again or add the item manually.",
// //         [
// //           { 
// //             text: "OK", 
// //             onPress: () => {
// //               setScanning(true);
// //               setProcessingBarcode(false);
// //             }
// //           }
// //         ]
// //       );
// //     }
// //   };
  

// //   const fetchProductFromAPI = async (barcode) => {
// //     try {
// //       const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
// //       const data = await response.json();
      
// //       if (data.status === 1) {
// //         // Product found, extract relevant information
// //         const product = {
// //           name: data.product.product_name || 'Unknown Product',
// //           brand: data.product.brands || '',
// //           imageUrl: data.product.image_url || null,
// //           barcode: barcode,
// //           category: data.product.categories_tags ? 
// //             data.product.categories_tags[0]?.replace('en:', '') : 'Other',
// //           quantity: 1,
// //           expirationDate: calculateDefaultExpirationDate(data.product.categories_tags),
// //           // Add any other fields you need
// //         };
// //         return product;
// //       } else {
// //         // Product not found in database
// //         return null;
// //       }
// //     } catch (error) {
// //       console.error('API fetch error:', error);
// //       return null;
// //     }
// //   };

// //   const calculateDefaultExpirationDate = (categories) => {
// //     // Default expiration dates based on food categories
// //     // This is a simple example - you might want to refine this logic
// //     let daysToAdd = 7; // Default: 1 week
    
// //     if (!categories || categories.length === 0) {
// //       return moment().add(daysToAdd, 'days').toDate();
// //     }
    
// //     const category = categories[0].toLowerCase();
    
// //     if (category.includes('fresh') && category.includes('vegetable')) {
// //       daysToAdd = 7; // Fresh vegetables: 1 week
// //     } else if (category.includes('fresh') && category.includes('fruit')) {
// //       daysToAdd = 7; // Fresh fruit: 1 week
// //     } else if (category.includes('dairy')) {
// //       daysToAdd = 14; // Dairy products: 2 weeks
// //     } else if (category.includes('meat')) {
// //       daysToAdd = 5; // Meat: 5 days
// //     } else if (category.includes('bakery')) {
// //       daysToAdd = 4; // Bakery: 4 days
// //     } else if (category.includes('frozen')) {
// //       daysToAdd = 90; // Frozen food: 3 months
// //     } else if (category.includes('canned') || category.includes('preserved')) {
// //       daysToAdd = 365; // Canned/preserved: 1 year
// //     }
    
// //     return moment().add(daysToAdd, 'days').toDate();
// //   };

// //   const toggleTorch = () => {
// //     setTorchOn(!torchOn);
// //   };

// //   // const renderCamera = () => {
// //   //   if (!scanning) {
// //   //     return (
// //   //       <View style={styles.loadingContainer}>
// //   //         <ActivityIndicator size="large" color="#3CB371" />
// //   //         <Text style={styles.loadingText}>Processing barcode...</Text>
// //   //       </View>
// //   //     );
// //   //   }

// //   //   return (
// //   //     <View style={styles.cameraContainer}>
// //   //       <RNCamera
// //   //         style={styles.camera}
// //   //         type={RNCamera.Constants.Type.back}
// //   //         flashMode={torchOn ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
// //   //         androidCameraPermissionOptions={{
// //   //           title: 'Permission to use camera',
// //   //           message: 'We need your permission to use your camera to scan barcodes',
// //   //           buttonPositive: 'OK',
// //   //           buttonNegative: 'Cancel',
// //   //         }}
// //   //         onBarCodeRead={handleBarCodeRead}
// //   //         captureAudio={false}
// //   //       >
// //   //         <View style={styles.overlay}>
// //   //           <View style={styles.scanFrame} />
// //   //         </View>
          
// //   //         <View style={styles.controls}>
// //   //           <TouchableOpacity style={styles.torchButton} onPress={toggleTorch}>
// //   //             <Text style={styles.torchText}>
// //   //               {torchOn ? '🔦 Turn Off Light' : '🔦 Turn On Light'}
// //   //             </Text>
// //   //           </TouchableOpacity>
            
// //   //           <TouchableOpacity 
// //   //             style={styles.manualButton} 
// //   //             onPress={() => navigation.navigate('AddItem')}
// //   //           >
// //   //             <Text style={styles.manualButtonText}>Add Item Manually</Text>
// //   //           </TouchableOpacity>
// //   //         </View>
// //   //       </RNCamera>
// //   //     </View>
// //   //   );
// //   // };
// //   const renderCamera = () => {
// //     if (!scanning) {
// //       return (
// //         <View style={styles.loadingContainer}>
// //           <ActivityIndicator size="large" color="#3CB371" />
// //           <Text style={styles.loadingText}>Processing barcode...</Text>
// //         </View>
// //       );
// //     }
  
// //     return (
// //       <View style={styles.cameraContainer}>
// //         {RNCamera ? (
// //           <RNCamera
// //             style={styles.camera}
// //             type={RNCamera.Constants.Type.back}
// //             flashMode={torchOn ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
// //             androidCameraPermissionOptions={{
// //               title: 'Permission to use camera',
// //               message: 'We need your permission to use your camera to scan barcodes',
// //               buttonPositive: 'OK',
// //               buttonNegative: 'Cancel',
// //             }}
// //             onBarCodeRead={handleBarCodeRead}
// //             captureAudio={false}
// //           >
// //             <View style={styles.overlay}>
// //               <View style={styles.scanFrame} />
// //             </View>
// //           </RNCamera>
// //         ) : (
// //           <Text style={styles.loadingText}>Camera not initialized</Text>
// //         )}
// //       </View>
// //     );
// //   };
  

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.header}>
// //         <Text style={styles.headerText}>Scan Product Barcode</Text>
// //         <Text style={styles.instructionText}>
// //           Position the barcode within the frame to scan
// //         </Text>
// //       </View>
      
// //       {renderCamera()}
      
// //       <View style={styles.footer}>
// //         <Text style={styles.footerText}>
// //           Data provided by Open Food Facts
// //         </Text>
// //         <TouchableOpacity 
// //           onPress={() => Linking.openURL('https://world.openfoodfacts.org/')}
// //         >
// //           <Text style={styles.linkText}>Learn More</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f8f8f8',
// //   },
// //   header: {
// //     paddingVertical: 20,
// //     paddingHorizontal: 16,
// //     backgroundColor: '#fff',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#e0e0e0',
// //     alignItems: 'center',
// //   },
// //   headerText: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },
// //   instructionText: {
// //     fontSize: 14,
// //     color: '#666',
// //     marginTop: 6,
// //   },
// //   cameraContainer: {
// //     flex: 1,
// //     overflow: 'hidden',
// //   },
// //   camera: {
// //     flex: 1,
// //     justifyContent: 'flex-end',
// //   },
// //   overlay: {
// //     ...StyleSheet.absoluteFillObject,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0,0,0,0.4)',
// //   },
// //   scanFrame: {
// //     width: 250,
// //     height: 250,
// //     borderWidth: 2,
// //     borderColor: '#3CB371',
// //     backgroundColor: 'transparent',
// //   },
// //   controls: {
// //     position: 'absolute',
// //     bottom: 30,
// //     left: 0,
// //     right: 0,
// //     alignItems: 'center',
// //   },
// //   torchButton: {
// //     backgroundColor: 'rgba(0,0,0,0.6)',
// //     paddingHorizontal: 20,
// //     paddingVertical: 10,
// //     marginBottom: 20,
// //     borderRadius: 20,
// //   },
// //   torchText: {
// //     color: '#fff',
// //     fontSize: 16,
// //   },
// //   manualButton: {
// //     backgroundColor: '#3CB371',
// //     paddingHorizontal: 20,
// //     paddingVertical: 12,
// //     borderRadius: 25,
// //   },
// //   manualButtonText: {
// //     color: '#fff',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#f8f8f8',
// //   },
// //   loadingText: {
// //     marginTop: 16,
// //     fontSize: 16,
// //     color: '#333',
// //   },
// //   footer: {
// //     padding: 16,
// //     backgroundColor: '#fff',
// //     alignItems: 'center',
// //     borderTopWidth: 1,
// //     borderTopColor: '#e0e0e0',
// //   },
// //   footerText: {
// //     fontSize: 12,
// //     color: '#999',
// //   },
// //   linkText: {
// //     fontSize: 12,
// //     color: '#3CB371',
// //     marginTop: 4,
// //     textDecorationLine: 'underline',
// //   },
// // });

// // export default BarcodeScanner;


// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, Alert, Platform, PermissionsAndroid } from 'react-native';
// import { RNCamera } from 'react-native-camera';

// const BarcodeScanner = ({ navigation }) => {
//   const [hasCameraPermission, setHasCameraPermission] = useState(false);

//   useEffect(() => {
//     console.log("BarcodeScanner: Component mounted");
//     requestCameraPermission();
//   }, []);

//   const requestCameraPermission = async () => {
//     console.log("Requesting Camera Permission...");
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: "Camera Permission",
//             message: "We need your permission to use the camera for scanning.",
//             buttonNeutral: "Ask Me Later",
//             buttonNegative: "Cancel",
//             buttonPositive: "OK"
//           }
//         );

//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           console.log("Camera permission granted");
//           setHasCameraPermission(true);
//         } else {
//           console.log("Camera permission denied");
//           Alert.alert("Camera permission denied");
//         }
//       } catch (err) {
//         console.log("Error requesting camera permission:", err);
//       }
//     } else {
//       setHasCameraPermission(true);
//     }
//   };

//   const handleBarCodeRead = ({ data }) => {
//     console.log("Scanned barcode data:", data);
//     Alert.alert("Scanned Barcode", `Data: ${data}`);
//   };

//   const renderCamera = () => {
//     console.log("Rendering Camera...");
//     return (
//       <RNCamera
//         style={styles.camera}
//         type={RNCamera.Constants.Type.back}
//         onBarCodeRead={handleBarCodeRead}
//         captureAudio={false}
//         onCameraReady={() => {
//           console.log("Camera Ready");
//         }}
//         onMountError={(error) => {
//           console.log("Camera Mount Error:", error);
//           Alert.alert("Camera Error", `Error initializing camera: ${error.message}`);
//         }}
//       />
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {hasCameraPermission ? renderCamera() : <Text>Requesting Camera Permission...</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   camera: {
//     width: '100%',
//     height: '100%',
//   },
// });

// export default BarcodeScanner;