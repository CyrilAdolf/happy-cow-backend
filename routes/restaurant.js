const express = require("express");
const router = express.Router();
// IMPORT JSON
const Restaurants = require("../Restaurants.json");

// HOMEPAGE ROUTE (FETCH)
router.get("/aroundme", (req, res) => {
  try {
    let { lat, lng, limit } = req.query;
    let results = [];
    Restaurants.map((restaurant, i) => {
      if (
        Math.abs(lat - restaurant.location.lat) <= 0.01 &&
        Math.abs(lng - restaurant.location.lng) <= 0.01 &&
        results.length < limit
      ) {
        results.push(restaurant);
      }
    });
    // SEND MAX 20 RESULTS
    res.status(200).json(results);
    console.log("Answer HOME request");
  } catch (error) {
    console.log(error.message);
    res.status(400).json("message : ", error.message);
  }
});

// SEARCHBAR
router.post("/searchbar", (req, res) => {
  const { location } = req.query;
  // COPY RESTAURANT ARRAY
  let results = Restaurants.slice();
  // DEAL WITH MULTIPLE WORDS SEARCH
  let words = location.split(" ");
  try {
    words.map((word, i) => {
      // WE ARE GONNA SCREEN USING EACH WORD
      for (let i = Restaurants.length - 1; i >= 0; i--) {
        // MAP IS NOT A VALABLE SOLUTION BECAUSE WE WANT TO SCREEN IN REVERSE SIDE (INDEX FOR SPLICE)
        if (Restaurants[i].address) {
          // ADDRESS IS NEEDED
          let array = Restaurants[i].address.split(" ");
          let toSplice = true;
          for (let j = 0; j < array.length; j++) {
            if (array[j].toLowerCase().startsWith(word.toLowerCase())) {
              toSplice = false;
              // IF AT LEAST ONE WORD OF THE ADRESS ARRAY MATCH WITH SEARCHED WORD, KEEP THE ELEMENT
            }
          }
          if (toSplice) {
            results.splice(i, 1);
            // REMOVE RESULT FROM THE LIST IF NO MATCH DETECTED
          }
        }
      }
    });
    res.status(200).json(results);
    console.log("reponse à la requete search");
  } catch (error) {
    console.log(error.message);
    res.status(400).json("message : ", error.message);
  }
});

// GET RESULTS VIA ID
router.post("/restaurant/nearby", (req, res) => {
  const { id } = req.fields;
  // console.log(id);
  try {
    let results = [];
    for (let i = 0; i < id.length; i++) {
      Restaurants.map((restaurant, index) => {
        if (restaurant.placeId === id[i]) {
          results.push(restaurant);
          console.log("request add");
        }
      });
    }
    res.status(200).json(results);
  } catch (error) {
    console.log(error.message);
    res.status(400).json("Error message : ", error.message);
    console.log("request failed");
  }
});

module.exports = router;
