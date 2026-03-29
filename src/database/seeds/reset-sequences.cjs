// Reset all sequences to 1 and clean all seed data
const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'bd_titulacion',
  user: 'root',
  password: 'lienmaster1234',
});

async function reset() {
  try {
    await client.connect();
    console.log('Connected');
    
    // Tables to clean (order matters for FK)
    const cleanOrder = [
      'product_order_detail',
      'product_order', 
      'customer_order_detail',
      'customer_order',
      'distributor_relation',
      'product_link',
      'product_variant',
      'products_categories',
      'inventory',
      'price',
      'product',
      'customer',
      'category',
      'distributor',
      'city',
      'payment_method',
    ];
    
    for (const t of cleanOrder) {
      await client.query(`DELETE FROM "${t}"`);
      process.stdout.write(`✓ Deleted ${t}\n`);
    }
    
    // Reset sequences (set to 0, next insert will be 1)
    const sequences = [
      'category_CategoryID_seq',
      'city_CityID_seq',
      'distributor_DistributorID_seq',
      'distributor_relation_DistributorRelationid_seq',
      'payment_method_PaymentMethodID_seq',
      'product_ProductID_seq',
      'inventory_InventoryID_seq',
      'price_PriceID_seq',
      'product_variant_ProductVariantID_seq',
      'product_link_ProductLinkID_seq',
      'customer_CustomerID_seq',
      'customer_order_CustomerOrderID_seq',
      'customer_order_detail_CustomerOrderDetailID_seq',
      'product_order_ProductOrderID_seq',
      'product_order_detail_ProductOrderDetailID_seq',
    ];
    
    console.log('\nResetting sequences...');
    for (const seq of sequences) {
      await client.query(`SELECT setval('"${seq}"', 1, false)`);
      process.stdout.write(`✓ Reset ${seq}\n`);
    }
    
    // Verify
    console.log('\nVerification:');
    for (const t of ['category', 'distributor', 'city', 'payment_method', 'product',
                     'inventory', 'price', 'product_variant', 'product_link', 'customer',
                     'customer_order', 'customer_order_detail', 'product_order', 
                     'product_order_detail', 'distributor_relation', 'products_categories']) {
      const r = await client.query(`SELECT COUNT(*) FROM "${t}"`);
      console.log(`  ${t}: ${r.rows[0].count}`);
    }
    
    await client.end();
    console.log('\nReset complete! Next inserts will start at ID=1');
  } catch (err) {
    console.error('Error:', err.message);
    await client.end();
  }
}

reset();
