#!/bin/bash

# Pristine Portfolio Tool - Deployment Validation Script
# Run this after deployment to verify everything is working

set -e

echo "🔍 Validating Pristine Portfolio Tool Deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_URL="https://app.planpulse.us"
API_URL="https://api.planpulse.us"
STAGING_FRONTEND="https://pristine-portfolio.pages.dev"

# Function to check URL
check_url() {
    local url=$1
    local description=$2
    
    echo -n "Testing $description ($url)... "
    
    if curl -s --head --request GET "$url" | grep "200 OK" > /dev/null; then
        echo -e "${GREEN}✅ SUCCESS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

# Function to check API endpoint
check_api() {
    local endpoint=$1
    local description=$2
    
    echo -n "Testing $description ($API_URL$endpoint)... "
    
    if curl -s "$API_URL$endpoint" > /dev/null; then
        echo -e "${GREEN}✅ SUCCESS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

echo "📋 Deployment Validation Report"
echo "==============================="
echo ""

# 1. DNS Resolution Tests
echo "1️⃣ DNS Resolution Tests"
echo "------------------------"

# Check if domains resolve
for domain in "app.planpulse.us" "api.planpulse.us"; do
    echo -n "DNS resolution for $domain... "
    if nslookup $domain > /dev/null 2>&1; then
        echo -e "${GREEN}✅ RESOLVED${NC}"
    else
        echo -e "${RED}❌ NOT RESOLVED${NC}"
    fi
done

echo ""

# 2. SSL Certificate Tests  
echo "2️⃣ SSL Certificate Tests"
echo "-------------------------"

for url in "$FRONTEND_URL" "$API_URL"; do
    echo -n "SSL certificate for $url... "
    if curl -s --head "$url" | grep -i "HTTP/2 200\|HTTP/1.1 200" > /dev/null; then
        echo -e "${GREEN}✅ VALID${NC}"
    else
        echo -e "${RED}❌ INVALID${NC}"
    fi
done

echo ""

# 3. Frontend Availability Tests
echo "3️⃣ Frontend Availability Tests"
echo "-------------------------------"

check_url "$FRONTEND_URL" "Production Frontend"
check_url "$STAGING_FRONTEND" "Staging Frontend (fallback)"

echo ""

# 4. API Endpoint Tests
echo "4️⃣ API Endpoint Tests"
echo "----------------------"

check_api "/health" "Health Check"
check_api "/tables/users" "Users Table"
check_api "/tables/products" "Products Table"

echo ""

# 5. AI Integration Tests
echo "5️⃣ AI Integration Tests" 
echo "------------------------"

# Test AI endpoints (these may fail in development mode)
echo -n "Testing AI Forward Concept endpoint... "
if curl -s -X POST "$API_URL/ai/forward-concept" \
   -H "Content-Type: application/json" \
   -d '{"ideaText":"test","targetMarket":"test","constraints":"test"}' > /dev/null; then
    echo -e "${GREEN}✅ SUCCESS${NC}"
else
    echo -e "${YELLOW}⚠️ NOT READY (normal in development)${NC}"
fi

echo ""

# 6. Database Connectivity Tests
echo "6️⃣ Database Connectivity Tests"
echo "-------------------------------"

# Test basic CRUD operations
echo -n "Testing database read operations... "
if curl -s "$API_URL/tables/users?limit=1" | grep -q "data"; then
    echo -e "${GREEN}✅ SUCCESS${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
fi

echo ""

# 7. Performance Tests
echo "7️⃣ Performance Tests"
echo "---------------------"

# Test page load times
echo -n "Frontend load time... "
load_time=$(curl -o /dev/null -s -w '%{time_total}\n' "$FRONTEND_URL")
if (( $(echo "$load_time < 5.0" | bc -l) )); then
    echo -e "${GREEN}✅ ${load_time}s (Good)${NC}"
else
    echo -e "${YELLOW}⚠️ ${load_time}s (Slow)${NC}"
fi

echo -n "API response time... "
api_time=$(curl -o /dev/null -s -w '%{time_total}\n' "$API_URL/health" 2>/dev/null || echo "timeout")
if [[ "$api_time" != "timeout" ]] && (( $(echo "$api_time < 2.0" | bc -l) )); then
    echo -e "${GREEN}✅ ${api_time}s (Good)${NC}"
else
    echo -e "${YELLOW}⚠️ ${api_time} (Check connection)${NC}"
fi

echo ""

# 8. Security Tests  
echo "8️⃣ Security Tests"
echo "------------------"

# Check security headers
echo -n "Security headers... "
if curl -s -I "$FRONTEND_URL" | grep -i "x-frame-options\|x-content-type-options\|referrer-policy" > /dev/null; then
    echo -e "${GREEN}✅ PRESENT${NC}"
else
    echo -e "${YELLOW}⚠️ MISSING (check Cloudflare settings)${NC}"
fi

# Check HTTPS redirect
echo -n "HTTPS redirect... "
if curl -s -I "http://app.planpulse.us" | grep -i "location.*https" > /dev/null; then
    echo -e "${GREEN}✅ WORKING${NC}"
else
    echo -e "${YELLOW}⚠️ CHECK CLOUDFLARE SSL MODE${NC}"
fi

echo ""

# 9. Functionality Tests
echo "9️⃣ Functionality Tests"
echo "-----------------------"

# Test if key resources load
resources=(
    "/css/styles.css"
    "/js/app.js"
    "/js/utils/api.js"
    "/manifest.json"
)

for resource in "${resources[@]}"; do
    echo -n "Resource $resource... "
    if curl -s --head "$FRONTEND_URL$resource" | grep "200 OK" > /dev/null; then
        echo -e "${GREEN}✅ AVAILABLE${NC}"
    else
        echo -e "${RED}❌ MISSING${NC}"
    fi
done

echo ""

# Summary
echo "📊 Validation Summary"
echo "====================="
echo ""
echo "🌐 Production URLs:"
echo "   Frontend: $FRONTEND_URL"
echo "   API: $API_URL"
echo ""
echo "🔐 Test Login:"
echo "   Email: admin@pristine.com"
echo "   Password: any value (demo auth)"
echo ""
echo "🎯 Key Features to Test:"
echo "   ✓ Dashboard with KPI charts"
echo "   ✓ AI Concept Builder (Forward & Reverse modes)"
echo "   ✓ Role-based navigation"
echo "   ✓ Mobile responsive design"
echo "   ✓ PWA installation prompt"
echo ""

# Final status
echo "🎉 Validation Complete!"
echo ""
echo "Next steps:"
echo "1. Visit $FRONTEND_URL to test the application"
echo "2. Login and test the AI Concept Builder"
echo "3. Check mobile experience and PWA features"
echo "4. Monitor Cloudflare Analytics for performance"
echo ""
echo "For support, check the production-checklist.md file."