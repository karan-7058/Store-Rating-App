const pool = require('../db');


exports.getAllStores=async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const [stores] = await conn.query(`
      SELECT s.*, IFNULL(AVG(r.score),0) AS avg_score, COUNT(r.id) AS ratings_count
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      GROUP BY s.id
      ORDER BY s.name
    `);
    res.json(stores);
  } catch (err) {
    next(err);
  } finally {
    conn.release();
  }
}

exports.getStoreById= async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const [srows] = await conn.query('SELECT * FROM stores WHERE id = ?', [req.params.id]);
    if (!srows.length) return res.status(404).json({ error: 'Store not found' });
    const [ratings] = await conn.query('SELECT r.*, u.name as user_name FROM ratings r JOIN users u ON u.id = r.user_id WHERE r.store_id = ? ORDER BY r.created_at DESC', [req.params.id]);
    res.json({ store: srows[0], ratings });
  } catch (err) {
    next(err);
  } finally {
    conn.release();
  }
}

exports.addRating= async (req, res, next) => {
  const { score, comment } = req.body;
  const storeId = req.params.id;
  const userId = req.session.user.id;
  if (!score || score < 1 || score > 5) return res.status(400).json({ error: 'Invalid score' });
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('INSERT INTO ratings (store_id, user_id, score, comment) VALUES (?, ?, ?, ?)', [storeId, userId, score, comment || null]);
    await conn.commit();
    res.status(201).json({ ok: true });
  } catch (err) {
    await conn.rollback();
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'You have already rated this store' });
    next(err);
  } finally {
    conn.release();
  }
}


exports.updateRating= async (req , res , next)=>{
  const RatingId=req.params.id;

  const{score , comment}=req.body;
  const userId=req.session.user.id;

  if(!score || score <1 || score >5 ) return res.status(400).json({error:"invalid score"});

  const conn= await pool.getConnection();

  try{
    const [rows]=  await conn.query('SELECT * FROM ratings WHERE id =? AND user_id=?', [RatingId , userId]);
    if(!rows.length) return res.status(404).json({error:"rating not found"});

    await conn.query('UPDATE ratings SET score =? , comment=? WHERE id=?', [score , comment ||null , RatingId ]);

    res.json({ok:true , message: "rating updated successfully"});

  } catch(err){
    next(err);
  } finally{
    conn.release();
  }   
}


exports.deleteRating= async(req, res , next)=>{
  const RatingId= req.params.id;
  const userId= req.session.user.id;

  const conn= await pool.getConnection();

  try{
    const [rows]= await conn.query('SELECT * FROM ratings WHERE id=? AND user_id=?'  , [RatingId , userId]);
    if(!rows.length) return res.status(404).json({error:"rating not founds"});

    await conn.query('DELETE FROM ratings WHERE id=?' , [RatingId]);

    res.json({ok:true , message:"rating deleted successfully "});


  } catch(err){
    next(err);
  } finally{
    conn.release();
  }
}




