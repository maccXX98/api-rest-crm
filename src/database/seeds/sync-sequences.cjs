// Sync sequences to max ID after seed data is loaded
const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'bd_titulacion',
  user: 'root',
  password: 'lienmaster1234',
});

async function sync() {
  try {
    await client.connect();
    console.log('Connected. Syncing sequences to max ID...');

    // Tables that use sequences
    const tableSeqConfig = [
      { table: 'category', seq: 'category_CategoryID_seq', idCol: 'CategoryID' },
      { table: 'city', seq: 'city_CityID_seq', idCol: 'CityID' },
      { table: 'distributor', seq: 'distributor_DistributorID_seq', idCol: 'DistributorID' },
      { table: 'distributor_relation', seq: 'distributor_relation_DistributorRelationid_seq', idCol: 'DistributorRelationid' },
      { table: 'payment_method', seq: 'payment_method_PaymentMethodID_seq', idCol: 'PaymentMethodID' },
      { table: 'product', seq: 'product_ProductID_seq', idCol: 'ProductID' },
      { table: 'inventory', seq: 'inventory_InventoryID_seq', idCol: 'InventoryID' },
      { table: 'price', seq: 'price_PriceID_seq', idCol: 'PriceID' },
      { table: 'product_variant', seq: 'product_variant_ProductVariantID_seq', idCol: 'ProductVariantID' },
      { table: 'product_link', seq: 'product_link_ProductLinkID_seq', idCol: 'ProductLinkID' },
      { table: 'customer', seq: 'customer_CustomerID_seq', idCol: 'CustomerID' },
      { table: 'customer_order', seq: 'customer_order_CustomerOrderID_seq', idCol: 'CustomerOrderID' },
      { table: 'customer_order_detail', seq: 'customer_order_detail_CustomerOrderDetailID_seq', idCol: 'CustomerOrderDetailID' },
      { table: 'product_order', seq: 'product_order_ProductOrderID_seq', idCol: 'ProductOrderID' },
      { table: 'product_order_detail', seq: 'product_order_detail_ProductOrderDetailID_seq', idCol: 'ProductOrderDetailID' },
    ];

    for (const cfg of tableSeqConfig) {
      const r = await client.query(`SELECT COALESCE(MAX("${cfg.idCol}"), 0) as max_id FROM "${cfg.table}"`);
      const maxId = parseInt(r.rows[0].max_id, 10);
      await client.query(`SELECT setval('"${cfg.seq}"', ${maxId}, true)`);
      process.stdout.write(`✓ ${cfg.table}: max=${maxId}, seq=${maxId + 1} after sync\n`);
    }

    await client.end();
    console.log('\nSequences synced! Next inserts will use correct IDs.');
  } catch (err) {
    console.error('Error:', err.message);
    await client.end();
  }
}

sync();
