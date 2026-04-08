import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

# We use the REST API of Supabase directly to avoid requiring the full supabase-python library
SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("VITE_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be in .env")
    exit(1)

def scrape_goverment_schemes():
    print("Initiating mock scrape representing MyScheme & Data.gov.in data...")
    # In a full-blown scraping application, this logic would utilize BeautifulSoup,
    # or interact with MyScheme's Next.js _next/data APIs. For robustness and 
    # to avoid captchas, we return a compiled rich dataset covering major sectors.
    return [
        {
            "title": "PM Kisan Samman Nidhi",
            "description": "Direct income support of ₹6,000 per year to all landholding farmer families.",
            "category": "Agriculture",
            "ministry": "Agriculture",
            "eligibility": ["Must be an Indian Citizen", "Must own cultivable land"],
            "benefits": ["₹6,000 yearly", "Direct Benefit Transfer"],
            "documents": ["Aadhaar", "Land Records"]
        },
        {
            "title": "Mudra Yojana",
            "description": "Financial support for small businesses and startups with low-interest loans.",
            "category": "Business",
            "ministry": "Finance",
            "eligibility": ["Non-farm enterprise", "Need credit up to ₹10 Lakh"],
            "benefits": ["Collateral-free loans", "Shishu, Kishore, Tarun categories"],
            "documents": ["Aadhaar", "Business Plan"]
        },
        {
            "title": "Ayushman Bharat (PM-JAY)",
            "description": "World's largest health insurance scheme providing ₹5 lakh cover per family.",
            "category": "Health & Welfare",
            "ministry": "Health",
            "eligibility": ["Families listed in SECC 2011", "Low-income households"],
            "benefits": ["₹5 lakh health insurance", "Cashless treatment"],
            "documents": ["Aadhaar", "Ration Card"]
        },
        {
            "title": "PM Awas Yojana (Urban)",
            "description": "Housing for All mission providing affordable housing to urban poor.",
            "category": "Housing",
            "ministry": "Housing and Urban Affairs",
            "eligibility": ["EWS/LIG/MIG category", "Must not own a pucca house"],
            "benefits": ["Interest subsidy on home loans", "Financial assistance"],
            "documents": ["Aadhaar", "Income Certificate"]
        },
        {
            "title": "National Scholarship Portal",
            "description": "Centralized portal providing various scholarships to deserving students.",
            "category": "Education",
            "ministry": "Education",
            "eligibility": ["Must be a student", "Income criteria applies"],
            "benefits": ["Financial assistance for education"],
            "documents": ["Aadhaar", "School ID", "Income Certificate"]
        }
    ]

def seed_to_supabase(schemes):
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    endpoint = f"{SUPABASE_URL}/rest/v1/schemes"
    
    print(f"Connecting to Supabase at {SUPABASE_URL}...")
    
    response = requests.post(endpoint, headers=headers, json=schemes)
    
    if response.status_code in [200, 201]:
        print(f"Success! Inserted {len(schemes)} schemes into Supabase.")
    else:
        print(f"Failed to insert data: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    schemes = scrape_goverment_schemes()
    seed_to_supabase(schemes)
