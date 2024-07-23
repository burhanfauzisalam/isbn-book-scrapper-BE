import { Schema, model } from "mongoose";
const bookSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  author: {
    type: String,
    require: true,
  },
  page: {
    type: Number,
    require: true,
  },
  ISBN_10: {
    type: Number,
    require: true,
  },
  ISBN_13: {
    type: Number,
    require: true,
  },
  ISBN_10: {
    type: Number,
    require: true,
  },
  publisher: {
    type: String,
    require: true,
  },
  year: {
    type: String,
    require: true,
  },
  ebook: {
    type: String,
    require: true,
  },
  cover: {
    type: String,
    require: true,
  },
});

export default model("Book", bookSchema);
