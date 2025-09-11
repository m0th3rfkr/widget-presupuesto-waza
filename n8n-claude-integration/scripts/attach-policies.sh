#!/bin/bash

# Script to attach necessary AWS policies to Tony_M user
# Run this with an admin profile: aws --profile admin-profile sts get-caller-identity

USER_NAME="Tony_M"

echo "Attaching policies to user: $USER_NAME"

# List of required policies
policies=(
    "arn:aws:iam::aws:policy/AmazonBedrockFullAccess"
    "arn:aws:iam::aws:policy/CloudFormationFullAccess"
    "arn:aws:iam::aws:policy/IAMFullAccess"
    "arn:aws:iam::aws:policy/AWSLambda_FullAccess"
    "arn:aws:iam::aws:policy/AmazonS3FullAccess"
    "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess"
)

# Attach each policy
for policy in "${policies[@]}"; do
    echo "Attaching policy: $policy"
    aws iam attach-user-policy \
        --user-name "$USER_NAME" \
        --policy-arn "$policy"
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully attached: $policy"
    else
        echo "❌ Failed to attach: $policy"
    fi
done

echo "Done! Policies attached to $USER_NAME"
echo "Note: It may take a few minutes for permissions to propagate."
