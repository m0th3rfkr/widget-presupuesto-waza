import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export class ComprehensiveStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 🗄️ S3 Bucket for data storage
    const dataBucket = new s3.Bucket(this, 'DataBucket', {
      bucketName: `learning-data-bucket-${this.account}`,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For learning - don't use in production
    });

    // 🗃️ DynamoDB Table
    const dataTable = new dynamodb.Table(this, 'DataTable', {
      tableName: 'learning-data-table',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // 🔐 IAM Role for Lambda
    const lambdaRole = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
      inlinePolicies: {
        BedrockAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'bedrock:InvokeModel',
                'bedrock:InvokeModelWithResponseStream',
                'bedrock:ListFoundationModels',
              ],
              resources: ['*'],
            }),
          ],
        }),
      },
    });

    // Grant permissions to access S3 and DynamoDB
    dataBucket.grantReadWrite(lambdaRole);
    dataTable.grantReadWriteData(lambdaRole);

    // ⚡ Lambda Function - AI Processing
    const aiProcessorFunction = new lambda.Function(this, 'AIProcessorFunction', {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'index.handler',
      role: lambdaRole,
      code: lambda.Code.fromInline(`
import json
import boto3
import os
from datetime import datetime

def handler(event, context):
    """
    AI Processing Lambda - integrates with Bedrock, S3, and DynamoDB
    """
    
    # Initialize AWS clients
    bedrock = boto3.client('bedrock-runtime')
    s3 = boto3.client('s3')
    dynamodb = boto3.resource('dynamodb')
    
    # Environment variables
    bucket_name = os.environ['BUCKET_NAME']
    table_name = os.environ['TABLE_NAME']
    
    try:
        # Example: Process data with Bedrock AI
        prompt = event.get('prompt', 'Hello, how can I help you today?')
        
        # Call Bedrock (example with Claude)
        response = bedrock.invoke_model(
            modelId='anthropic.claude-3-sonnet-20240229-v1:0',
            body=json.dumps({
                'anthropic_version': 'bedrock-2023-05-31',
                'max_tokens': 1000,
                'messages': [{'role': 'user', 'content': prompt}]
            })
        )
        
        # Parse response
        result = json.loads(response['body'].read())
        ai_response = result['content'][0]['text']
        
        # Store result in DynamoDB
        table = dynamodb.Table(table_name)
        table.put_item(
            Item={
                'id': context.aws_request_id,
                'timestamp': datetime.now().isoformat(),
                'prompt': prompt,
                'response': ai_response,
                'model': 'claude-3-sonnet'
            }
        )
        
        # Store in S3 for backup
        s3.put_object(
            Bucket=bucket_name,
            Key=f'ai-responses/{context.aws_request_id}.json',
            Body=json.dumps({
                'prompt': prompt,
                'response': ai_response,
                'timestamp': datetime.now().isoformat()
            })
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'AI processing completed',
                'response': ai_response,
                'request_id': context.aws_request_id
            })
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        }
      `),
      environment: {
        BUCKET_NAME: dataBucket.bucketName,
        TABLE_NAME: dataTable.tableName,
      },
      timeout: cdk.Duration.minutes(5),
      memorySize: 512,
    });

    // 🌐 API Gateway
    const api = new apigateway.RestApi(this, 'AIProcessorAPI', {
      restApiName: 'Learning AI Processor API',
      description: 'API for AI processing with Bedrock integration',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // API Gateway Lambda Integration
    const lambdaIntegration = new apigateway.LambdaIntegration(aiProcessorFunction);
    
    // API Routes
    const processResource = api.root.addResource('process');
    processResource.addMethod('POST', lambdaIntegration);
    
    const healthResource = api.root.addResource('health');
    healthResource.addMethod('GET', new apigateway.MockIntegration({
      integrationResponses: [{
        statusCode: '200',
        responseTemplates: {
          'application/json': '{"status": "healthy", "timestamp": "$context.requestTime"}'
        }
      }],
      requestTemplates: {
        'application/json': '{"statusCode": 200}'
      }
    }), {
      methodResponses: [{ statusCode: '200' }]
    });

    // 📊 CloudWatch Log Group
    const logGroup = new logs.LogGroup(this, 'AIProcessorLogs', {
      logGroupName: `/aws/lambda/${aiProcessorFunction.functionName}`,
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // ⏰ EventBridge Rule for scheduled processing
    const scheduledRule = new events.Rule(this, 'ScheduledProcessing', {
      schedule: events.Schedule.rate(cdk.Duration.hours(1)),
      description: 'Trigger AI processing every hour',
    });
    
    scheduledRule.addTarget(new targets.LambdaFunction(aiProcessorFunction, {
      event: events.RuleTargetInput.fromObject({
        source: 'scheduled-event',
        prompt: 'Generate a daily AI insight summary'
      })
    }));

    // 📤 Outputs
    new cdk.CfnOutput(this, 'APIEndpoint', {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: dataBucket.bucketName,
      description: 'S3 bucket for data storage',
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: dataTable.tableName,
      description: 'DynamoDB table for data storage',
    });

    new cdk.CfnOutput(this, 'LambdaFunctionName', {
      value: aiProcessorFunction.functionName,
      description: 'Lambda function name',
    });
  }
}
