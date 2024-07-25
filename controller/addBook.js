import axios from "axios";
import addBook from "../models/addBook.js";
import cekBook from "../models/cekBook.js";
import updateQty from "../models/updateQty.js";

const addBooks = async (req, res) => {
  try {
    const { isbn } = req.query;
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

    const cek = await cekBook(isbn);
    if (cek) {
      const update = await updateQty(isbn);
      return res.status(200).json({
        message: `Jumlah buku dengan judul ${data.judul} bertambah 1 buku.`,
        total: update.kuantitas,
      });
    }
    const saveBook = await addBook(
      isbn,
      data.judul,
      data.penulisid,
      data.penerbitid,
      data.terbit,
      data.cover
    );

    res.status(201).json({
      message: "Book added",
      data: saveBook,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
      code: res.statusCode,
    });
  }
};

export default addBooks;
