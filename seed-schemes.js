const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Ensure you replace these with your actual Supabase URL and Key found in supabase.com > Project Settings > API
// If your .env doesn't load you can hardcode them here momentarily to run the script.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('Error: Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const governmentSchemes = [
  {
    title: "Pradhan Mantri Awas Yojana (PMAY)",
    description: "A flagship mission by the Government of India providing affordable housing to the urban and rural poor.",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Housing",
    eligibility: ["Must not own a pucca house", "Annual household income must fall under specified EWS/LIG/MIG bounds"],
    benefits: ["Financial assistance up to ₹2.67 Lakh", "Subsidized home loan interest rates"],
    tags: ["housing", "loan", "infrastructure", "subsidies"]
  },
  {
    title: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
    description: "National Mission for Financial Inclusion to ensure access to financial services, namely, banking/savings & deposit accounts, remittance, credit, insurance, pension in an affordable manner.",
    ministry: "Ministry of Finance",
    category: "Financial Inclusion",
    eligibility: ["Indian Citizen", "No minimum balance requirement"],
    benefits: ["RuPay debit card", "Accident insurance cover of ₹1L", "Overdraft facility up to ₹10k"],
    tags: ["banking", "finance", "insurance"]
  },
  {
    title: "Ayushman Bharat PM-JAY",
    description: "A national health protection scheme providing health coverage of ₹5 Lakhs per family per year for secondary and tertiary care hospitalization.",
    ministry: "Ministry of Health and Family Welfare",
    category: "Health & Welfare",
    eligibility: ["Based on SECC 2011 deprivation criteria", "No restriction on family size, age or gender"],
    benefits: ["Health insurance coverage of ₹5 lakh per family", "Cashless access to health care"],
    tags: ["healthcare", "insurance", "medical"]
  },
  {
    title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    description: "An initiative by the government to provide minimum income support to all small and marginal farmers.",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "Agriculture",
    eligibility: ["Small and marginal farmers holding cultivable land up to 2 hectares"],
    benefits: ["Direct income support of ₹6000 per year transferred via DBT in three basic installments"],
    tags: ["agriculture", "dbt", "farmers", "rural"]
  },
  {
    title: "Atal Pension Yojana (APY)",
    description: "A pension scheme for citizens of India focused on unorganized sector workers ensuring guaranteed minimum pension.",
    ministry: "Ministry of Finance",
    category: "Pensions",
    eligibility: ["Age band 18-40 years", "Must have a bank account"],
    benefits: ["Guaranteed minimum monthly pension from ₹1000 to ₹5000 strictly from the age of 60"],
    tags: ["pension", "retirement", "unorganized-sector"]
  },
  {
    title: "Sukanya Samriddhi Yojana (SSY)",
    description: "A savings scheme targeted at the parents of girl children to encourage them to build a fund for the future education and marriage expenses.",
    ministry: "Ministry of Finance",
    category: "Women & Child Development",
    eligibility: ["Parent/guardian of a girl child", "Girl must be below 10 years of age"],
    benefits: ["High interest rate (subject to periodic revision)", "Tax exemption under section 80C"],
    tags: ["savings", "girl-child", "education", "tax-benefit"]
  },
  {
    title: "Pradhan Mantri Mudra Yojana (PMMY)",
    description: "Platform to provide loans up to ₹10 Lakhs to non-corporate, non-farm small/micro enterprises.",
    ministry: "Ministry of Finance",
    category: "Entrepreneurship & Loans",
    eligibility: ["Non-farm enterprise under manufacturing, trading, or service sector", "Need credit up to ₹10 Lakh"],
    benefits: ["Up to ₹10 Lakhs strictly collateral-free credit in 3 categories: Shishu, Kishore, Tarun"],
    tags: ["loans", "msme", "business", "startups"]
  },
  {
    title: "Digilocker Application Push",
    description: "Initiative to digitize all identity documents.",
    ministry: "Ministry of Electronics & Info Tech",
    category: "Digital India",
    eligibility: ["All Indian Citizens holding Aadhaar"],
    benefits: ["Centralized hub for all certificates.", "Free verified e-storage space."],
    tags: ["digital", "id", "technology"]
  }
];

async function seed() {
  console.log('Dropping existing test schemas (if any)...');
  // Just pushing data. Let's assume the table is created.

  console.log('Inserting government schemes into Supabase...');
  const { data, error } = await supabase
    .from('schemes')
    .insert(governmentSchemes)
    .select();

  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log(`Successfully populated ${data.length} schemes!`);
  }
}

seed();
