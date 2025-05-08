// import React, { Component } from 'react';
// import { AppState, StyleSheet } from 'react-native';
// import PushNotification from 'react-native-push-notification';
// import { realm } from './components/Schema.js';
// import Navigation from './navigations/Navigation';  // Importing the Navigation file
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { NavigationContainer } from '@react-navigation/native';
// function pluralize(word, count) {
//   return count == 1 ? word : word + 's';
// }

// export default class App extends Component {
//   constructor(props) {
//     super(props);
//     this.handleAppStateChange = this.handleAppStateChange.bind(this);
//     this.state = {
//       expiringItemsCount: this.getExpiringItemsCount(),
//       binnedItems: this.getBinnedItems(),
//     };
//   }

//   componentDidMount() {
//     this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);

//     this.timer = setInterval(() => {
//       this.setState({ expiringItemsCount: this.getExpiringItemsCount() });
//       this.setState({ binnedItems: this.getBinnedItems() });
//     }, 4000);
//   }

//   componentWillUnmount() {
//     if (this.appStateSubscription) {
//       this.appStateSubscription.remove();
//     }
//     clearInterval(this.timer);
//   }

//   handleAppStateChange(appState) {
//     if (appState === 'background') {
//       if (this.state.expiringItemsCount > 0) {
//         let date = new Date(Date.now() + 5 * 1000);  // Set notification date for expiring items
//         let message = this.getNotificationMessage();
//         PushNotification.localNotificationSchedule({
//           message: message,
//           date: date,
//           repeatType: 'day',
//         });
//       }

//       // Schedule a weekly usage reminder
//       let weeklyDate = new Date(Date.now() + 10 * 1000);  // Weekly notification date
//       let weeklyMessage = this.getWeeklyUsageMessage();
//       PushNotification.localNotificationSchedule({
//         message: weeklyMessage,
//         date: weeklyDate,
//         repeatType: 'week',
//       });
//     }
//   }

//   getExpiringItemsCount() {
//     let specificDay = new Date();
//     let nextDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
//     let itemsExpiringToday = this.queryDatabase('ItemDB', 'expirationDate >= $0 && expirationDate < $1', specificDay, nextDay);
//     return itemsExpiringToday.length;
//   }

//   getBinnedItems() {
//     let startOfWeek = new Date(new Date().getTime() - 168 * 60 * 60 * 1000);
//     let endOfWeek = new Date();
//     return this.queryDatabase('UsageDB', 'createdTimestamp >= $0 && createdTimestamp < $1 && binned = 1', startOfWeek, endOfWeek);
//   }

//   getNotificationMessage() {
//     return `You have ${this.state.expiringItemsCount} ${pluralize('item', this.state.expiringItemsCount)} that will expire today`;
//   }

//   getWeeklyUsageMessage() {
//     if (this.state.binnedItems.length < 5) {
//       return `You threw away ${this.state.binnedItems.length} ${pluralize('item', this.state.binnedItems.length)} this week 👍`;
//     } else {
//       return `You threw away ${this.state.binnedItems.length} ${pluralize('item', this.state.binnedItems.length)} this week 😩`;
//     }
//   }

//   queryDatabase(databaseName, filteredBy, startDate, endDate) {
//     let results = [realm.objects(databaseName).filtered(filteredBy, startDate, endDate)];
//     let resultsObject = results.map(x => Object.assign({}, x));
//     return Object.values(resultsObject[0]);
//   }

//   render() {
//     return (
//       <GestureHandlerRootView style={styles.container}>
//         <Navigation />
//       </GestureHandlerRootView>
//     );
//   }
  
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

import React, { useEffect, useState } from 'react';
import { AppState, StyleSheet } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { realm } from './components/Schema.js';
import Navigation from './navigations/Navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  const [expiringItemsCount, setExpiringItemsCount] = useState(0);
  const [binnedItems, setBinnedItems] = useState([]);
  
  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', handleAppStateChange);

    const interval = setInterval(() => {
      setExpiringItemsCount(getExpiringItemsCount());
      setBinnedItems(getBinnedItems());
    }, 4000);

    // Cleanup
    return () => {
      appStateListener.remove();
      clearInterval(interval);
    };
  }, []);

  const handleAppStateChange = (appState) => {
    if (appState === 'background') {
      if (expiringItemsCount > 0) {
        const date = new Date(Date.now() + 5 * 1000);
        const message = `You have ${expiringItemsCount} ${pluralize('item', expiringItemsCount)} that will expire today.`;

        PushNotification.localNotificationSchedule({
          message: message,
          date: date,
          repeatType: 'day',
        });
      }

      // Weekly usage reminder
      const weeklyDate = new Date(Date.now() + 10 * 1000);
      const weeklyMessage = getWeeklyUsageMessage();

      PushNotification.localNotificationSchedule({
        message: weeklyMessage,
        date: weeklyDate,
        repeatType: 'week',
      });
    }
  };

  const getExpiringItemsCount = () => {
    const specificDay = new Date();
    const nextDay = new Date(specificDay.getTime() + 24 * 60 * 60 * 1000);
    
    const itemsExpiringToday = queryDatabase(
      'ItemDB',
      'expirationDate >= $0 && expirationDate < $1',
      specificDay,
      nextDay
    );

    return itemsExpiringToday.length;
  };

  const getBinnedItems = () => {
    const startOfWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endOfWeek = new Date();

    return queryDatabase(
      'UsageDB',
      'createdTimestamp >= $0 && createdTimestamp < $1 && binned = 1',
      startOfWeek,
      endOfWeek
    );
  };

  const getWeeklyUsageMessage = () => {
    if (binnedItems.length < 5) {
      return `You threw away ${binnedItems.length} ${pluralize('item', binnedItems.length)} this week 👍`;
    } else {
      return `You threw away ${binnedItems.length} ${pluralize('item', binnedItems.length)} this week 😩`;
    }
  };

  const pluralize = (word, count) => {
    return count === 1 ? word : word + 's';
  };

  const queryDatabase = (databaseName, filteredBy, startDate, endDate) => {
    try {
      const results = realm.objects(databaseName).filtered(filteredBy, startDate, endDate);
      return Array.from(results);
    } catch (error) {
      console.error(`Database query error: ${error.message}`);
      return [];
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Navigation />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;