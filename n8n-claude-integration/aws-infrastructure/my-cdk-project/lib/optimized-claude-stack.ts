import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class OptimizedClaudeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 🗄️ S3 Bucket for data and knowledge base
    const dataBucket = new s3.Bucket(this, 'ClaudeDataBucket', {
      bucketName: `claude-data-bucket-${this.account}`,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For learning
    });

    // ⚡ Optimized Lambda Function for Claude 3 Haiku & 3.5 Sonnet
    const claudeFunction = new lambda.Function(this, 'OptimizedClaudeFunction', {
      runtime: lambda.Runtime.PYTHON_3_12, // Using your Python 3.12.2
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
import json
import boto3
import os
from typing import Dict, Any, Optional
import base64

def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """
    Optimized Claude 3 Haiku & 3.5 Sonnet Integration
    Supports: Fast responses, cost optimization, multi-modal input
    """
    
    bedrock_runtime = boto3.client('bedrock-runtime')
    
    try:
        # Extract parameters
        action = event.get('action', 'chat')
        model_preference = event.get('model', 'haiku')  # 'haiku' or 'sonnet'
        
        # Model selection based on use case
        if model_preference == 'haiku':
            model_id = 'anthropic.claude-3-haiku-20240307-v1:0'  # Fast & cost-effective
        elif model_preference == 'sonnet':
            model_id = 'anthropic.claude-3-5-sonnet-20240620-v1:0'  # Advanced reasoning
        else:
            model_id = event.get('model_id', 'anthropic.claude-3-haiku-20240307-v1:0')
        
        if action == 'chat':
            return handle_chat(bedrock_runtime, event, model_id)
        elif action == 'analyze_image':
            return handle_image_analysis(bedrock_runtime, event, model_id)
        elif action == 'code_generation':
            return handle_code_generation(bedrock_runtime, event, model_id)
        elif action == 'document_analysis':
            return handle_document_analysis(bedrock_runtime, event, model_id)
        else:
            return handle_chat(bedrock_runtime, event, model_id)  # Default to chat
            
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e),
                'model_used': model_id if 'model_id' in locals() else 'unknown'
            })
        }

def handle_chat(client, event, model_id):
    """Handle conversational chat with Claude"""
    messages = event.get('messages', [])
    if not messages:
        # Single prompt format
        prompt = event.get('prompt', 'Hello! How can I help you today?')
        messages = [{'role': 'user', 'content': prompt}]
    
    body = {
        'anthropic_version': 'bedrock-2023-05-31',
        'max_tokens': event.get('max_tokens', 4000),
        'messages': messages,
        'temperature': event.get('temperature', 0.7),
        'top_p': event.get('top_p', 0.9)
    }
    
    response = client.invoke_model(
        modelId=model_id,
        body=json.dumps(body)
    )
    
    result = json.loads(response['body'].read())
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'response': result['content'][0]['text'],
            'model_used': model_id,
            'usage': result.get('usage', {}),
            'conversation_length': len(messages)
        })
    }

def handle_image_analysis(client, event, model_id):
    """Handle image analysis with Claude 3 (supports vision)"""
    prompt = event.get('prompt', 'Describe this image in detail.')
    image_data = event.get('image_data')  # Base64 encoded image
    image_type = event.get('image_type', 'image/jpeg')
    
    if not image_data:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'No image data provided'})
        }
    
    messages = [{
        'role': 'user',
        'content': [
            {
                'type': 'text',
                'text': prompt
            },
            {
                'type': 'image',
                'source': {
                    'type': 'base64',
                    'media_type': image_type,
                    'data': image_data
                }
            }
        ]
    }]
    
    body = {
        'anthropic_version': 'bedrock-2023-05-31',
        'max_tokens': event.get('max_tokens', 4000),
        'messages': messages,
        'temperature': event.get('temperature', 0.7)
    }
    
    response = client.invoke_model(
        modelId=model_id,
        body=json.dumps(body)
    )
    
    result = json.loads(response['body'].read())
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'analysis': result['content'][0]['text'],
            'model_used': model_id,
            'usage': result.get('usage', {})
        })
    }

