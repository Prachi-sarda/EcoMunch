# EcoMunch App

EcoMunch is a mobile application designed to help users track their food items and reduce food waste. The app notifies users about expiring food, tracks items that have been thrown away, and provides weekly reports on their food usage. Additionally, users can search for recipes based on ingredients available in their pantry.

## Features

* Track food items in your pantry and their expiration dates.
* Get notifications about expiring items.
* Track food waste and receive weekly reports.
* Search for recipes based on available ingredients.
* View recipe details with instructions and images.

## Technologies Used

* **React Native**: For building the mobile app.
* **React Navigation**: For navigating between different screens in the app.
* **Realm Database**: For local storage of food items and usage data.
* **Push Notifications**: For notifying users about expiring items and weekly reports.
* **MealDB API**: For fetching recipe suggestions based on available ingredients.

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Prachi-sarda/EcoMunch
cd EcoMunch
```

### 2. Install dependencies
Run the following command to install all required dependencies:

```bash
npm install
```

### 3. Run the app

For Android:
```bash
npx react-native run-android
```

## Usage

1. **Track Food Items**: Add food items to your pantry with their expiration dates. The app will notify you when the items are nearing expiration.

2. **Get Notifications**: The app sends push notifications when an item is close to expiring, as well as a weekly report on how many items were thrown away.

3. **Search for Recipes**: Enter ingredients you have in your pantry to search for recipe suggestions. View the details, including ingredients, instructions, and images.

4. **Weekly Report**: The app tracks the items you've thrown away and gives you a weekly summary to help you reduce food waste.

## Features to be Added

* Meal planning based on available ingredients.
* User authentication and data synchronization across devices.
* Barcode Scanning functionality