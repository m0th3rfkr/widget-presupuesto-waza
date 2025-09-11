#!/usr/bin/env python3
"""
Python Development Tools for Claude 3 Haiku & 3.5 Sonnet
Optimized for your Python 3.12.2 environment
"""

import boto3
import json
import base64
from typing import Dict, Any, Optional, List
import requests
from datetime import datetime

class ClaudeClient:
    """Optimized Claude client for Haiku and Sonnet models"""
    
    def __init__(self, region: str = 'us-east-1'):
        self.bedrock_runtime = boto3.client('bedrock-runtime', region_name=region)
        self.models = {
            'haiku': 'anthropic.claude-3-haiku-20240307-v1:0',
            'sonnet': 'anthropic.claude-3-5-sonnet-20240620-v1:0',
            'sonnet_v2': 'anthropic.claude-3-5-sonnet-20241022-v2:0'
        }
    
    def chat(self, 
             prompt: str, 
             model: str = 'haiku',
             max_tokens: int = 4000,
             temperature: float = 0.7) -> Dict[str, Any]:
        """
        Simple chat with Claude
        
        Args:
            prompt: Your message to Claude
            model: 'haiku' (fast/cheap) or 'sonnet' (advanced)
            max_tokens: Maximum response length
            temperature: Creativity level (0.0-1.0)
        """
        
        model_id = self.models.get(model, self.models['haiku'])
        
        body = {
            'anthropic_version': 'bedrock-2023-05-31',
            'max_tokens': max_tokens,
            'messages': [{'role': 'user', 'content': prompt}],
            'temperature': temperature
        }
        
        try:
            response = self.bedrock_runtime.invoke_model(
                modelId=model_id,
                body=json.dumps(body)
            )
            
            result = json.loads(response['body'].read())
            
            return {
                'response': result['content'][0]['text'],
                'model_used': model_id,
                'usage': result.get('usage', {}),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'model_used': model_id,
                'timestamp': datetime.now().isoformat()
            }
    
    def analyze_image(self, 
                     image_path: str, 
                     prompt: str = "Describe this image in detail.",
                     model: str = 'sonnet') -> Dict[str, Any]:
        """
        Analyze an image with Claude (vision capabilities)
        
        Args:
            image_path: Path to image file
            prompt: What you want to know about the image
            model: 'haiku' or 'sonnet' (sonnet recommended for vision)
        """
        
        try:
            # Read and encode image
            with open(image_path, 'rb') as image_file:
                image_data = base64.b64encode(image_file.read()).decode('utf-8')
            
            # Determine image type
            if image_path.lower().endswith('.png'):
                media_type = 'image/png'
            elif image_path.lower().endswith('.jpg') or image_path.lower().endswith('.jpeg'):
                media_type = 'image/jpeg'
            elif image_path.lower().endswith('.gif'):
                media_type = 'image/gif'
            elif image_path.lower().endswith('.webp'):
                media_type = 'image/webp'
            else:
                media_type = 'image/jpeg'  # Default
            
            model_id = self.models.get(model, self.models['sonnet'])
            
            messages = [{
                'role': 'user',
                'content': [
                    {'type': 'text', 'text': prompt},
                    {
                        'type': 'image',
                        'source': {
                            'type': 'base64',
                            'media_type': media_type,
                            'data': image_data
                        }
                    }
                ]
            }]
            
            body = {
                'anthropic_version': 'bedrock-2023-05-31',
                'max_tokens': 4000,
                'messages': messages,
                'temperature': 0.7
            }
            
            response = self.bedrock_runtime.invoke_model(
                modelId=model_id,
                body=json.dumps(body)
            )
            
            result = json.loads(response['body'].read())
            
            return {
                'analysis': result['content'][0]['text'],
                'model_used': model_id,
                'usage': result.get('usage', {}),
                'image_path': image_path,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'image_path': image_path,
                'timestamp': datetime.now().isoformat()
            }
    
    def generate_code(self, 
                     description: str,
                     language: str = 'python',
                     model: str = 'sonnet') -> Dict[str, Any]:
        """
        Generate code with Claude
        
        Args:
            description: What you want the code to do
            language: Programming language
            model: 'haiku' or 'sonnet' (sonnet recommended for code)
        """
        
        prompt = f"""
You are an expert {language} programmer. Generate clean, well-documented code for:

{description}

Requirements:
- Include proper error handling
- Add clear comments explaining the logic
- Follow {language} best practices
- Include usage examples
- Make it production-ready
"""
        
        return self.chat(prompt, model=model, temperature=0.3)
    
    def conversation(self, 
                    messages: List[Dict[str, str]], 
                    model: str = 'haiku') -> Dict[str, Any]:
        """
        Multi-turn conversation with Claude
        
        Args:
            messages: List of {'role': 'user'/'assistant', 'content': 'text'}
            model: 'haiku' or 'sonnet'
        """
        
        model_id = self.models.get(model, self.models['haiku'])
        
        body = {
            'anthropic_version': 'bedrock-2023-05-31',
            'max_tokens': 4000,
            'messages': messages,
            'temperature': 0.7
        }
        
        try:
            response = self.bedrock_runtime.invoke_model(
                modelId=model_id,
                body=json.dumps(body)
            )
            
            result = json.loads(response['body'].read())
            
            return {
                'response': result['content'][0]['text'],
                'model_used': model_id,
                'usage': result.get('usage', {}),
                'conversation_length': len(messages),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'model_used': model_id,
                'timestamp': datetime.now().isoformat()
            }

