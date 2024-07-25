import dotenv from "dotenv";
import express, { json } from "express";
import cors from "cors";
import connectDB from "./db.js";
import axios from "axios";
import model from "./model.js";

import addBooks from "./controller/addBook.js";

dotenv.config();
const port = process.env["PORT"] || 3000;

const app = express();

connectDB();

app.use(cors());
app.use(json());

app.get("/data", async (req, res) => {
  const { isbn } = req.query;
  try {
    const response = await axios.get(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
    );
    const bookData = response.data[`ISBN:${isbn}`];
    const data = {
      judul: bookData.title ? bookData.title : "",
      penulisid: bookData.authors ? bookData.authors[0].name : "",
      penerbitid: bookData.publishers ? bookData.publishers[0].name : "",
      terbit: bookData.publish_date ? bookData.publish_date : "",
      cover: bookData.cover ? bookData.cover.large : "",
    };
    res.status(200).json(data);
    // } else {
    //   res.status(404).json({ error: "Book not found." });
    // }
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/isbn/:isbn", async (req, res) => {
  const { isbn } = req.params;
  try {
    const response = await axios.get(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
    );
    const bookData = response.data[`ISBN:${isbn}`];
    if (!bookData) {
      return res.status(400).json({ message: "Book not found" });
    }
    const data = {
      judul: bookData.title ? bookData.title : "",
      penulisid: bookData.authors ? bookData.authors[0].name : "",
      penerbitid: bookData.publishers ? bookData.publishers[0].name : "",
      terbit: bookData.publish_date ? bookData.publish_date : "",
      cover: bookData.cover ? bookData.cover.large : "",
    };
    const cekBook = await model.findOne({ judul: data.judul });
    if (cekBook) {
      return res.status(400).json({ message: "Book already in library" });
    }
    const saveBook = new model(data);
    await saveBook.save();
    res.status(201).json({ message: "Book added", data: saveBook });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/add", addBooks);

app.get("/books", async (req, res) => {
  try {
    const data = await model.find();
    res.status(200).json(data.reverse());
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/", async (req, res) => {
  try {
    res.status(200).json({ message: "Server berjalan..." });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(port, () => {
  console.log(`Server is online on port ${port}`);
});
