#!/bin/bash

# Quick Learning/POC Setup Script
# Run this with admin credentials

USER_NAME="Tony_M"

echo "🎓 Setting up AWS permissions for Learning/POC..."
echo "User: $USER_NAME"
echo ""

# Attach PowerUserAccess (gives access to most services except IAM user management)
echo "📋 Attaching PowerUserAccess policy..."
aws iam attach-user-policy \
    --user-name "$USER_NAME" \
    --policy-arn "arn:aws:iam::aws:policy/PowerUserAccess"

if [ $? -eq 0 ]; then
    echo "✅ PowerUserAccess attached successfully!"
else
    echo "❌ Failed to attach PowerUserAccess"
    exit 1
fi

# Add IAM read permissions for better visibility
echo "📋 Adding IAM read permissions..."
aws iam attach-user-policy \
    --user-name "$USER_NAME" \
    --policy-arn "arn:aws:iam::aws:policy/IAMReadOnlyAccess"

if [ $? -eq 0 ]; then
    echo "✅ IAM read access attached successfully!"
else
    echo "⚠️  Warning: Could not attach IAM read access (not critical)"
fi

echo ""
echo "🎉 Setup complete for Learning/POC!"
echo ""
echo "📝 What you can now do:"
echo "✅ Use all AWS services (except IAM user management)"
echo "✅ Deploy CDK stacks"
echo "✅ Create Bedrock agents, models, prompts"
echo "✅ Create Lambda functions"
echo "✅ Create S3 buckets"
echo "✅ Use CloudFormation"
echo ""
echo "🚀 Next steps:"
echo "1. Test access: aws sts get-caller-identity"
echo "2. Bootstrap CDK: cdk bootstrap"
echo "3. Test Bedrock: aws bedrock list-foundation-models --region us-east-1"
echo "4. Start building!"
