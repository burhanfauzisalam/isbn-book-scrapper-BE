import dbPool from "../dbmysql.js";

const addBook = async (isbn, judul, penulisid, penerbitid, terbit, cover) => {
  const created = new Date().toISOString();
  const tanggal = created.split("T")[0];
  const user = "Burhan Fauzi Salam";
  const aktif = 1;
  const insertQuery = `INSERT INTO pustaka (id, tanggal, judul, penulisid, penerbitid, terbit, cover, aktif, user, jam)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const insertPustakadetail = `INSERT INTO pustakadetail (id, kuantitas)
                       VALUES (?, ?)`;

  const selectQuery = `SELECT * FROM pustaka WHERE id = ?`;

  // Melakukan query untuk menyimpan data pengguna
  await dbPool.execute(insertQuery, [
    isbn,
    tanggal,
    judul,
    penulisid,
    penerbitid,
    terbit,
    cover,
    aktif,
    user,
    created,
  ]);

  await dbPool.execute(insertPustakadetail, [isbn, 1]);

  const [rows] = await dbPool.execute(selectQuery, [isbn]);

  // Mengembalikan data pengguna baru
  return rows[0];
};

export default addBook;
