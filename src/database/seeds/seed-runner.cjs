// Seed runner for NOVEX CRM - executes statements one by one (no transaction)
const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'bd_titulacion',
  user: 'root',
  password: 'lienmaster1234',
});

async function runSeed() {
  const sql = require('fs').readFileSync(__dirname + '/seed-novex-complete.sql', 'utf8');
  
  // Split on semicolons, filter comments/empty
  const lines = sql.split('\n');
  const statements = [];
  let current = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('--')) continue;
    if (trimmed === '') continue;
    current += line + '\n';
    if (line.trim().endsWith(';')) {
      const s = current.trim();
      if (s && s !== '--' && !s.startsWith('--')) {
        statements.push(s);
      }
      current = '';
    }
  }
  
  try {
    await client.connect();
    console.log(`Connected to PostgreSQL. Executing ${statements.length} statements...\n`);
    
    let success = 0;
    let errors = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        await client.query(stmt);
        success++;
        const snippet = stmt.substring(0, 55).replace(/\n/g, ' ').replace(/'/g, "''");
        process.stdout.write(`[${i+1}/${statements.length}] ✓ ${snippet}...\n`);
      } catch (err) {
        errors++;
        console.error(`\n[ERROR ${i+1}/${statements.length}]: ${err.message}`);
        console.error(`   Statement: ${stmt.substring(0, 120)}...\n`);
      }
    }
    
    console.log(`\n========================================`);
    console.log(`Seed complete: ${success} OK, ${errors} errors`);
    console.log(`========================================`);
    
    // Show summary counts
    const tables = ['category','distributor','city','payment_method','product',
                    'products_categories','inventory','price','product_variant',
                    'product_link','customer','customer_order','customer_order_detail',
                    'product_order','product_order_detail','distributor_relation'];
    console.log('\nTable counts:');
    for (const t of tables) {
      const r = await client.query(`SELECT COUNT(*) FROM "${t}"`);
      console.log(`  ${t}: ${r.rows[0].count}`);
    }
    
  } catch (err) {
    console.error('Fatal error:', err.message);
  } finally {
    await client.end();
  }
}

runSeed();
