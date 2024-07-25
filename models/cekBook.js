import dbPool from "../dbmysql.js";

const cekBook = async (isbn) => {
  const cekQuery = `SELECT * FROM pustaka WHERE id = ?`;
  const insertQuery = `UPDATE pustakadetail
                        SET kuantitas = kuantitas + 1
                        WHERE id = ?
                        `;

  // Melakukan query untuk menyimpan data pengguna
  const [rows] = await dbPool.execute(cekQuery, [isbn]);

  // const [rows] = await dbPool.execute(selectQuery, [judul]);

  // Mengembalikan data pengguna baru
  return rows[0];
};

export default cekBook;
