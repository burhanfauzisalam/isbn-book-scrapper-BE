import dbPool from "../dbmysql.js";

const updateQty = async (isbn) => {
  const insertQuery = `UPDATE pustakadetail
                        SET kuantitas = kuantitas + 1
                        WHERE id = ?
                        `;

  const cekQuery = `SELECT * FROM pustakadetail WHERE id = ?`;

  // Melakukan query untuk menyimpan data pengguna
  await dbPool.execute(insertQuery, [isbn]);

  const [rows] = await dbPool.execute(cekQuery, [isbn]);

  // Mengembalikan data pengguna baru
  return rows[0];
};

export default updateQty;
