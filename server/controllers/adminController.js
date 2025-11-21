const pool = require('../db');

exports.getAllUsers=async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const [users] = await conn.query('SELECT id, email, name, role_id, created_at FROM users ORDER BY id DESC');
    res.json(users);
  } catch (err) {
    next(err);
  } finally {
    conn.release();
  }

}


exports.getStats=async (req, res , next)=>{
  const conn = await pool.getConnection();

  try{
    const [[{totalUsers}]] = await conn.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [[{totalPosts}]] = await conn.query('SELECT COUNT(*) AS totalPosts FROM posts');
    const [[{totalRatings}]] =await conn.query('SELECT COUNT(*) AS totalRatings FROM ratings');

    res.json({totalUsers, totalPosts, totalRatings});

  } catch (err) {
    next(err);
  } finally {
    conn.release();
  }
}

exports.createStore=async (req, res , next )=>{
  const conn = await pool.getConnection();

  try{
    const {name , description , address, created_by}= req.body;
    const [result] = await conn.query(
      'INSERT INTO stores (name , description , address, created_by ) VALUES (?,?,?,?)',
      [name , description , address, created_by]
  
    );
    res.status(201).json({
      id: result.insertId,
      name,
      description,
      created_by,
      address

    })

  } catch (err) {
    next(err);
  } finally {
    conn.release();
  }
}


exports.getAllStores=async(req , res , next)=>{
  const conn= await pool.getConnection();

  try{
    const [stores]=await conn.query(
       `SELECT s.*, u.name AS owner_name, u.email AS owner_email
      FROM stores s
      LEFT JOIN users u ON u.id = s.created_by
      ORDER BY s.id DESC`  
       );

       res.json(stores);


  }catch(err){
    next(err);
  }finally{
    conn.release();
  }

}

exports.updateStore = async (req, res, next) => {
  const storeId = req.params.id;
  const { name, description, address, created_by } = req.body;

  const conn = await pool.getConnection();
  try {
    const [exists] = await conn.query("SELECT id FROM stores WHERE id = ?", [storeId]);
    if (!exists.length) return res.status(404).json({ error: "Store not found" });

    await conn.query(
      "UPDATE stores SET name = ?, description = ?, address = ?, created_by = ? WHERE id = ?",
      [name, description || null, address || null, created_by || null, storeId]
    );

    res.json({ ok: true, message: "Store updated successfully" });

  } catch (err) {
    next(err);
  } finally {
    conn.release();
  }
};

exports.deleteStore = async (req, res, next) => {
  const storeId = req.params.id;

  const conn = await pool.getConnection();
  try {
    const [exists] = await conn.query("SELECT id FROM stores WHERE id = ?", [storeId]);
    if (!exists.length) return res.status(404).json({ error: "Store not found" });

    await conn.query("DELETE FROM stores WHERE id = ?", [storeId]);

    res.json({ ok: true, message: "Store deleted successfully" });

  } catch (err) {
    next(err);
  } finally {
    conn.release();
  }
};




