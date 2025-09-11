#!/bin/bash

echo "🚀 IMMEDIATE DEPLOYMENT - Run after PowerUserAccess is applied"
echo "=============================================================="

# Verify access first
echo "🔍 Step 1: Verifying access..."
./verify-poweruser-access.sh

echo ""
echo "🏗️ Step 2: Bootstrap CDK (one-time setup)..."
cd my-cdk-project
cdk bootstrap

echo ""
echo "🤖 Step 3: Deploy AI Stack (BedrockStack)..."
cdk deploy BedrockStack --require-approval never

echo ""
echo "🧪 Step 4: Test AI deployment..."
echo "Testing Bedrock integration..."

# Get the function name
FUNCTION_NAME=$(aws cloudformation describe-stacks \
  --stack-name BedrockStack \
  --query 'Stacks[0].Outputs[?OutputKey==`BedrockFunctionName`].OutputValue' \
  --output text 2>/dev/null)

if [ ! -z "$FUNCTION_NAME" ]; then
    echo "✅ Found function: $FUNCTION_NAME"
    echo "🧪 Testing AI text generation..."
    
    aws lambda invoke \
      --function-name "$FUNCTION_NAME" \
      --payload '{"action": "text_generation", "prompt": "Hello! Explain what you can do in 2 sentences."}' \
      response.json
    
    echo "📄 AI Response:"
    cat response.json | jq -r '.body' | jq -r '.generated_text' 2>/dev/null || cat response.json
    echo ""
else
    echo "⚠️ Function not found yet, may need a moment to propagate"
fi

echo ""
echo "🎉 BedrockStack deployed successfully!"
echo ""
echo "🚀 Next: Deploy full application?"
echo "Run: cdk deploy ComprehensiveStack"
echo ""
echo "🧪 Or test more AI capabilities:"
echo "aws lambda invoke --function-name $FUNCTION_NAME \\"
echo "  --payload '{\"action\": \"text_generation\", \"prompt\": \"Your prompt here\"}' \\"
echo "  response.json && cat response.json"
