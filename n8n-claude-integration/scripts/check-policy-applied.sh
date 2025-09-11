#!/bin/bash

echo "🔍 Checking if PowerUserAccess policy is applied..."
echo "================================================="

# Quick test - try to list S3 buckets
if aws s3 ls >/dev/null 2>&1; then
    echo "✅ SUCCESS! PowerUserAccess policy is working!"
    echo ""
    echo "🚀 Ready to deploy immediately!"
    echo "Run this command now:"
    echo "./deploy-now.sh"
    echo ""
    exit 0
else
    echo "⏳ Policy not applied yet or still propagating..."
    echo ""
    echo "📋 Make sure you've completed these steps in AWS Console:"
    echo "1. Go to: https://console.aws.amazon.com/iam/home#/users/Tony_M"
    echo "2. Click 'Add permissions'"
    echo "3. Select 'Attach policies directly'"
    echo "4. Search for 'PowerUserAccess'"
    echo "5. Check the box and click 'Add permissions'"
    echo ""
    echo "⏱️ AWS policies can take 1-2 minutes to propagate."
    echo "Run this script again in a moment: ./check-policy-applied.sh"
    echo ""
    exit 1
fi