def test_claude_setup():
    """Test your Claude setup"""
    print("🧪 Testing Claude 3 Haiku & 3.5 Sonnet Setup...")
    print("=" * 50)
    
    client = ClaudeClient()
    
    # Test Haiku (fast and cost-effective)
    print("🚀 Testing Claude 3 Haiku...")
    haiku_result = client.chat(
        "Hello! Please introduce yourself and explain what you can help with in 2 sentences.",
        model='haiku'
    )
    
    if 'error' in haiku_result:
        print(f"❌ Haiku Error: {haiku_result['error']}")
    else:
        print(f"✅ Haiku Response: {haiku_result['response'][:100]}...")
        print(f"📊 Usage: {haiku_result.get('usage', {})}")
    
    print()
    
    # Test Sonnet (advanced reasoning)
    print("🧠 Testing Claude 3.5 Sonnet...")
    sonnet_result = client.chat(
        "Explain the difference between Python lists and tuples with a practical example.",
        model='sonnet'
    )
    
    if 'error' in sonnet_result:
        print(f"❌ Sonnet Error: {sonnet_result['error']}")
    else:
        print(f"✅ Sonnet Response: {sonnet_result['response'][:100]}...")
        print(f"📊 Usage: {sonnet_result.get('usage', {})}")
    
    print()
    
    # Test code generation
    print("💻 Testing Code Generation...")
    code_result = client.generate_code(
        "Create a Python function that calculates the Fibonacci sequence up to n terms",
        language='python',
        model='sonnet'
    )
    
    if 'error' in code_result:
        print(f"❌ Code Generation Error: {code_result['error']}")
    else:
        print(f"✅ Code Generated Successfully!")
        print("📝 Generated Code Preview:")
        print(code_result['response'][:200] + "...")
    
    print("\n🎉 Claude setup test completed!")

if __name__ == "__main__":
    # Example usage
    test_claude_setup()
    
    # Interactive example
    print("\n" + "=" * 50)
    print("🎯 Quick Interactive Example:")
    print("=" * 50)
    
    client = ClaudeClient()
    
    # Simple chat
    result = client.chat("What's the weather like for AI development today?", model='haiku')
    if 'response' in result:
        print(f"Claude Haiku: {result['response']}")
    
    # Code generation example
    code_result = client.generate_code(
        "Create a simple REST API endpoint using Flask",
        language='python'
    )
    if 'response' in code_result:
        print(f"\n💻 Generated Flask Code:\n{code_result['response'][:300]}...")
