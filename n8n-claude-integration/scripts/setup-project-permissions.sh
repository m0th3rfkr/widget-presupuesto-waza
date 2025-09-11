#!/bin/bash

# Best Practice AWS Project Setup Script
# This creates a role-based approach for secure development

set -e

ACCOUNT_ID="984927793045"
USER_NAME="Tony_M"
ROLE_NAME="ProjectDeveloperRole"
POLICY_NAME="ProjectDeveloperPolicy"

echo "🚀 Setting up AWS permissions for project development..."

# Step 1: Create the custom policy
echo "📋 Creating custom policy: $POLICY_NAME"
aws iam create-policy \
    --policy-name "$POLICY_NAME" \
    --policy-document file://project-developer-role-policy.json \
    --description "Comprehensive policy for CDK and AWS service development"

# Step 2: Create the role
echo "🔐 Creating IAM role: $ROLE_NAME"
aws iam create-role \
    --role-name "$ROLE_NAME" \
    --assume-role-policy-document file://project-developer-trust-policy.json \
    --description "Role for project development with CDK and AWS services"

# Step 3: Attach the policy to the role
echo "🔗 Attaching policy to role"
aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "arn:aws:iam::$ACCOUNT_ID:policy/$POLICY_NAME"

# Step 4: Give user permission to assume the role
echo "👤 Granting user permission to assume role"
aws iam attach-user-policy \
    --user-name "$USER_NAME" \
    --policy-arn "arn:aws:iam::aws:policy/PowerUserAccess"

# Step 5: Create AWS CLI profile for the role
echo "⚙️  Setting up AWS CLI profile"
aws configure set role_arn "arn:aws:iam::$ACCOUNT_ID:role/$ROLE_NAME" --profile project-dev
aws configure set source_profile default --profile project-dev
aws configure set external_id "project-developer-access" --profile project-dev
aws configure set region us-east-1 --profile project-dev

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Test the setup: aws sts get-caller-identity --profile project-dev"
echo "2. Use this profile for CDK: export AWS_PROFILE=project-dev"
echo "3. Bootstrap CDK: cdk bootstrap --profile project-dev"
echo ""
echo "🔧 To use the role in your terminal:"
echo "export AWS_PROFILE=project-dev"
echo "aws sts get-caller-identity  # Should show the role ARN"
