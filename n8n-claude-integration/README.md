# n8n Claude Integration Package

Complete Claude 4 API and AWS infrastructure setup for n8n workflows.

## 📁 Package Structure

```
n8n-claude-integration/
├── api/                          # Python API clients
│   ├── python-claude4-tools.py   # Enhanced Claude 4 client
│   └── python-claude-tools.py    # Basic Claude 3.x client
├── aws-infrastructure/           # AWS setup
│   ├── my-cdk-project/          # Complete CDK infrastructure
│   ├── project-developer-role-policy.json
│   ├── project-developer-trust-policy.json
│   └── cdk-bedrock-policy.json
├── scripts/                     # Setup automation
│   ├── setup-project-permissions.sh
│   ├── attach-policies.sh
│   ├── deploy-now.sh
│   └── [other setup scripts]
├── docs/                        # Documentation
└── requirements.txt             # Python dependencies
```

## 🚀 Quick Setup for n8n

### 1. Prerequisites
- Python 3.12.2+
- AWS CLI configured
- Node.js 18+ (for CDK)
- n8n installed

### 2. Install Dependencies
```bash
# Python dependencies
pip install -r requirements.txt

# AWS CDK (if not already installed)
npm install -g aws-cdk
```

### 3. AWS Setup
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Set up AWS permissions
./scripts/setup-project-permissions.sh

# Deploy infrastructure
./scripts/deploy-now.sh
```

### 4. Test API Connection
```python
# Test the Claude API
cd api
python python-claude4-tools.py
```

## 🔧 n8n Integration

### Method 1: Python Script Node
1. Create a "Execute Python Code" node in n8n
2. Copy the API client code from `api/python-claude4-tools.py`
3. Use the `Claude4Client` class in your workflow

### Method 2: HTTP Request Node
Create HTTP nodes to call your deployed AWS API Gateway endpoints.

### Method 3: Custom n8n Node
Use the API clients as base for creating custom n8n community nodes.

## 📋 Available Claude Models

### Claude 4 Series (Recommended)
- **opus4.1**: Most advanced reasoning
- **opus4**: Premium reasoning capabilities
- **sonnet4**: Balanced performance, great for coding

### Claude 3.5+ Series
- **sonnet3.5**: Advanced reasoning
- **haiku3.5**: Fast and efficient

### Usage Example in n8n
```python
from python_claude4_tools import Claude4Client

client = Claude4Client()

# Simple chat
response = client.chat("Analyze this data", model='sonnet4')

# Advanced reasoning
analysis = client.advanced_reasoning(
    "Complex problem here", 
    reasoning_type='analytical',
    model='opus4'
)

# Code generation
code = client.generate_code(
    "Create a data validation function",
    language='python',
    complexity='advanced'
)
```

## 🛡️ Security Notes
- Keep AWS credentials secure
- Use IAM roles with minimal permissions
- Monitor API usage and costs
- Enable CloudTrail for audit logs

## 📊 Cost Optimization
- Use `haiku` or `haiku3.5` for simple tasks
- Use `sonnet4` for balanced performance
- Reserve `opus4.1` for complex reasoning tasks

## 🔄 Workflow Examples

### Data Analysis Workflow
1. **Trigger**: Webhook/Schedule
2. **Process**: Python script with Claude analysis
3. **Output**: Structured JSON response

### Content Generation Workflow
1. **Input**: User prompt
2. **Process**: Claude creative writing
3. **Output**: Generated content

### Code Review Workflow
1. **Input**: Code from repository
2. **Process**: Claude code analysis
3. **Output**: Review comments and suggestions

## 🆘 Troubleshooting

### Common Issues
- **AWS Permissions**: Run `./scripts/verify-poweruser-access.sh`
- **Model Access**: Check `docs/enable-bedrock-models.md`
- **Rate Limits**: Implement proper retry logic

### Support Files
- `docs/deployment-guide.md`: Detailed setup instructions
- `docs/SETUP_COMPLETE.md`: Validation checklist
- `scripts/test-deployment.sh`: Connection testing

## 📝 License
Use according to AWS Bedrock and Claude API terms of service.

---
🤖 **Ready for n8n Integration!**