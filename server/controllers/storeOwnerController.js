const pool = require("../db");




exports.createStore = async (req, res, next) => {
  const ownerId = req.session.user.id;
  const { name, description, address } = req.body;

  const conn = await pool.getConnection();
  try {
    // 🔒 Check if owner already has a store
    const [existing] = await conn.query(
      "SELECT id FROM stores WHERE created_by = ?",
      [ownerId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        error: "You can create only one store",
      });
    }

    // ✅ Create store
    const [result] = await conn.query(
      `INSERT INTO stores (name, description, address, created_by)
       VALUES (?, ?, ?, ?)`,
      [name, description, address, ownerId]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      description,
      address,
    });
  } catch (err) {
    next(err);
  } finally {
    conn.release();
  }
};



exports.getStoresByOwner = async (req, res, next) => {
  const ownerId = req.session.user.id;

  const conn = await pool.getConnection();
  try {
    const [stores] = await conn.query(
      "SELECT * FROM stores WHERE created_by = ?",
      [ownerId]
    );
    res.json(stores);
  } catch (err) {
    next(err);
  } finally {
    conn.release();
  }
}

exports.getStoreRatings=async (req, res, next) => {
  const storeId = req.params.id;
  const ownerId = req.session.user.id;

  const conn = await pool.getConnection();
  try {
    // Verify this store belongs to this owner
    const [storeCheck] = await conn.query(
      "SELECT id FROM stores WHERE id = ? AND created_by = ?",
      [storeId, ownerId]
    );

    if (!storeCheck.length) {
      return res.status(403).json({ error: "This store does not belong to you" });
    }

    // Get ratings
    const [ratings] = await conn.query(
      `SELECT r.*, u.name AS user_name
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [storeId]
    );

    res.json(ratings);

  } catch (err) {
    next(err);
  } finally {
    conn.release();
  }
}


exports.updateStoreByOwner = async (req, res, next) =>{
  const storeId= req.params.id;
  const ownerId = req.session.user.id;

  const {name , description , location}= req.body;

  const conn = await pool.getConnection();

  try{
    // Verify this store belongs to this owner
    const [storeCheck]= await conn.query('SELECT id FROM stores WHERE id =? AND created_by=?', [storeId , ownerId]);
    if(!storeCheck.length) return res.status(403).json({error: "this store does not belong to you "});

    // Update store details
    await conn.query('UPDATE stores SET name=? , description=? , location=? WHERE id=? ', [name , description , location , storeId ]);

    res.json({message: "stor updated successfully "});

  }catch(err){
    next (err);
  } finally {
    conn.release();     
  }
}





