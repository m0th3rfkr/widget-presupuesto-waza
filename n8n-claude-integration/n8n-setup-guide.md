# n8n Claude Integration Setup Guide

## 🎯 Step-by-Step Setup

### 1. Copy the Package
```bash
# Copy the entire n8n-claude-integration folder to your n8n project directory
cp -r n8n-claude-integration /path/to/your/n8n-project/
```

### 2. Install Python Dependencies
```bash
cd n8n-claude-integration
pip install -r requirements.txt
```

### 3. Configure AWS Credentials
```bash
# Configure AWS CLI (one-time setup)
aws configure
# Enter your AWS Access Key ID, Secret Key, Region (us-east-1), and output format (json)
```

### 4. Deploy AWS Infrastructure
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Set up AWS permissions
./scripts/setup-project-permissions.sh

# Deploy Claude 4 infrastructure
./scripts/deploy-now.sh
```

### 5. Test the Setup
```bash
cd api
python python-claude4-tools.py
```

## 🔧 n8n Integration Methods

### Method 1: Execute Command Node (Recommended)
1. Create "Execute Command" node in n8n
2. Set command: `python`
3. Add parameters: `/path/to/api/python-claude4-tools.py`
4. Configure input/output parsing

### Method 2: Code Node (Python)
```python
import sys
sys.path.append('/path/to/n8n-claude-integration/api')

from python_claude4_tools import Claude4Client

# Initialize client
client = Claude4Client()

# Your workflow logic here
response = client.chat($json.prompt, model='sonnet4')
return [{"json": response}]
```

### Method 3: HTTP Request to AWS API Gateway
After deployment, use the API Gateway endpoints directly:
```
POST https://your-api-gateway-url/claude/chat
Content-Type: application/json

{
  "prompt": "Your message",
  "model": "sonnet4",
  "max_tokens": 4000
}
```

## 🚀 Example n8n Workflows

### 1. Simple Chat Workflow
```json
{
  "nodes": [
    {
      "parameters": {
        "command": "python",
        "arguments": "/path/to/api/python-claude4-tools.py"
      },
      "type": "n8n-nodes-base.executeCommand",
      "name": "Claude Chat"
    }
  ]
}
```

### 2. Advanced Analysis Workflow
```python
# In Code node
client = Claude4Client()

# Advanced reasoning
result = client.advanced_reasoning(
    $json.problem,
    reasoning_type='analytical',
    model='opus4'
)

return [{"json": result}]
```

### 3. Content Generation Workflow
```python
# In Code node
client = Claude4Client()

# Creative writing
content = client.creative_writing(
    $json.prompt,
    style='narrative',
    length='medium',
    model='opus4.1'
)

return [{"json": content}]
```

## ⚙️ Configuration Options

### Environment Variables
```bash
# Optional: Set in your n8n environment
export AWS_DEFAULT_REGION=us-east-1
export CLAUDE_DEFAULT_MODEL=sonnet4
export CLAUDE_MAX_TOKENS=4000
```

### Model Selection Guide
- **haiku**: Fast, cheap (simple tasks)
- **sonnet4**: Balanced performance (recommended)
- **opus4**: Advanced reasoning (complex analysis)
- **opus4.1**: Most advanced (premium tasks)

## 🛡️ Security Best Practices

1. **AWS IAM Roles**: Use least privilege principle
2. **API Keys**: Store securely in n8n credentials
3. **Rate Limiting**: Implement request throttling
4. **Logging**: Enable CloudTrail for audit

## 📊 Monitoring & Costs

### Cost Optimization
- Use appropriate models for task complexity
- Set reasonable max_tokens limits
- Implement caching where possible

### Monitoring
- Check AWS CloudWatch for API usage
- Monitor n8n execution logs
- Set up billing alerts in AWS

## 🔍 Troubleshooting

### Common Issues
1. **Import Error**: Check Python path in n8n
2. **AWS Permissions**: Run verification scripts
3. **Model Access**: Enable models in Bedrock console
4. **Rate Limits**: Implement retry logic

### Debug Commands
```bash
# Test AWS connection
aws bedrock-runtime list-foundation-models --region us-east-1

# Test Python imports
python -c "from api.python_claude4_tools import Claude4Client; print('Success')"
```

## 📈 Advanced Features

### Batch Processing
```python
# Process multiple prompts
prompts = $json.prompts
results = []

for prompt in prompts:
    result = client.chat(prompt, model='sonnet4')
    results.append(result)

return [{"json": {"results": results}}]
```

### Image Analysis
```python
# Analyze uploaded images
image_path = $json.image_path
analysis = client.analyze_image(
    image_path,
    "Analyze this image in detail",
    analysis_depth='detailed',
    model='opus4'
)

return [{"json": analysis}]
```

### Model Comparison
```python
# Compare responses from different models
prompt = $json.prompt
comparison = client.compare_models(
    prompt,
    models=['haiku', 'sonnet4', 'opus4']
)

return [{"json": comparison}]
```

---
🎉 **Your n8n is now Claude 4 ready!**