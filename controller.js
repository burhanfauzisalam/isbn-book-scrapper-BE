import model from "./model.js";

const listBook = async (req, res) => {
  try {
    const data = await model.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

const addBook = async (req, res) => {
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
    const saveBook = new model(data);
    await saveBook();
    res.status(201).json({ message: "Book added", data: saveBook });
  } catch (error) {
    res.status(500).json(error);
  }
};
export { listBook, addBook };