def handle_code_generation(client, event, model_id):
    """Handle code generation and programming tasks"""
    prompt = event.get('prompt', 'Write a Python function')
    language = event.get('language', 'python')
    
    enhanced_prompt = f"""
You are an expert programmer. Generate clean, well-documented {language} code for the following request:

{prompt}

Requirements:
- Include proper error handling
- Add clear comments
- Follow best practices
- Include usage examples if appropriate
"""
    
    messages = [{'role': 'user', 'content': enhanced_prompt}]
    
    body = {
        'anthropic_version': 'bedrock-2023-05-31',
        'max_tokens': event.get('max_tokens', 4000),
        'messages': messages,
        'temperature': event.get('temperature', 0.3)  # Lower temperature for code
    }
    
    response = client.invoke_model(
        modelId=model_id,
        body=json.dumps(body)
    )
    
    result = json.loads(response['body'].read())
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'code': result['content'][0]['text'],
            'language': language,
            'model_used': model_id,
            'usage': result.get('usage', {})
        })
    }

def handle_document_analysis(client, event, model_id):
    """Handle document analysis and summarization"""
    document_text = event.get('document_text', '')
    analysis_type = event.get('analysis_type', 'summarize')
    
    if analysis_type == 'summarize':
        prompt = f"Please provide a concise summary of the following document:\\n\\n{document_text}"
    elif analysis_type == 'extract_key_points':
        prompt = f"Extract the key points from the following document:\\n\\n{document_text}"
    elif analysis_type == 'analyze_sentiment':
        prompt = f"Analyze the sentiment and tone of the following document:\\n\\n{document_text}"
    else:
        prompt = f"Analyze the following document: {analysis_type}\\n\\n{document_text}"
    
    messages = [{'role': 'user', 'content': prompt}]
    
    body = {
        'anthropic_version': 'bedrock-2023-05-31',
        'max_tokens': event.get('max_tokens', 4000),
        'messages': messages,
        'temperature': event.get('temperature', 0.5)
    }
    
    response = client.invoke_model(
        modelId=model_id,
        body=json.dumps(body)
    )
    
    result = json.loads(response['body'].read())
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'analysis': result['content'][0]['text'],
            'analysis_type': analysis_type,
            'model_used': model_id,
            'usage': result.get('usage', {})
        })
    }
      `),
      environment: {
        DATA_BUCKET: dataBucket.bucketName,
      },
      timeout: cdk.Duration.minutes(5),
      memorySize: 1024,
    });

    // Grant Bedrock permissions
    claudeFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'bedrock:InvokeModel',
        'bedrock:InvokeModelWithResponseStream',
      ],
      resources: [
        'arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-20240307-v1:0',
        'arn:aws:bedrock:*::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0',
        'arn:aws:bedrock:*::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0',
      ],
    }));

    // Grant S3 access
    dataBucket.grantReadWrite(claudeFunction);

    // 🌐 API Gateway for easy testing
    const api = new apigateway.RestApi(this, 'ClaudeAPI', {
      restApiName: 'Optimized Claude API',
      description: 'API for Claude 3 Haiku & 3.5 Sonnet integration',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const lambdaIntegration = new apigateway.LambdaIntegration(claudeFunction);
    
    // API Routes
    const chatResource = api.root.addResource('chat');
    chatResource.addMethod('POST', lambdaIntegration);
    
    const imageResource = api.root.addResource('analyze-image');
    imageResource.addMethod('POST', lambdaIntegration);
    
    const codeResource = api.root.addResource('generate-code');
    codeResource.addMethod('POST', lambdaIntegration);
    
    const docResource = api.root.addResource('analyze-document');
    docResource.addMethod('POST', lambdaIntegration);

    // 📤 Outputs
    new cdk.CfnOutput(this, 'ClaudeFunctionName', {
      value: claudeFunction.functionName,
      description: 'Optimized Claude Lambda function name',
    });

    new cdk.CfnOutput(this, 'APIEndpoint', {
      value: api.url,
      description: 'API Gateway endpoint for Claude integration',
    });

    new cdk.CfnOutput(this, 'DataBucketName', {
      value: dataBucket.bucketName,
      description: 'S3 bucket for data storage',
    });
  }
}
