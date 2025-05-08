import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

const ScreenWrapper = ({ children }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>EcoMunch</Text>
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  header: {
    height: 80,
    backgroundColor: '#3CB371',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { height: 2, width: 1 },
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 10,
  },
});

export default ScreenWrapper;
