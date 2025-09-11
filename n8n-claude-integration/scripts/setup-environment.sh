#!/bin/bash

# Environment Setup Script
echo "🌍 Setting up development environment..."

# Set AWS profile for development
export AWS_PROFILE=project-dev

# Verify access
echo "🔍 Verifying AWS access..."
aws sts get-caller-identity

# Bootstrap CDK
echo "🚀 Bootstrapping CDK..."
cd my-cdk-project
cdk bootstrap

# Install additional CDK modules
echo "📦 Installing additional CDK modules..."
npm install @aws-cdk/aws-bedrock-alpha

echo "✅ Environment setup complete!"
echo ""
echo "🎯 Ready to build:"
echo "- Bedrock agents and models"
echo "- Lambda functions"
echo "- S3 buckets"
echo "- IAM roles and policies"
echo "- CloudFormation stacks"
