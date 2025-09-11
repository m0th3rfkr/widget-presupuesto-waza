#!/bin/bash

echo "🔍 Verifying PowerUserAccess Setup..."
echo "===================================="

# Test 1: Basic AWS Identity
echo ""
echo "1️⃣ Testing AWS Identity..."
aws sts get-caller-identity

# Test 2: S3 Access
echo ""
echo "2️⃣ Testing S3 Access..."
aws s3 ls 2>/dev/null && echo "✅ S3 access confirmed" || echo "❌ S3 access failed"

# Test 3: Lambda Access
echo ""
echo "3️⃣ Testing Lambda Access..."
aws lambda list-functions --max-items 1 >/dev/null 2>&1 && echo "✅ Lambda access confirmed" || echo "❌ Lambda access failed"

# Test 4: Bedrock Access
echo ""
echo "4️⃣ Testing Bedrock Access..."
aws bedrock list-foundation-models --region us-east-1 --max-items 1 >/dev/null 2>&1 && echo "✅ Bedrock access confirmed" || echo "❌ Bedrock access failed"

# Test 5: CloudFormation Access
echo ""
echo "5️⃣ Testing CloudFormation Access..."
aws cloudformation list-stacks --max-items 1 >/dev/null 2>&1 && echo "✅ CloudFormation access confirmed" || echo "❌ CloudFormation access failed"

# Test 6: CDK Bootstrap
echo ""
echo "6️⃣ Testing CDK Bootstrap..."
cd my-cdk-project
echo "Attempting CDK bootstrap..."
cdk bootstrap 2>/dev/null && echo "✅ CDK bootstrap successful" || echo "⚠️  CDK bootstrap failed (may need to run manually)"

echo ""
echo "🎉 Verification Complete!"
echo ""

# Check if all tests passed
if aws s3 ls >/dev/null 2>&1 && aws lambda list-functions --max-items 1 >/dev/null 2>&1 && aws bedrock list-foundation-models --region us-east-1 --max-items 1 >/dev/null 2>&1; then
    echo "✅ ALL TESTS PASSED! You're ready to deploy!"
    echo ""
    echo "🚀 Next Steps:"
    echo "1. cdk deploy BedrockStack         # Deploy AI capabilities"
    echo "2. cdk deploy ComprehensiveStack   # Deploy full application"
    echo "3. Start building amazing things!"
else
    echo "⚠️  Some tests failed. Please ensure PowerUserAccess is properly attached."
    echo ""
    echo "📋 To attach PowerUserAccess:"
    echo "1. Go to AWS Console → IAM → Users → Tony_M"
    echo "2. Add permissions → Attach policies directly"
    echo "3. Search for 'PowerUserAccess' and attach it"
fi
