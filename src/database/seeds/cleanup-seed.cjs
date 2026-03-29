// Clean up test data before seed
const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'bd_titulacion',
  user: 'root',
  password: 'lienmaster1234',
});

async function cleanup() {
  try {
    await client.connect();
    console.log('Connected');
    
    // Delete in proper order (respecting FK constraints)
    await client.query('DELETE FROM product_order_detail');
    console.log('Cleaned product_order_detail');
    await client.query('DELETE FROM product_order');
    console.log('Cleaned product_order');
    await client.query('DELETE FROM customer_order_detail');
    console.log('Cleaned customer_order_detail');
    await client.query('DELETE FROM customer_order');
    console.log('Cleaned customer_order');
    await client.query('DELETE FROM distributor_relation');
    console.log('Cleaned distributor_relation');
    await client.query('DELETE FROM product_link');
    console.log('Cleaned product_link');
    await client.query('DELETE FROM product_variant');
    console.log('Cleaned product_variant');
    await client.query('DELETE FROM products_categories');
    console.log('Cleaned products_categories');
    await client.query('DELETE FROM inventory');
    console.log('Cleaned inventory');
    await client.query('DELETE FROM price');
    console.log('Cleaned price');
    await client.query('DELETE FROM product');
    console.log('Cleaned product');
    await client.query('DELETE FROM customer');
    console.log('Cleaned customer');
    await client.query('DELETE FROM category');
    console.log('Cleaned category');
    await client.query('DELETE FROM distributor WHERE "Name" != \'Debug Dist\'');
    console.log('Cleaned distributors (kept debug)');
    await client.query('DELETE FROM city');
    console.log('Cleaned city');
    await client.query('DELETE FROM payment_method');
    console.log('Cleaned payment_method');
    await client.query('DELETE FROM distributor WHERE "Name" = \'Debug Dist\'');
    console.log('Cleaned debug distributor');
    
    console.log('\nAll clean. Verifying counts:');
    const tables = ['category','distributor','city','payment_method','product',
                    'products_categories','inventory','price','product_variant',
                    'product_link','customer','customer_order','customer_order_detail',
                    'product_order','product_order_detail','distributor_relation'];
    for (const t of tables) {
      const r = await client.query(`SELECT COUNT(*) FROM "${t}"`);
      console.log(`  ${t}: ${r.rows[0].count}`);
    }
    
    await client.end();
    console.log('\nCleanup done!');
  } catch (err) {
    console.error('Error:', err.message);
    await client.end();
  }
}

cleanup();
