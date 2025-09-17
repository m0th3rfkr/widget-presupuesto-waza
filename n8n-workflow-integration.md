# n8n Workflow Integration - Widget Presupuesto WAZA

## 🎯 Project Integration Overview

This document explains how to integrate your budget widget with n8n workflows using the Claude 4 integration package.

## 🚀 Quick Start Setup

### 1. Prerequisites Check
```bash
# Verify you have the necessary tools
python --version    # Should be 3.12.2+
node --version      # Should be 18+
aws --version       # AWS CLI configured
n8n --version       # n8n installed
```

### 2. AWS Infrastructure Setup
```bash
cd /Users/mac/widget-presupuesto-waza/n8n-claude-integration

# Make scripts executable
chmod +x scripts/*.sh

# Set up AWS permissions and deploy
./scripts/setup-project-permissions.sh
./scripts/deploy-now.sh

# Test deployment
./scripts/test-deployment.sh
```

### 3. Test Claude 4 Connection
```bash
cd api
python python-claude4-tools.py
```

## 🔧 n8n Workflow Examples for Budget Widget

### Workflow 1: Automated Quote Generation
**Purpose**: Generate professional quotes from building blocks JSON

```json
{
  "name": "Budget Quote Generator",
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "generate-quote",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Load Building Blocks",
      "type": "n8n-nodes-base.readFile",
      "parameters": {
        "filePath": "/path/to/building-blocks.json"
      }
    },
    {
      "name": "Claude Quote Analysis",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "language": "python",
        "code": "import sys\nsys.path.append('/Users/mac/widget-presupuesto-waza/n8n-claude-integration/api')\nfrom python_claude4_tools import Claude4Client\n\nclient = Claude4Client()\nbuilding_blocks = $json.building_blocks\nproject_requirements = $json.requirements\n\n# Generate intelligent quote analysis\nanalysis = client.advanced_reasoning(\n    f'Analyze these building blocks: {building_blocks} for project: {project_requirements}',\n    reasoning_type='analytical',\n    model='sonnet4'\n)\n\n# Generate Excel structure recommendation\nexcel_structure = client.generate_code(\n    f'Create Excel structure for quote with analysis: {analysis}',\n    language='javascript',\n    complexity='intermediate'\n)\n\nreturn [{'json': {'analysis': analysis, 'excel_structure': excel_structure}}]"
      }
    },
    {
      "name": "Generate Excel File",
      "type": "n8n-nodes-base.executeCommand",
      "parameters": {
        "command": "python",
        "arguments": "/Users/mac/widget-presupuesto-waza/generate-quote.py"
      }
    }
  ]
}
```

### Workflow 2: Zoho CRM Integration with AI Enhancement
**Purpose**: Enhance Zoho CRM data with Claude analysis

```json
{
  "name": "Zoho CRM AI Enhancement",
  "nodes": [
    {
      "name": "Zoho CRM Trigger",
      "type": "n8n-nodes-base.zohoCrm",
      "parameters": {
        "operation": "get",
        "module": "Quotes"
      }
    },
    {
      "name": "Claude Enhancement",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "language": "python",
        "code": "import sys\nsys.path.append('/Users/mac/widget-presupuesto-waza/n8n-claude-integration/api')\nfrom python_claude4_tools import Claude4Client\n\nclient = Claude4Client()\nquote_data = $json\n\n# Enhance quote with AI insights\nenhancement = client.chat(\n    f'Enhance this quote data with professional insights and recommendations: {quote_data}',\n    model='sonnet4',\n    max_tokens=2000\n)\n\n# Generate improvement suggestions\nsuggestions = client.advanced_reasoning(\n    f'Suggest improvements for this quote: {quote_data}',\n    reasoning_type='strategic',\n    model='opus4'\n)\n\nreturn [{'json': {'original': quote_data, 'enhancement': enhancement, 'suggestions': suggestions}}]"
      }
    },
    {
      "name": "Update Zoho CRM",
      "type": "n8n-nodes-base.zohoCrm",
      "parameters": {
        "operation": "update",
        "module": "Quotes"
      }
    }
  ]
}
```

### Workflow 3: Building Blocks Analyzer
**Purpose**: Analyze and optimize building blocks with AI

