#!/bin/bash

echo "🔍 Verifying Learning/POC Setup..."
echo ""

# Test basic AWS access
echo "1️⃣ Testing AWS Identity..."
aws sts get-caller-identity
echo ""

# Test Bedrock access
echo "2️⃣ Testing Bedrock access..."
aws bedrock list-foundation-models --region us-east-1 --max-items 3
echo ""

# Test S3 access
echo "3️⃣ Testing S3 access..."
aws s3 ls
echo ""

# Test Lambda access
echo "4️⃣ Testing Lambda access..."
aws lambda list-functions --max-items 3
echo ""

# Test CloudFormation access
echo "5️⃣ Testing CloudFormation access..."
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE --max-items 3
echo ""

# Bootstrap CDK
echo "6️⃣ Bootstrapping CDK..."
cd my-cdk-project
cdk bootstrap
echo ""

# Test CDK commands
echo "7️⃣ Testing CDK commands..."
cdk list
echo ""

echo "🎉 All tests completed!"
echo ""
echo "🚀 You're ready to start building with:"
echo "- AWS CDK for infrastructure"
echo "- Bedrock for AI/ML"
echo "- Lambda for serverless functions"
echo "- S3 for storage"
echo "- And much more!"
