#!/bin/bash

# Pristine Portfolio Tool - Rush Deployment Script
# Run this script to deploy everything to Cloudflare

set -e

echo "🚀 Starting Pristine Portfolio Tool Deployment to Cloudflare..."

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

echo "✅ Prerequisites check complete"

# Login to Cloudflare (if not already logged in)
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "🔑 Please log in to Cloudflare:"
    wrangler login
fi

# Get configuration from user
echo ""
echo "📝 Configuration Setup:"

if [ -z "$OPENAI_API_KEY" ]; then
    echo -n "🤖 Enter your OpenAI API Key: "
    read -s OPENAI_API_KEY
    echo ""
fi

if [ -z "$DB_ID" ]; then
    echo -n "💾 Enter your D1 Database ID (from wrangler d1 create command): "
    read DB_ID
fi

echo ""
echo "🏗️ Deploying Infrastructure..."

# Step 1: Create D1 Database (if not exists)
echo "1️⃣ Setting up D1 Database..."
if [ -z "$DB_ID" ]; then
    echo "Creating new D1 database..."
    DB_OUTPUT=$(wrangler d1 create pristine-portfolio-db)
    DB_ID=$(echo "$DB_OUTPUT" | grep "database_id" | awk -F'"' '{print $4}')
    echo "✅ Database created with ID: $DB_ID"
fi

# Update wrangler.toml with database ID
echo "📝 Updating configuration with database ID..."
sed -i.bak "s/database_id = \"\"/database_id = \"$DB_ID\"/g" wrangler.toml

# Step 2: Initialize Database Schema
echo "2️⃣ Initializing database schema..."
wrangler d1 execute pristine-portfolio-db --file=schema.sql

echo "3️⃣ Loading sample data..."
wrangler d1 execute pristine-portfolio-db --file=sample-data.sql

# Step 3: Deploy API Worker
echo "4️⃣ Installing Worker dependencies..."
cd worker
npm install

echo "5️⃣ Deploying API Worker..."
wrangler deploy --env production

# Set environment variables
echo "6️⃣ Setting environment variables..."
wrangler secret put OPENAI_API_KEY --env production <<< "$OPENAI_API_KEY"

cd ..

# Step 4: Deploy Frontend to Pages
echo "7️⃣ Deploying frontend to Cloudflare Pages..."
wrangler pages create pristine-portfolio 2>/dev/null || true
wrangler pages deploy . --project-name=pristine-portfolio --compatibility-date=2024-01-01

echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "📋 Deployment Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Frontend URL: https://pristine-portfolio.pages.dev"
echo "🔗 API URL: https://pristine-api.{your-subdomain}.workers.dev"
echo "💾 Database ID: $DB_ID"
echo "🤖 OpenAI Integration: ✅ Configured"
echo ""
echo "🔧 Next Steps:"
echo "1. Update your DNS settings in Cloudflare:"
echo "   - Add CNAME: app.planpulse.us → pristine-portfolio.pages.dev"
echo "   - Add CNAME: api.planpulse.us → pristine-api.{your-subdomain}.workers.dev"
echo ""
echo "2. Test your deployment:"
echo "   - Visit the frontend URL above"
echo "   - Login with: admin@pristine.com"
echo "   - Test the AI Concept Builder"
echo ""
echo "3. Update the frontend API endpoint:"
echo "   - Edit js/utils/api.js"
echo "   - Change baseURL to your API domain"
echo ""
echo "🚀 Your Pristine Portfolio Tool is now live!"

# Save deployment info
cat > deployment-info.txt << EOF
Pristine Portfolio Tool - Deployment Information
===============================================
Deployed: $(date)
Frontend URL: https://pristine-portfolio.pages.dev
Database ID: $DB_ID
Status: Active

Custom Domains (Configure in Cloudflare DNS):
- app.planpulse.us → pristine-portfolio.pages.dev
- api.planpulse.us → pristine-api.{worker-subdomain}.workers.dev

Login Credentials:
- admin@pristine.com (Owner)
- product@pristine.com (Admin) 
- formulator@pristine.com (Contributor)
- Password: any value (demo auth)
EOF

echo "💾 Deployment info saved to: deployment-info.txt"
echo ""