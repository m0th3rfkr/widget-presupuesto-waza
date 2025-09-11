#!/usr/bin/env python3
"""
Enhanced Python Tools for Claude 4 (Opus 4.1, Opus 4, Sonnet 4)
Plus all Claude 3.5+ and Claude 3 models
Optimized for your Python 3.12.2 environment
"""

import boto3
import json
import base64
from typing import Dict, Any, Optional, List
import requests
from datetime import datetime

class Claude4Client:
    """Enhanced Claude client with full Claude 4 support"""
    
    def __init__(self, region: str = 'us-east-1'):
        self.bedrock_runtime = boto3.client('bedrock-runtime', region_name=region)
        self.models = {
            # Claude 4 Models (Latest & Greatest)
            'opus4.1': 'anthropic.claude-opus-4-1-20250805-v1:0',      # Most advanced
            'opus4': 'anthropic.claude-opus-4-20250514-v1:0',          # Premium reasoning
            'sonnet4': 'anthropic.claude-sonnet-4-20250514-v1:0',      # Balanced performance
            
            # Claude 3.5+ Models (Still excellent)
            'sonnet3.5': 'anthropic.claude-3-5-sonnet-20240620-v1:0',  # Advanced reasoning
            'sonnet3.5v2': 'anthropic.claude-3-5-sonnet-20241022-v2:0', # Latest 3.5
            'haiku3.5': 'anthropic.claude-3-5-haiku-20241022-v1:0',    # Fast & efficient
            'sonnet3.7': 'anthropic.claude-3-7-sonnet-20250219-v1:0',  # Enhanced 3.x
            
            # Claude 3 Models (Cost-effective)
            'haiku': 'anthropic.claude-3-haiku-20240307-v1:0',         # Fast & cheap
            'sonnet': 'anthropic.claude-3-sonnet-20240229-v1:0',       # Balanced
            'opus': 'anthropic.claude-3-opus-20240229-v1:0',           # Most capable 3.x
        }
        
        # Model capabilities and pricing info
        self.model_info = {
            'opus4.1': {'generation': 'Claude 4', 'cost': 'Premium', 'best_for': 'Most advanced reasoning, complex tasks'},
            'opus4': {'generation': 'Claude 4', 'cost': 'Premium', 'best_for': 'Advanced reasoning, research'},
            'sonnet4': {'generation': 'Claude 4', 'cost': 'High', 'best_for': 'Balanced performance, coding'},
            'sonnet3.5': {'generation': 'Claude 3.5', 'cost': 'Medium', 'best_for': 'Advanced tasks, good balance'},
            'sonnet3.5v2': {'generation': 'Claude 3.5', 'cost': 'Medium', 'best_for': 'Latest improvements'},
            'haiku3.5': {'generation': 'Claude 3.5', 'cost': 'Low', 'best_for': 'Fast responses, efficiency'},
            'sonnet3.7': {'generation': 'Claude 3.7', 'cost': 'Medium', 'best_for': 'Enhanced capabilities'},
            'haiku': {'generation': 'Claude 3', 'cost': 'Very Low', 'best_for': 'Speed, cost optimization'},
            'sonnet': {'generation': 'Claude 3', 'cost': 'Low', 'best_for': 'General purpose'},
            'opus': {'generation': 'Claude 3', 'cost': 'Medium', 'best_for': 'Complex reasoning'},
        }
    
    def chat(self, 
             prompt: str, 
             model: str = 'sonnet4',  # Default to Claude Sonnet 4
             max_tokens: int = 8000,
             temperature: float = 0.7) -> Dict[str, Any]:
        """
        Chat with Claude 4 or any Claude model
        
        Args:
            prompt: Your message to Claude
            model: Model to use (opus4.1, opus4, sonnet4, sonnet3.5, haiku, etc.)
            max_tokens: Maximum response length (up to 8000 for Claude 4)
            temperature: Creativity level (0.0-1.0)
        """
        
        model_id = self.models.get(model, self.models['sonnet4'])
        
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
                'model_generation': self.model_info[model]['generation'],
                'usage': result.get('usage', {}),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'model_used': model_id,
                'timestamp': datetime.now().isoformat()
            }
    
    def advanced_reasoning(self,
                          problem: str,
                          reasoning_type: str = 'analytical',
                          model: str = 'opus4') -> Dict[str, Any]:
        """
        Advanced reasoning with Claude 4 (recommended for complex problems)
        
        Args:
            problem: The problem to analyze
            reasoning_type: 'analytical', 'mathematical', 'logical', 'scientific'
            model: Model to use (opus4.1 or opus4 recommended)
        """
        
        reasoning_prompts = {
            'analytical': f"""
Analyze this problem using advanced analytical reasoning:

{problem}

Please provide:
1. Problem decomposition
2. Key variables and relationships
3. Step-by-step logical analysis
4. Multiple perspectives
5. Conclusion with confidence assessment
""",
            'mathematical': f"""
Solve this mathematical problem with rigorous step-by-step reasoning:

{problem}

Show all work, explain each step, verify your answer, and discuss alternative approaches.
""",
            'logical': f"""
Apply formal logical reasoning to this problem:

{problem}

Use logical principles, identify premises and conclusions, and show your reasoning chain.
""",
            'scientific': f"""
Apply scientific reasoning and methodology to analyze:

{problem}

Include hypothesis formation, evidence evaluation, and scientific conclusions.
"""
        }
        
        prompt = reasoning_prompts.get(reasoning_type, reasoning_prompts['analytical'])
        
        return self.chat(prompt, model=model, temperature=0.3)
    
    def analyze_image(self, 
                     image_path: str, 
                     prompt: str = "Provide a comprehensive analysis of this image.",
                     analysis_depth: str = 'detailed',
                     model: str = 'opus4') -> Dict[str, Any]:
        """
        Advanced image analysis with Claude 4 vision capabilities
        
        Args:
            image_path: Path to image file
            prompt: Analysis request
            analysis_depth: 'standard', 'detailed', 'expert'
            model: Model to use (opus4.1 or opus4 recommended for vision)
        """
        
        try:
            # Read and encode image
            with open(image_path, 'rb') as image_file:
                image_data = base64.b64encode(image_file.read()).decode('utf-8')
            
            # Determine image type
            if image_path.lower().endswith('.png'):
                media_type = 'image/png'
            elif image_path.lower().endswith(('.jpg', '.jpeg')):
                media_type = 'image/jpeg'
            elif image_path.lower().endswith('.gif'):
                media_type = 'image/gif'
            elif image_path.lower().endswith('.webp'):
                media_type = 'image/webp'
            else:
                media_type = 'image/jpeg'
            
            # Enhanced prompts based on analysis depth
            depth_prompts = {
                'standard': prompt,
                'detailed': f"""
Provide a comprehensive analysis of this image:

{prompt}

Include:
- Visual composition and elements
- Colors, lighting, and mood
- Objects, people, and activities
- Context and setting
- Technical aspects
- Artistic qualities
""",
                'expert': f"""
Provide an expert-level analysis of this image:

{prompt}

As an expert, analyze:
- Technical composition and photographic elements
- Historical, cultural, or artistic context
- Symbolic meanings and interpretations
- Quality assessment and critique
- Professional insights and recommendations
"""
            }
            
            enhanced_prompt = depth_prompts.get(analysis_depth, depth_prompts['detailed'])
            model_id = self.models.get(model, self.models['opus4'])
            
            messages = [{
                'role': 'user',
                'content': [
                    {'type': 'text', 'text': enhanced_prompt},
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
                'max_tokens': 8000,
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
                'analysis_depth': analysis_depth,
                'model_used': model_id,
                'model_generation': self.model_info[model]['generation'],
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
                     complexity: str = 'advanced',
                     model: str = 'sonnet4') -> Dict[str, Any]:
        """
        Advanced code generation with Claude 4
        
        Args:
            description: What you want the code to do
            language: Programming language
            complexity: 'simple', 'standard', 'advanced', 'expert'
            model: Model to use (sonnet4 recommended for coding)
        """
        
        complexity_prompts = {
            'simple': f"Generate clean {language} code: {description}",
            'standard': f"""
Generate well-structured {language} code:

{description}

Include:
- Clear comments
- Error handling
- Usage examples
""",
            'advanced': f"""
Generate professional {language} code:

{description}

Requirements:
- Robust error handling
- Type annotations (where applicable)
- Comprehensive docstrings
- Performance considerations
- Security best practices
- Example usage
""",
            'expert': f"""
Generate enterprise-grade {language} code:

{description}

Requirements:
- Production-ready quality
- Comprehensive error handling and logging
- Performance optimization
- Security best practices
- Extensive documentation and type hints
- Unit tests included
- Design patterns where appropriate
- Scalability considerations
"""
        }
        
        prompt = complexity_prompts.get(complexity, complexity_prompts['advanced'])
        
        return self.chat(prompt, model=model, temperature=0.2)
    
    def creative_writing(self,
                        prompt: str,
                        style: str = 'narrative',
                        length: str = 'medium',
                        model: str = 'opus4.1') -> Dict[str, Any]:
        """
        Creative writing with Claude 4's enhanced capabilities
        
        Args:
            prompt: Writing prompt
            style: 'narrative', 'poetry', 'screenplay', 'academic', 'business'
            length: 'short', 'medium', 'long'
            model: Model to use (opus4.1 recommended for creativity)
        """
        
        style_prompts = {
            'narrative': f"Write a compelling narrative story: {prompt}",
            'poetry': f"Create beautiful, evocative poetry: {prompt}",
            'screenplay': f"Write in screenplay format: {prompt}",
            'academic': f"Write in academic style: {prompt}",
            'business': f"Write professional business content: {prompt}",
            'technical': f"Write clear technical documentation: {prompt}"
        }
        
        length_tokens = {
            'short': 2000,
            'medium': 4000,
            'long': 8000
        }
        
        enhanced_prompt = style_prompts.get(style, style_prompts['narrative'])
        max_tokens = length_tokens.get(length, 4000)
        
        return self.chat(enhanced_prompt, model=model, max_tokens=max_tokens, temperature=0.8)
    
    def compare_models(self, prompt: str, models: List[str] = None) -> Dict[str, Any]:
        """
        Compare responses from different Claude models
        
        Args:
            prompt: The prompt to test
            models: List of models to compare (default: ['haiku', 'sonnet3.5', 'sonnet4', 'opus4'])
        """
        
        if models is None:
            models = ['haiku', 'sonnet3.5', 'sonnet4', 'opus4']
        
        results = {}
        
        for model in models:
            print(f"Testing {model}...")
            result = self.chat(prompt, model=model)
            results[model] = {
                'response': result.get('response', result.get('error', 'No response')),
                'model_info': self.model_info.get(model, {}),
                'usage': result.get('usage', {}),
                'error': result.get('error')
            }
        
        return {
            'prompt': prompt,
            'comparisons': results,
            'timestamp': datetime.now().isoformat()
        }
    
    def get_model_recommendations(self, task_type: str) -> Dict[str, str]:
        """Get model recommendations for different task types"""
        
        recommendations = {
            'chat': 'sonnet4 - Best balance of capability and cost',
            'reasoning': 'opus4.1 - Most advanced reasoning capabilities',
            'coding': 'sonnet4 - Optimized for code generation',
            'creative': 'opus4.1 - Best for creative and artistic tasks',
            'analysis': 'opus4 - Excellent for document and data analysis',
            'speed': 'haiku3.5 - Fastest responses, good quality',
            'cost': 'haiku - Most cost-effective option',
            'vision': 'opus4.1 - Best image analysis capabilities',
            'research': 'opus4 - Deep analysis and research tasks'
        }
        
        return {
            'task': task_type,
            'recommendation': recommendations.get(task_type, 'sonnet4 - Good general purpose model'),
            'all_recommendations': recommendations
        }

def test_claude4_setup():
    """Test Claude 4 setup with all models"""
    print("🚀 Testing Claude 4 Enhanced Setup...")
    print("=" * 60)
    
    client = Claude4Client()
    
    # Test Claude 4 models
    claude4_models = ['opus4.1', 'opus4', 'sonnet4']
    
    for model in claude4_models:
        print(f"\n🧠 Testing {model.upper()}...")
        result = client.chat(
            f"Hello! I'm testing {model}. Please introduce yourself and explain what makes you special in 2 sentences.",
            model=model
        )
        
        if 'error' in result:
            print(f"❌ {model} Error: {result['error']}")
        else:
            print(f"✅ {model} Response: {result['response'][:150]}...")
            print(f"📊 Generation: {result.get('model_generation', 'Unknown')}")
            if 'usage' in result and result['usage']:
                print(f"📈 Usage: {result['usage']}")
    
    # Test advanced reasoning
    print(f"\n🔬 Testing Advanced Reasoning with Claude Opus 4...")
    reasoning_result = client.advanced_reasoning(
        "What are the implications of quantum computing for current encryption methods?",
        reasoning_type='analytical',
        model='opus4'
    )
    
    if 'error' in reasoning_result:
        print(f"❌ Reasoning Error: {reasoning_result['error']}")
    else:
        print(f"✅ Advanced Reasoning: {reasoning_result['response'][:200]}...")
    
    # Test code generation
    print(f"\n💻 Testing Code Generation with Claude Sonnet 4...")
    code_result = client.generate_code(
        "Create a Python class for managing a simple task queue with priority support",
        language='python',
        complexity='advanced',
        model='sonnet4'
    )
    
    if 'error' in code_result:
        print(f"❌ Code Generation Error: {code_result['error']}")
    else:
        print(f"✅ Code Generated Successfully!")
        print("📝 Code Preview:")
        print(code_result['response'][:300] + "...")
    
    print("\n🎉 Claude 4 setup test completed!")
    
    # Show model recommendations
    print("\n📋 Model Recommendations:")
    print("-" * 40)
    tasks = ['reasoning', 'coding', 'creative', 'speed', 'cost']
    for task in tasks:
        rec = client.get_model_recommendations(task)
        print(f"• {task.title()}: {rec['recommendation']}")

if __name__ == "__main__":
    # Run comprehensive test
    test_claude4_setup()
    
    print("\n" + "=" * 60)
    print("🎯 Quick Claude 4 Examples:")
    print("=" * 60)
    
    client = Claude4Client()
    
    # Example 1: Compare models
    print("\n🔄 Comparing Models:")
    comparison = client.compare_models(
        "Explain the concept of machine learning in one paragraph.",
        models=['haiku', 'sonnet4', 'opus4']
    )
    
    for model, result in comparison['comparisons'].items():
        if not result.get('error'):
            print(f"\n{model.upper()}: {result['response'][:100]}...")
    
    # Example 2: Advanced reasoning
    print(f"\n🧠 Advanced Reasoning Example:")
    reasoning = client.advanced_reasoning(
        "How might artificial intelligence change software development in the next 5 years?",
        reasoning_type='analytical',
        model='opus4.1'
    )
    
    if 'response' in reasoning:
        print(f"Claude Opus 4.1: {reasoning['response'][:200]}...")
    
    print(f"\n🎉 Claude 4 is ready for advanced AI development!")
