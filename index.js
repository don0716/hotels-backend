const express = require("express");
const app = express();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const { initializeDatabase } = require("./db/db.connect");
initializeDatabase();

const Hotel = require("./models/hotel.model");

const newHotel = {
  name: "New Hotel",
  category: "Mid-Range",
  location: "123 Main Street, Frazer Town",
  rating: 4.0,
  reviews: [],
  website: "https://hotel-example.com",
  phoneNumber: "+1234567890",
  checkInTime: "2:00 PM",
  checkOutTime: "12:00 PM",
  amenities: ["Laundry", "Room Service"],
  priceRange: "$$$ (31-60)",
  reservationsNeeded: true,
  isParkingAvailable: true,
  isWifiAvailable: true,
  isPoolAvailable: false,
  isSpaAvailable: false,
  isRestaurantAvailable: true,
  photos: [
    "https://example.com/hotel-photo1.jpg",
    "https://example.com/hotel-photo2.jpg",
  ],
};

const createHotel = async (newHotel) => {
  try {
    const hotel = new Hotel(newHotel);
    const saveHotel = await hotel.save();
    console.log("New Hotel Data:: ", saveHotel);
    return saveHotel;
  } catch (error) {
    console.log("There was an error", error);
  }
};

app.post("/hotels", async (req, res) => {
  try {
    const savedHotel = await createHotel(req.body);
    if (savedHotel) {
      res
        .status(201)
        .json({ message: "Hotel Added Successfully.", hotel: savedHotel });
    } else {
      res.status(401).json({ error: "There was an error." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add Hotel" });
  }
});

const readAllHotels = async () => {
  try {
    const allHotels = await Hotel.find();
    return allHotels;
  } catch (error) {
    console.log("There was an error", error);
  }
};
app.get("/hotels", async (req, res) => {
  try {
    const hotels = await readAllHotels();
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(401).json({ error: "No Hotels Found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Hotels Data." });
  }
});

// 4. Create a function to read a hotel by its name ("Lake View"). Console the restaurant details of Lake View hotel. Use proper function and variable names.
const readHotelByName = async (hotelName) => {
  try {
    const hotel = await Hotel.find({ name: hotelName });
    return hotel;
  } catch (error) {
    console.log("There was an error ", error);
  }
};
app.get("/hotels/name/:hotelName", async (req, res) => {
  try {
    const hotel = await readHotelByName(req.params.hotelName);
    if (hotel.length != 0) {
      res.json(hotel);
    } else {
      res.status(400).json({ error: "Hotel NOt FOund." });
    }
  } catch (error) {
    res.status(500).json({ error: "Hotel Not Found. ", error });
  }
});

// 5. Create a function to read all hotels which offers parking space. Console all the hotel details.
const readAllHotelsThatOfferParkingSpace = async () => {
  try {
    const hotels = await Hotel.find({ isParkingAvailable: true });
    return hotels;
  } catch (error) {
    console.log(error);
  }
};
app.get("/hotels/parking", async (req, res) => {
  try {
    const hotel = await readAllHotelsThatOfferParkingSpace();
    if (hotel.length != 0) {
      res.json(hotel);
    } else {
      res.status(404).json({ message: "No hotels with Parking found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels with parking." });
  }
});

// 6. Create a function to read all hotels which has restaurant available. Console all the hotels.
const readAllHotelsThatHaveRestaurant = async () => {
  try {
    const hotels = await Hotel.find({ isRestaurantAvailable: true });
    return hotels;
  } catch (error) {
    console.log(error);
  }
};
app.get("/hotels/restaurant", async (req, res) => {
  try {
    const hotel = await readAllHotelsThatHaveRestaurant();
    if (hotel.length != 0) {
      res.json(hotel);
    } else {
      res.status(404).json({ message: "No hotels with Restaurant found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels with Restaurant." });
  }
});

// 7. Create a function to read all hotels by category ("Mid-Range"). Console all the mid range hotels.
const readAllHotelsInMidRangeCategory = async (hotelcategory) => {
  try {
    const hotels = await Hotel.find({ category: { $in: [hotelcategory] } });
    return hotels;
  } catch (error) {
    console.log(error);
  }
};
app.get("/hotels/category/:hotelcategory", async (req, res) => {
  try {
    const hotel = await readAllHotelsInMidRangeCategory(
      req.params.hotelcategory
    );
    if (hotel.length != 0) {
      res.json(hotel);
    } else {
      res.status(404).json({ message: "No hotels In This Category." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels." });
  }
});

// 8. Create a function to read all hotels by price range ("$$$$ (61+)"). Console all the hotels.
const readAllHotelsByPriceRange = async () => {
  try {
    const hotels = await Hotel.find({ priceRange: { $in: ["$$$ (31-60)"] } });
    return hotels;
  } catch (error) {
    console.log(error);
  }
};
app.get("/hotels/pricerange", async (req, res) => {
  try {
    const hotel = await readAllHotelsByPriceRange();
    if (hotel.length != 0) {
      res.json(hotel);
    } else {
      res.status(404).json({ message: "No hotels In This price Range." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels." });
  }
});

// 9. Create a function to read all hotels with 4.0 rating. Console the hotels.
const readHotelsWithRating = async (hotelRating) => {
  try {
    const hotels = await Hotel.find({ rating: hotelRating });
    return hotels;
  } catch (error) {
    console.log(error);
  }
};
app.get("/hotels/rating/:hotelrating", async (req, res) => {
  try {
    const hotel = await readHotelsWithRating(req.params.hotelrating);
    if (hotel.length != 0) {
      res.json(hotel);
    } else {
      res.status(404).json({ message: "No hotels with this Rating." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels." });
  }
});

// 10. Create a function to read a hotel by phone number ("+1299655890"). Console the hotel data.

// Delete Hotel
const deleteHotel = async (hotelId) => {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);
    return deletedHotel;
  } catch (error) {
    console.log(error);
  }
};
app.delete("/hotels/:hotelId", async (req, res) => {
  try {
    const deletedHotel = await deleteHotel(req.params.hotelId);
    if (deletedHotel) {
      res.status(200).json({
        message: "Successfully Deleted Hotel",
        hotel: deletedHotel,
      });
    } else {
      res.status(500).json({ error: "Failed to Delete Hotel" });
    }
  } catch (error) {
    res.status.json({ error: "Failed to delete Hotel" });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log("Server is running on , ", PORT);
});

// module.exports = app;
