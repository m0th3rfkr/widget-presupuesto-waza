import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class Claude4Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 🗄️ S3 Bucket for Claude 4 data and knowledge base
    const claude4DataBucket = new s3.Bucket(this, 'Claude4DataBucket', {
      bucketName: `claude4-data-bucket-${this.account}`,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For learning
    });

    // ⚡ Claude 4 Enhanced Lambda Function
    const claude4Function = new lambda.Function(this, 'Claude4Function', {
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
    Claude 4 Enhanced Integration
    Supports: Opus 4.1, Opus 4, Sonnet 4, plus all Claude 3 models
    """
    
    bedrock_runtime = boto3.client('bedrock-runtime')
    
    try:
        # Extract parameters
        action = event.get('action', 'chat')
        model_preference = event.get('model', 'sonnet4')  # Default to Claude Sonnet 4
        
        # Enhanced model selection with Claude 4 support
        model_map = {
            # Claude 4 Models (Latest & Greatest)
            'opus4.1': 'anthropic.claude-opus-4-1-20250805-v1:0',      # Most advanced
            'opus4': 'anthropic.claude-opus-4-20250514-v1:0',          # Premium reasoning
            'sonnet4': 'anthropic.claude-sonnet-4-20250514-v1:0',      # Balanced performance
            
            # Claude 3.5 Models (Still excellent)
            'sonnet3.5': 'anthropic.claude-3-5-sonnet-20240620-v1:0',  # Advanced reasoning
            'sonnet3.5v2': 'anthropic.claude-3-5-sonnet-20241022-v2:0', # Latest 3.5
            'haiku3.5': 'anthropic.claude-3-5-haiku-20241022-v1:0',    # Fast & efficient
            'sonnet3.7': 'anthropic.claude-3-7-sonnet-20250219-v1:0',  # Enhanced 3.x
            
            # Claude 3 Models (Cost-effective)
            'haiku': 'anthropic.claude-3-haiku-20240307-v1:0',         # Fast & cheap
            'sonnet': 'anthropic.claude-3-sonnet-20240229-v1:0',       # Balanced
            'opus': 'anthropic.claude-3-opus-20240229-v1:0',           # Most capable 3.x
        }
        
        model_id = model_map.get(model_preference, model_map['sonnet4'])
        
        if action == 'chat':
            return handle_chat(bedrock_runtime, event, model_id)
        elif action == 'advanced_reasoning':
            return handle_advanced_reasoning(bedrock_runtime, event, model_id)
        elif action == 'analyze_image':
            return handle_image_analysis(bedrock_runtime, event, model_id)
        elif action == 'code_generation':
            return handle_code_generation(bedrock_runtime, event, model_id)
        elif action == 'document_analysis':
            return handle_document_analysis(bedrock_runtime, event, model_id)
        elif action == 'creative_writing':
            return handle_creative_writing(bedrock_runtime, event, model_id)
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
    """Handle conversational chat with Claude 4"""
    messages = event.get('messages', [])
    if not messages:
        prompt = event.get('prompt', 'Hello! How can I help you today?')
        messages = [{'role': 'user', 'content': prompt}]
    
    body = {
        'anthropic_version': 'bedrock-2023-05-31',
        'max_tokens': event.get('max_tokens', 8000),  # Higher for Claude 4
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
            'conversation_length': len(messages),
            'model_generation': get_model_generation(model_id)
        })
    }

def handle_advanced_reasoning(client, event, model_id):
    """Handle complex reasoning tasks with Claude 4"""
    problem = event.get('problem', '')
    reasoning_type = event.get('reasoning_type', 'analytical')
    
    if reasoning_type == 'analytical':
        prompt = f"""
Please analyze the following problem step by step using advanced reasoning:

{problem}

Break down your analysis into:
1. Problem understanding
2. Key factors and variables
3. Logical reasoning steps
4. Conclusion with confidence level
"""
    elif reasoning_type == 'mathematical':
        prompt = f"""
Solve this mathematical problem with detailed step-by-step reasoning:

{problem}

Show all work, explain each step, and verify your answer.
"""
    elif reasoning_type == 'logical':
        prompt = f"""
Apply logical reasoning to this problem:

{problem}

Use formal logic principles and show your reasoning chain.
"""
    else:
        prompt = f"Apply advanced reasoning to analyze: {problem}"
    
    messages = [{'role': 'user', 'content': prompt}]
    
    body = {
        'anthropic_version': 'bedrock-2023-05-31',
        'max_tokens': event.get('max_tokens', 8000),
        'messages': messages,
        'temperature': event.get('temperature', 0.3)  # Lower for reasoning
    }
    
    response = client.invoke_model(
        modelId=model_id,
        body=json.dumps(body)
    )
    
    result = json.loads(response['body'].read())
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'reasoning': result['content'][0]['text'],
            'reasoning_type': reasoning_type,
            'model_used': model_id,
            'usage': result.get('usage', {}),
            'model_generation': get_model_generation(model_id)
        })
    }

def handle_image_analysis(client, event, model_id):
    """Enhanced image analysis with Claude 4 vision capabilities"""
    prompt = event.get('prompt', 'Analyze this image in detail.')
    image_data = event.get('image_data')
    image_type = event.get('image_type', 'image/jpeg')
    analysis_depth = event.get('analysis_depth', 'standard')  # standard, detailed, expert
    
    if not image_data:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'No image data provided'})
        }
    
    # Enhanced prompts based on analysis depth
    if analysis_depth == 'detailed':
        enhanced_prompt = f"""
Provide a comprehensive analysis of this image:

{prompt}

Include:
- Visual elements and composition
- Colors, lighting, and mood
- Objects, people, and activities
- Context and setting
- Technical aspects (if applicable)
- Artistic or aesthetic qualities
"""
    elif analysis_depth == 'expert':
        enhanced_prompt = f"""
Provide an expert-level analysis of this image:

{prompt}

As an expert, analyze:
- Technical composition and photographic elements
- Historical or cultural context
- Symbolic meanings and interpretations
- Quality assessment and critique
- Recommendations or insights
"""
    else:
        enhanced_prompt = prompt
    
    messages = [{
        'role': 'user',
        'content': [
            {'type': 'text', 'text': enhanced_prompt},
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
        'max_tokens': event.get('max_tokens', 8000),
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
            'analysis_depth': analysis_depth,
            'model_used': model_id,
            'usage': result.get('usage', {}),
            'model_generation': get_model_generation(model_id)
        })
    }

def handle_code_generation(client, event, model_id):
    """Enhanced code generation with Claude 4"""
    prompt = event.get('prompt', 'Write a Python function')
    language = event.get('language', 'python')
    complexity = event.get('complexity', 'standard')  # simple, standard, advanced, expert
    
    if complexity == 'expert':
        enhanced_prompt = f"""
You are a senior software architect. Generate production-ready {language} code:

{prompt}

Requirements:
- Enterprise-grade code quality
- Comprehensive error handling and logging
- Performance optimization
- Security best practices
- Extensive documentation and type hints
- Unit tests included
- Design patterns where appropriate
- Scalability considerations
"""
    elif complexity == 'advanced':
        enhanced_prompt = f"""
Generate advanced {language} code with professional standards:

{prompt}

Include:
- Robust error handling
- Type annotations
- Comprehensive docstrings
- Performance considerations
- Security best practices
- Example usage
"""
    else:
        enhanced_prompt = f"""
Generate clean, well-documented {language} code:

{prompt}

Include:
- Clear comments
- Error handling
- Usage examples
- Best practices
"""
    
    messages = [{'role': 'user', 'content': enhanced_prompt}]
    
    body = {
        'anthropic_version': 'bedrock-2023-05-31',
        'max_tokens': event.get('max_tokens', 8000),
        'messages': messages,
        'temperature': event.get('temperature', 0.2)  # Low for code
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
            'complexity': complexity,
            'model_used': model_id,
            'usage': result.get('usage', {}),
            'model_generation': get_model_generation(model_id)
        })
    }

def handle_document_analysis(client, event, model_id):
    """Enhanced document analysis with Claude 4"""
    document_text = event.get('document_text', '')
    analysis_type = event.get('analysis_type', 'comprehensive')
    
    analysis_prompts = {
        'comprehensive': f"Provide a comprehensive analysis of this document including summary, key points, themes, and insights:\\n\\n{document_text}",
        'summarize': f"Create a detailed summary of this document:\\n\\n{document_text}",
        'extract_insights': f"Extract key insights, patterns, and actionable information from this document:\\n\\n{document_text}",
        'sentiment': f"Analyze the sentiment, tone, and emotional content of this document:\\n\\n{document_text}",
        'critique': f"Provide a critical analysis and evaluation of this document:\\n\\n{document_text}",
        'questions': f"Generate thoughtful questions that this document raises or could be asked about it:\\n\\n{document_text}"
    }
    
    prompt = analysis_prompts.get(analysis_type, analysis_prompts['comprehensive'])
    messages = [{'role': 'user', 'content': prompt}]
    
    body = {
        'anthropic_version': 'bedrock-2023-05-31',
        'max_tokens': event.get('max_tokens', 8000),
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
            'usage': result.get('usage', {}),
            'model_generation': get_model_generation(model_id)
        })
    }

def handle_creative_writing(client, event, model_id):
    """Creative writing with Claude 4's enhanced capabilities"""
    prompt = event.get('prompt', 'Write a creative story')
    style = event.get('style', 'narrative')  # narrative, poetry, screenplay, technical, academic
    length = event.get('length', 'medium')   # short, medium, long
    
    style_prompts = {
        'narrative': f"Write a compelling narrative story: {prompt}",
        'poetry': f"Create beautiful poetry: {prompt}",
        'screenplay': f"Write a screenplay format: {prompt}",
        'technical': f"Write technical documentation: {prompt}",
        'academic': f"Write in academic style: {prompt}",
        'business': f"Write professional business content: {prompt}"
    }
    
    length_tokens = {
        'short': 2000,
        'medium': 4000,
        'long': 8000
    }
    
    enhanced_prompt = style_prompts.get(style, style_prompts['narrative'])
    max_tokens = length_tokens.get(length, 4000)
    
    messages = [{'role': 'user', 'content': enhanced_prompt}]
    
    body = {
        'anthropic_version': 'bedrock-2023-05-31',
        'max_tokens': max_tokens,
        'messages': messages,
        'temperature': event.get('temperature', 0.8)  # Higher for creativity
    }
    
    response = client.invoke_model(
        modelId=model_id,
        body=json.dumps(body)
    )
    
    result = json.loads(response['body'].read())
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'content': result['content'][0]['text'],
            'style': style,
            'length': length,
            'model_used': model_id,
            'usage': result.get('usage', {}),
            'model_generation': get_model_generation(model_id)
        })
    }

