// const express = require('express');
// const cors = require('cors');
// const fetch = require('node-fetch'); // ✅ REQUIRED to fetch from MealDB

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ✅ Basic route
// app.get('/', (req, res) => {
//   res.send('Backend is running!');
// });

// // ✅ Recipes route (calls TheMealDB)
// app.get('/recipes', async (req, res) => {
//   const searchTerm = req.query.search || '';  // If no search term, default to empty string

//   try {
//     const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`);
//     const data = await response.json();
//     res.json(data.meals || []);
//   } catch (err) {
//     console.error('Fetch error:', err);
//     res.status(500).json({ error: 'Failed to fetch recipes from MealDB' });
//   }
// });

// const PORT = 5000;
// const HOST = '10.70.46.120';  // Your local IP

// app.listen(PORT, HOST, () => {
//   console.log(`Server is running at http://${HOST}:${PORT}`);
// });

// // const express = require('express');
// // const cors = require('cors');
// // const fetch = require('node-fetch'); // for fetching data from MealDB

// // const app = express();
// // app.use(cors());
// // app.use(express.json());

// // // Test route
// // app.get('/', (req, res) => {
// //   res.send('Backend is running!');
// // });

// // // Get recipes from TheMealDB
// // app.get('/recipes', async (req, res) => {
// //   try {
// //     const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
// //     const data = await response.json();
// //     res.json(data.meals || []);
// //   } catch (err) {
// //     res.status(500).json({ error: 'Failed to fetch recipes from MealDB' });
// //   }
// // });

// // const PORT = 5000;
// // const HOST = '10.70.46.120'; // 🔁 Replace with your local IP
// // app.listen(PORT, HOST, () => {
// //   console.log(`Server running at http://${HOST}:${PORT}`);
// // });
