import { Schema, model } from "mongoose";
const bookSchema = new Schema({
  tanggal: {
    type: String,
    default: "",
  },
  nobukti: {
    type: String,
    default: "",
  },
  judul: {
    type: String,
    require: true,
  },
  katalogid: {
    type: String,
    default: "",
  },
  penerbitid: {
    type: String,
    default: "",
  },
  penulisid: {
    type: String,
    default: "",
  },
  formatid: {
    type: String,
    default: "",
  },
  terbit: {
    type: String,
    require: true,
  },
  cover: {
    type: String,
    require: true,
  },
  keterangan: {
    type: String,
    default: "",
  },
  aktif: {
    type: Number,
    default: 1,
  },
  user: {
    type: String,
    default: "Burhan Fauzi Salam",
  },
  jam: {
    type: Date,
    default: Date.now(),
  },
});

export default model("Book", bookSchema);
