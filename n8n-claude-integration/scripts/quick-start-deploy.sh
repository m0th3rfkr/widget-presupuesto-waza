#!/bin/bash

echo "🚀 Quick Start Deployment"
echo "========================"

cd my-cdk-project

echo ""
echo "📋 Available stacks to deploy:"
cdk list

echo ""
echo "🎯 Recommended deployment order for learning:"
echo ""

# Option 1: Start with Bedrock (AI focus)
echo "Option 1 - AI First:"
echo "  cdk deploy BedrockStack         # Deploy AI capabilities"
echo "  # Test AI models and experiment"
echo "  cdk deploy ComprehensiveStack   # Add full application later"

echo ""

# Option 2: Start with comprehensive (full app)
echo "Option 2 - Full Application:"
echo "  cdk deploy ComprehensiveStack   # Deploy everything at once"
echo "  # Get complete AI-powered application immediately"

echo ""

# Option 3: Deploy everything
echo "Option 3 - Deploy All:"
echo "  cdk deploy --all                # Deploy all stacks"

echo ""
echo "💡 Choose your path:"
echo "1️⃣  For AI/ML learning: Start with BedrockStack"
echo "2️⃣  For full-stack learning: Start with ComprehensiveStack"
echo "3️⃣  For comprehensive learning: Deploy all stacks"

echo ""
echo "🧪 After deployment, you can test:"
echo "• AI text generation with Claude 3"
echo "• Image generation with Stable Diffusion"
echo "• REST API endpoints"
echo "• Serverless data processing"
echo "• Real-time monitoring"

echo ""
echo "📚 Learning resources created:"
echo "• deployment-guide.md - Complete deployment guide"
echo "• All source code with detailed comments"
echo "• Test scripts and examples"

echo ""
read -p "Ready to deploy? Press Enter to continue or Ctrl+C to exit..."

echo ""
echo "🎯 Let's start with the AI-focused stack:"
echo "Running: cdk deploy BedrockStack"
echo ""

# Uncomment the next line when ready to auto-deploy
# cdk deploy BedrockStack
