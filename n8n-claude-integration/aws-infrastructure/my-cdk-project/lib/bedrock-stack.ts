import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class BedrockStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 🗄️ S3 Bucket for Bedrock Knowledge Base
    const knowledgeBaseBucket = new s3.Bucket(this, 'KnowledgeBaseBucket', {
      bucketName: `bedrock-knowledge-base-${this.account}`,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // 🔐 IAM Role for Bedrock Agent
    const bedrockAgentRole = new iam.Role(this, 'BedrockAgentRole', {
      assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com'),
      inlinePolicies: {
        BedrockAgentPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'bedrock:InvokeModel',
                'bedrock:InvokeModelWithResponseStream',
              ],
              resources: ['*'],
            }),
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                's3:GetObject',
                's3:ListBucket',
              ],
              resources: [
                knowledgeBaseBucket.bucketArn,
                `${knowledgeBaseBucket.bucketArn}/*`,
              ],
            }),
          ],
        }),
      },
    });

    // ⚡ Lambda Function for Bedrock Integration
    const bedrockFunction = new lambda.Function(this, 'BedrockIntegrationFunction', {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
import json
import boto3
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """
    Comprehensive Bedrock integration function
    Supports: Text generation, Image generation, Embeddings, and more
    """
    
    bedrock_runtime = boto3.client('bedrock-runtime')
    
    try:
        action = event.get('action', 'text_generation')
        
        if action == 'text_generation':
            return handle_text_generation(bedrock_runtime, event)
        elif action == 'image_generation':
            return handle_image_generation(bedrock_runtime, event)
        elif action == 'embeddings':
            return handle_embeddings(bedrock_runtime, event)
        elif action == 'chat':
            return handle_chat(bedrock_runtime, event)
        else:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': f'Unknown action: {action}'})
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

def handle_text_generation(client, event):
    """Handle text generation with various models"""
    model_id = event.get('model_id', 'anthropic.claude-3-sonnet-20240229-v1:0')
    prompt = event.get('prompt', 'Hello, how can I help you?')
    
    if 'anthropic.claude' in model_id:
        body = {
            'anthropic_version': 'bedrock-2023-05-31',
            'max_tokens': event.get('max_tokens', 1000),
            'messages': [{'role': 'user', 'content': prompt}],
            'temperature': event.get('temperature', 0.7)
        }
    elif 'amazon.titan' in model_id:
        body = {
            'inputText': prompt,
            'textGenerationConfig': {
                'maxTokenCount': event.get('max_tokens', 1000),
                'temperature': event.get('temperature', 0.7)
            }
        }
    
    response = client.invoke_model(
        modelId=model_id,
        body=json.dumps(body)
    )
    
    result = json.loads(response['body'].read())
    
    if 'anthropic.claude' in model_id:
        text = result['content'][0]['text']
    elif 'amazon.titan' in model_id:
        text = result['results'][0]['outputText']
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'generated_text': text,
            'model_used': model_id
        })
    }

def handle_image_generation(client, event):
    """Handle image generation with Stable Diffusion"""
    prompt = event.get('prompt', 'A beautiful landscape')
    
    body = {
        'text_prompts': [{'text': prompt}],
        'cfg_scale': event.get('cfg_scale', 10),
        'seed': event.get('seed', 0),
        'steps': event.get('steps', 50)
    }
    
    response = client.invoke_model(
        modelId='stability.stable-diffusion-xl-v1',
        body=json.dumps(body)
    )
    
    result = json.loads(response['body'].read())
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'images': result['artifacts'],
            'prompt_used': prompt
        })
    }

def handle_embeddings(client, event):
    """Handle text embeddings"""
    text = event.get('text', 'Sample text for embedding')
    
    body = {
        'inputText': text
    }
    
    response = client.invoke_model(
        modelId='amazon.titan-embed-text-v1',
        body=json.dumps(body)
    )
    
    result = json.loads(response['body'].read())
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'embedding': result['embedding'],
            'input_text': text
        })
    }

def handle_chat(client, event):
    """Handle conversational chat"""
    messages = event.get('messages', [])
    model_id = event.get('model_id', 'anthropic.claude-3-sonnet-20240229-v1:0')
    
    body = {
        'anthropic_version': 'bedrock-2023-05-31',
        'max_tokens': event.get('max_tokens', 1000),
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
            'response': result['content'][0]['text'],
            'model_used': model_id,
            'conversation_length': len(messages)
        })
    }
      `),
      environment: {
        KNOWLEDGE_BASE_BUCKET: knowledgeBaseBucket.bucketName,
      },
      timeout: cdk.Duration.minutes(5),
      memorySize: 1024,
    });

    // Grant Bedrock permissions to Lambda
    bedrockFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'bedrock:InvokeModel',
        'bedrock:InvokeModelWithResponseStream',
        'bedrock:ListFoundationModels',
        'bedrock:GetFoundationModel',
      ],
      resources: ['*'],
    }));

    // Grant S3 access to Lambda
    knowledgeBaseBucket.grantReadWrite(bedrockFunction);

    // 📤 Outputs
    new cdk.CfnOutput(this, 'BedrockFunctionName', {
      value: bedrockFunction.functionName,
      description: 'Bedrock integration Lambda function',
    });

    new cdk.CfnOutput(this, 'KnowledgeBaseBucketName', {
      value: knowledgeBaseBucket.bucketName,
      description: 'S3 bucket for Bedrock knowledge base',
    });
  }
}