def get_model_generation(model_id):
    """Determine model generation from model ID"""
    if 'claude-opus-4' in model_id or 'claude-sonnet-4' in model_id:
        return 'Claude 4'
    elif 'claude-3-5' in model_id or 'claude-3-7' in model_id:
        return 'Claude 3.5+'
    elif 'claude-3' in model_id:
        return 'Claude 3'
    else:
        return 'Claude Legacy'
      `),
      environment: {
        DATA_BUCKET: claude4DataBucket.bucketName,
      },
      timeout: cdk.Duration.minutes(10), // Longer timeout for complex tasks
      memorySize: 2048, // More memory for Claude 4
    });

    // Grant comprehensive Bedrock permissions for all Claude models
    claude4Function.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'bedrock:InvokeModel',
        'bedrock:InvokeModelWithResponseStream',
      ],
      resources: [
        // Claude 4 Models
        'arn:aws:bedrock:*::foundation-model/anthropic.claude-opus-4-1-20250805-v1:0',
        'arn:aws:bedrock:*::foundation-model/anthropic.claude-opus-4-20250514-v1:0',
        'arn:aws:bedrock:*::foundation-model/anthropic.claude-sonnet-4-20250514-v1:0',
        
        // Claude 3.5+ Models
        'arn:aws:bedrock:*::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0',
        'arn:aws:bedrock:*::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0',
        'arn:aws:bedrock:*::foundation-model/anthropic.claude-3-5-haiku-20241022-v1:0',
        'arn:aws:bedrock:*::foundation-model/anthropic.claude-3-7-sonnet-20250219-v1:0',
        
        // Claude 3 Models
        'arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-20240307-v1:0',
        'arn:aws:bedrock:*::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0',
        'arn:aws:bedrock:*::foundation-model/anthropic.claude-3-opus-20240229-v1:0',
      ],
    }));

    // Grant S3 access
    claude4DataBucket.grantReadWrite(claude4Function);

    // 🌐 Enhanced API Gateway for Claude 4
    const claude4Api = new apigateway.RestApi(this, 'Claude4API', {
      restApiName: 'Claude 4 Enhanced API',
      description: 'API for Claude 4 Opus, Sonnet, and all Claude models',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const lambdaIntegration = new apigateway.LambdaIntegration(claude4Function);
    
    // Enhanced API Routes
    const chatResource = claude4Api.root.addResource('chat');
    chatResource.addMethod('POST', lambdaIntegration);
    
    const reasoningResource = claude4Api.root.addResource('advanced-reasoning');
    reasoningResource.addMethod('POST', lambdaIntegration);
    
    const imageResource = claude4Api.root.addResource('analyze-image');
    imageResource.addMethod('POST', lambdaIntegration);
    
    const codeResource = claude4Api.root.addResource('generate-code');
    codeResource.addMethod('POST', lambdaIntegration);
    
    const docResource = claude4Api.root.addResource('analyze-document');
    docResource.addMethod('POST', lambdaIntegration);
    
    const creativeResource = claude4Api.root.addResource('creative-writing');
    creativeResource.addMethod('POST', lambdaIntegration);

    // 📤 Outputs
    new cdk.CfnOutput(this, 'Claude4FunctionName', {
      value: claude4Function.functionName,
      description: 'Claude 4 Enhanced Lambda function name',
    });

    new cdk.CfnOutput(this, 'Claude4APIEndpoint', {
      value: claude4Api.url,
      description: 'API Gateway endpoint for Claude 4 integration',
    });

    new cdk.CfnOutput(this, 'Claude4DataBucketName', {
      value: claude4DataBucket.bucketName,
      description: 'S3 bucket for Claude 4 data storage',
    });
  }
}
