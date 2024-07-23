import dotenv from "dotenv";
import express, { json } from "express";
import cors from "cors";
import connectDB from "./db.js";
import axios from "axios";
import model from "./model.js";

dotenv.config();
const port = process.env["PORT"] || 3000;

const app = express();

connectDB();

app.use(cors());
app.use(json());

app.get("/data/:isbn", async (req, res) => {
  const { isbn } = req.params;
  try {
    const response = await axios.get(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
    );
    const bookData = response.data[`ISBN:${isbn}`];
    const data = {
      title: bookData.title ? bookData.title : "",
      author: bookData.authors ? bookData.authors[0].name : "",
      page: bookData.number_of_pages
        ? bookData.number_of_pages
        : bookData.pagination
        ? parseInt(bookData.pagination.split(" ")[0])
        : "",
      ISBN_10: bookData.identifiers.isbn_10
        ? bookData.identifiers.isbn_10[0]
        : "",
      ISBN_13: bookData.identifiers.isbn_13
        ? bookData.identifiers.isbn_13[0]
        : "",
      publisher: bookData.publishers ? bookData.publishers[0].name : "",
      year: bookData.publish_date ? bookData.publish_date : "",
      ebook: bookData.ebooks ? bookData.ebooks[0].preview_url : "",
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
      title: bookData.title ? bookData.title : "",
      author: bookData.authors ? bookData.authors[0].name : "",
      page: bookData.number_of_pages
        ? bookData.number_of_pages
        : bookData.pagination
        ? parseInt(bookData.pagination.split(" ")[0])
        : "",
      ISBN_10: bookData.identifiers.isbn_10
        ? bookData.identifiers.isbn_10[0]
        : "",
      ISBN_13: bookData.identifiers.isbn_13
        ? bookData.identifiers.isbn_13[0]
        : "",
      publisher: bookData.publishers ? bookData.publishers[0].name : "",
      year: bookData.publish_date ? bookData.publish_date : "",
      ebook: bookData.ebooks ? bookData.ebooks[0].preview_url : "",
      cover: bookData.cover ? bookData.cover.large : "",
    };
    const cekBook = await model.findOne({ ISBN_13: data.ISBN_13 });
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

app.get("/books", async (req, res) => {
  try {
    const data = await model.find();
    res.status(200).json(data.reverse());
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(port, () => {
  console.log(`Server is online on port ${port}`);
});
