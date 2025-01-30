const pool = require('./config/db'); // ✅ ถูกต้อง

async function testDBConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release(); // ปล่อย Connection กลับไปที่ Pool
    process.exit(0); // ออกจากโปรแกรมหลังจากเชื่อมต่อสำเร็จ
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1); // ออกจากโปรแกรมพร้อมสถานะ error
  }
}

testDBConnection();
