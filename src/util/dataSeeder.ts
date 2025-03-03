import { gameModel } from "../models/gameModel";
import { userModel } from "../models/userModel";
import { connect, disconnect } from "../repository/database";

import bcrypt from "bcrypt";
import dotenvFlow from "dotenv-flow";

dotenvFlow.config();

// Seed data into the database
export async function seed() {
   try {
      await connect();

      await deleteAllData();

      await seedData();

      console.log("Seeding process completed successfully...");
      process.exit();
   } catch (err) {
      console.log("Error Seeding data." + err);
   }
   finally {
      await disconnect();
   }
};

// Delete all data from the database
export async function deleteAllData() {
   await gameModel.deleteMany();
   await userModel.deleteMany();

   console.log("Deleted all data successfully...");
};

// Seed data into the database
export async function seedData() {
   // Hash the password
   const salt = await bcrypt.genSalt(10);
   const passwordHash = await bcrypt.hash("123456", salt);

   const user1 = new userModel();
   user1.name = "Norbert Tolnai";
   user1.email = "tolnainorbi16@gmail.com";
   user1.password = passwordHash;
   await user1.save();

   const user2 = new userModel();
   user2.name = "John Doe";
   user2.email = "johndoe@email.com";
   user2.password = passwordHash;
   await user2.save();

   const games = [
      {
         title: "The Last of Us",
         description: "A post-apocalyptic action-adventure game.",
         imageURL: "https://picsum.photos/500/500",
         price: 39.99,
         rating: 4.9,
         platform: "PlayStation",
         genre: "Action-Adventure",
         releaseDate: new Date("2013-06-14"),
         _createdBy: user1.id,
      },
      {
         title: "The Last of Us Part II",
         description: "A post-apocalyptic action-adventure game set in a world ravaged by a deadly pandemic.",
         imageURL: "https://picsum.photos/500/500",
         price: 49.99,
         rating: 4.8,
         platform: "PlayStation",
         genre: "Action-Adventure",
         releaseDate: new Date("2020-06-19"),
         _createdBy: user1.id,
      },
      {
         title: "Watch Dogs 2",
         description: "An open-world hacking and action game set in San Francisco.",
         imageURL: "https://picsum.photos/500/500",
         price: 29.99,
         rating: 4.5,
         platform: "PC, PlayStation, Xbox",
         genre: "Action-Adventure",
         releaseDate: new Date("2016-11-15"),
         _createdBy: user1.id,
      },
      {
         title: "Days Gone",
         description: "A survival horror action game set in a post-apocalyptic open world.",
         imageURL: "https://picsum.photos/500/500",
         price: 49.99,
         rating: 4.6,
         platform: "PC, PlayStation",
         genre: "Survival Horror, Action-Adventure",
         releaseDate: new Date("2019-04-26"),
         _createdBy: user1.id,
      },
      {
         title: "Cyberpunk 2077",
         description: "An open-world action-adventure story set in Night City, a megalopolis obsessed with power, glamour, and body modification.",
         imageURL: "https://picsum.photos/500/500",
         price: 59.99,
         rating: 4.0,
         platform: "PC, PlayStation, Xbox",
         genre: "Action-Adventure, RPG",
         releaseDate: new Date("2020-12-10"),
         _createdBy: user1.id,
      },
      {
         title: "Red Dead Redemption 2",
         description: "An epic tale of life in America’s unforgiving heartland.",
         imageURL: "https://picsum.photos/500/500",
         price: 49.99,
         rating: 4.8,
         platform: "PC, PlayStation, Xbox",
         genre: "Action-Adventure",
         releaseDate: new Date("2018-10-26"),
         _createdBy: user2.id,
      },
      {
         title: "Assassin's Creed Valhalla",
         description: "Become Eivor, a legendary Viking raider on a quest for glory.",
         imageURL: "https://picsum.photos/500/500",
         price: 59.99,
         rating: 4.7,
         platform: "PC, PlayStation, Xbox",
         genre: "Action-Adventure",
         releaseDate: new Date("2020-11-10"),
         _createdBy: user2.id,
      }
   ];

   await gameModel.insertMany(games);

   console.log("Seeded data successfully...");
};

seed();