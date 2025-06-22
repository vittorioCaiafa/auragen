import { OPENAI_API_KEY } from '@env';

export const debugApiConfiguration = () => {
  console.log('🔍 Debugging API Configuration...');
  
  // Check if API key exists
  if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY is undefined or empty');
    console.log('💡 Solution: Create a .env file in your project root with:');
    console.log('   OPENAI_API_KEY=your_actual_api_key_here');
    return {
      success: false,
      issues: ['API key not found'],
      solutions: [
        'Create a .env file in your project root',
        'Add your OpenAI API key to the .env file',
        'Restart your development server'
      ]
    };
  }
  
  // Check API key format
  if (!OPENAI_API_KEY.startsWith('sk-')) {
    console.error('❌ API key format looks incorrect (should start with "sk-")');
    return {
      success: false,
      issues: ['API key format incorrect'],
      solutions: [
        'Check your API key at https://platform.openai.com/api-keys',
        'Make sure it starts with "sk-"',
        'Copy the full API key including the "sk-" prefix'
      ]
    };
  }
  
  console.log('✅ API Key found and format looks correct');
  console.log('✅ Key length:', OPENAI_API_KEY.length);
  console.log('✅ Key starts with:', OPENAI_API_KEY.substring(0, 7) + '...');
  
  return {
    success: true,
    message: 'API key configuration looks good'
  };
};

export const testDirectApiCall = async () => {
  try {
    console.log('🧪 Testing direct API call...');
    
    if (!OPENAI_API_KEY) {
      throw new Error('API key not found');
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ API Error Response:', data);
      return {
        success: false,
        error: data.error?.message || 'Unknown API error',
        details: data
      };
    }
    
    console.log('✅ Direct API call successful');
    return { success: true, data };
    
  } catch (error: any) {
    console.error('❌ Direct API call failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Test different models to see which ones are available
export const testAvailableModels = async () => {
  try {
    console.log('🧪 Testing available models...');
    
    if (!OPENAI_API_KEY) {
      throw new Error('API key not found');
    }
    
    const models = [
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k',
      'gpt-4',
      'gpt-4-turbo',
      'gpt-4o-mini'
    ];
    
    const results = [];
    
    for (const model of models) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 1,
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          results.push({ model, status: '✅ Available' });
        } else {
          results.push({ 
            model, 
            status: '❌ Error', 
            error: data.error?.message || 'Unknown error' 
          });
        }
      } catch (error) {
        results.push({ model, status: '❌ Failed', error: error.message });
      }
    }
    
    console.log('📊 Model Availability Results:');
    results.forEach(result => {
      console.log(`${result.model}: ${result.status}`);
      if (result.error) console.log(`  Error: ${result.error}`);
    });
    
    return { success: true, results };
    
  } catch (error: any) {
    console.error('❌ Model testing failed:', error.message);
    return { success: false, error: error.message };
  }
}; 