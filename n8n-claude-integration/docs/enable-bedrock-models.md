# 🤖 Enable Bedrock Models

## Your deployment is successful! Now enable AI models:

### **Step 1: Go to Bedrock Console**
https://console.aws.amazon.com/bedrock/home?region=us-east-1#/modelaccess

### **Step 2: Request Model Access**
1. Click **"Manage model access"**
2. Select these models:
   - ✅ **Claude 3 Sonnet** (anthropic.claude-3-sonnet-20240229-v1:0)
   - ✅ **Claude 3 Haiku** (anthropic.claude-3-haiku-20240307-v1:0)
   - ✅ **Titan Text** (amazon.titan-text-express-v1)
   - ✅ **Titan Embeddings** (amazon.titan-embed-text-v1)
3. Click **"Request model access"**
4. Wait 2-5 minutes for approval

### **Step 3: Test AI After Approval**
```bash
# Test text generation
aws lambda invoke \
  --function-name BedrockStack-BedrockIntegrationFunctionDB0065D9-EcgeD9Pjkl1d \
  --payload '{"action": "text_generation", "prompt": "Hello AI!"}' \
  response.json && cat response.json

# Test different models
aws lambda invoke \
  --function-name BedrockStack-BedrockIntegrationFunctionDB0065D9-EcgeD9Pjkl1d \
  --payload '{"action": "text_generation", "model_id": "amazon.titan-text-express-v1", "prompt": "Explain quantum computing"}' \
  response.json && cat response.json
```

## 🚀 **Deploy More Infrastructure**

While models are being approved, deploy the full application:

```bash
# Deploy comprehensive stack with API Gateway
cdk deploy ComprehensiveStack

# Or deploy everything
cdk deploy --all
```

## 🎯 **What You Can Build Now**
- AI chatbots
- Document processing
- Image generation
- Knowledge bases
- REST APIs
- Serverless applications