```json
{
  "name": "Building Blocks AI Analyzer",
  "nodes": [
    {
      "name": "File Upload Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "analyze-building-blocks"
      }
    },
    {
      "name": "Claude Analysis",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "language": "python",
        "code": "import sys\nsys.path.append('/Users/mac/widget-presupuesto-waza/n8n-claude-integration/api')\nfrom python_claude4_tools import Claude4Client\nimport json\n\nclient = Claude4Client()\nbuilding_blocks_json = $json.file_content\n\n# Deep analysis of building blocks\nanalysis = client.advanced_reasoning(\n    f'Perform deep analysis of these software building blocks: {building_blocks_json}. Identify gaps, redundancies, and optimization opportunities.',\n    reasoning_type='analytical',\n    model='opus4.1'\n)\n\n# Generate optimization recommendations\noptimization = client.creative_writing(\n    f'Based on this analysis: {analysis}, create a comprehensive optimization report with specific actionable recommendations.',\n    style='professional',\n    length='detailed',\n    model='opus4'\n)\n\n# Cost estimation improvements\ncost_analysis = client.chat(\n    f'Analyze cost efficiency of these building blocks and suggest pricing optimizations: {building_blocks_json}',\n    model='sonnet4'\n)\n\nreturn [{'json': {\n    'analysis': analysis,\n    'optimization_report': optimization,\n    'cost_analysis': cost_analysis,\n    'timestamp': '{{$now}}'\n}}]"
      }
    },
    {
      "name": "Save Report",
      "type": "n8n-nodes-base.writeFile",
      "parameters": {
        "fileName": "building-blocks-analysis-{{$now}}.json"
      }
    }
  ]
}
```

## 🔗 Integration Points

### 1. Widget → n8n Integration
```javascript
// Add to cotizador.html
function sendToN8nWorkflow(data, workflowUrl) {
    fetch(workflowUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('n8n workflow result:', result);
        mostrarMensaje('Análisis AI completado', 'success');
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('Error en análisis AI: ' + error.message, 'error');
    });
}

// Enhanced quote generation with AI
function generarArchivosConAI() {
    const config = obtenerConfiguracion();
    const datosEstructurados = procesarBuildingBlocks(buildingBlocksData, config);
    
    // Send to n8n for AI enhancement
    sendToN8nWorkflow({
        building_blocks: buildingBlocksData,
        config: config,
        processed_data: datosEstructurados
    }, 'http://localhost:5678/webhook/generate-quote');
}
```

### 2. Zoho CRM → n8n → Widget
```javascript
// Enhanced Zoho integration in index.html
async function createEnhancedQuote() {
    // Original quote creation
    const result = await createTestQuote();
    
    if (result.success) {
        // Send to n8n for AI enhancement
        const enhancement = await fetch('http://localhost:5678/webhook/enhance-quote', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                quote_id: result.quote_id,
                quote_data: result.data
            })
        });
        
        const aiEnhancement = await enhancement.json();
        showStatus('Quote enhanced with AI insights', 'success');
    }
}
```

## 🛠️ Setup Script for Complete Integration

```bash
#!/bin/bash
# setup-complete-integration.sh

echo "🚀 Setting up Widget Presupuesto WAZA with n8n-Claude integration..."

# 1. Setup AWS Infrastructure
cd n8n-claude-integration
./scripts/setup-project-permissions.sh
./scripts/deploy-now.sh

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Test Claude connection
cd api
python python-claude4-tools.py

# 4. Create n8n workflows directory
mkdir -p ../n8n-workflows

# 5. Copy workflow templates
cp ../n8n-workflow-integration.md ../n8n-workflows/

echo "✅ Integration setup complete!"
echo "Next steps:"
echo "1. Start n8n: npx n8n"
echo "2. Import workflows from n8n-workflows/"
echo "3. Configure webhook URLs in cotizador.html"
echo "4. Test complete workflow"
```

## 🔍 Testing the Integration

### 1. Test AWS Connection
```bash
cd n8n-claude-integration/scripts
./verify-poweruser-access.sh
```

### 2. Test n8n Workflows
```bash
# Start n8n
npx n8n

# Test webhook endpoint
curl -X POST http://localhost:5678/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"test": "message"}'
```

### 3. Test Complete Flow
1. Open `cotizador.html`
2. Load building blocks JSON
3. Generate quote with AI enhancement
4. Verify n8n workflow execution
5. Check Zoho CRM integration

## 📊 Monitoring & Logging

### n8n Execution Logs
- Monitor workflow executions in n8n UI
- Set up error alerts for failed workflows
- Track Claude API usage and costs

### AWS CloudWatch
- Monitor Bedrock API calls
- Set up billing alerts
- Track performance metrics

## 🔐 Security Considerations

1. **API Keys**: Store Claude API keys in n8n credentials
2. **Webhooks**: Use authentication tokens for webhook endpoints
3. **AWS IAM**: Follow least privilege principle
4. **Data Privacy**: Ensure sensitive data handling compliance

## 📈 Next Steps

1. **Deploy to Production**: Use AWS production environment
2. **Scale Workflows**: Implement batch processing for large quotes
3. **Advanced AI**: Integrate image analysis for technical drawings
4. **Reporting**: Create automated reporting workflows
5. **Mobile Integration**: Extend to mobile applications

---
🎉 **Your Widget is now AI-powered with n8n automation!**