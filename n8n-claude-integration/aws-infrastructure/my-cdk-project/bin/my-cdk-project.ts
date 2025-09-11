#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MyCdkProjectStack } from '../lib/my-cdk-project-stack';
import { ComprehensiveStack } from '../lib/comprehensive-stack';
import { BedrockStack } from '../lib/bedrock-stack';
import { OptimizedClaudeStack } from '../lib/optimized-claude-stack';
import { Claude4Stack } from '../lib/claude4-stack';

const app = new cdk.App();

// Original simple stack
new MyCdkProjectStack(app, 'MyCdkProjectStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

// Comprehensive stack with multiple AWS services
new ComprehensiveStack(app, 'ComprehensiveStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

// Bedrock-focused stack
new BedrockStack(app, 'BedrockStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

// Optimized Claude 3 Haiku & 3.5 Sonnet stack
new OptimizedClaudeStack(app, 'OptimizedClaudeStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

// Claude 4 Enhanced stack with all latest models
new Claude4Stack(app, 'Claude4Stack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});