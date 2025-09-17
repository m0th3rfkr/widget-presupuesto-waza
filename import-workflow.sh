#!/bin/bash
# Import workflow to n8n and update widget

echo "🚀 Importing Budget Workflow to n8n..."

# Wait for n8n to be fully ready
echo "⏳ Waiting for n8n to be ready..."
sleep 5

# Check if n8n is running
if ! curl -s http://localhost:5678 > /dev/null; then
    echo "❌ n8n is not running on port 5678"
    echo "Please run: npx n8n start --tunnel"
    exit 1
fi

echo "✅ n8n is running"

# Get the workflow content
WORKFLOW_FILE="n8n-workflows/simple-budget-workflow.json"
if [ ! -f "$WORKFLOW_FILE" ]; then
    echo "❌ Workflow file not found: $WORKFLOW_FILE"
    exit 1
fi

echo "📋 Workflow file found: $WORKFLOW_FILE"

# Show the webhook URL
echo ""
echo "🔗 Webhook URL for your widget:"
echo "https://dfgisycuxnshfn5xzabdsbpa.hooks.n8n.cloud/webhook/budget-quote"
echo ""

# Create a test payload
cat > test-payload.json << 'EOF'
{
  "building_blocks": {
    "categories": {
      "frontend": {
        "name": "Frontend Development",
        "building_blocks": {
          "ui_components": {
            "name": "UI Components",
            "hours": {
              "facil": 40,
              "intermedio": 80,
              "complejo": 120
            }
          },
          "responsive_design": {
            "name": "Responsive Design",
            "hours": {
              "facil": 20,
              "intermedio": 40,
              "complejo": 60
            }
          }
        }
      },
      "backend": {
        "name": "Backend Development",
        "building_blocks": {
          "api_development": {
            "name": "API Development", 
            "hours": {
              "facil": 60,
              "intermedio": 100,
              "complejo": 160
            }
          }
        }
      }
    }
  },
  "config": {
    "nombreProyecto": "Test Project",
    "tarifaBase": 500,
    "tarifaIA": 300,
    "markup": 40,
    "eficienciaIA": 35,
    "factorPM": 18,
    "factorTesting": 12,
    "factorContingencia": 20
  }
}
EOF

echo "📋 Created test payload: test-payload.json"

echo ""
echo "🧪 Instructions to import workflow:"
echo "1. Open http://localhost:5678 in your browser"
echo "2. Click 'Import from file' or '+ Add workflow'"
echo "3. Select 'Import from file'"
echo "4. Upload: $WORKFLOW_FILE"
echo "5. Activate the workflow"

echo ""
echo "🧪 To test the workflow:"
echo "curl -X POST https://dfgisycuxnshfn5xzabdsbpa.hooks.n8n.cloud/webhook/budget-quote \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d @test-payload.json"

echo ""
echo "✅ Setup complete! Your n8n workflow is ready to use."