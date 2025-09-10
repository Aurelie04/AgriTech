'use client';

import { useState } from 'react';

export default function TestAPIPage() {
  const [testResults, setTestResults] = useState<any[]>([]);

  const testCreditScoreAPI = async () => {
    const testData = {
      farmSize: '50',
      experience: '5',
      previousLoans: true,
      bankStatements: true,
      marketContracts: true,
      irrigationSystem: true,
      cropInsurance: true
    };

    try {
      console.log('Testing credit score API with data:', testData);
      
      const response = await fetch('/api/finance/credit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      const result = await response.json();
      
      setTestResults(prev => [...prev, {
        api: 'Credit Score',
        status: response.status,
        success: result.success,
        data: result,
        timestamp: new Date().toLocaleString()
      }]);
      
      console.log('Credit score test result:', result);
    } catch (error) {
      console.error('Credit score test error:', error);
      setTestResults(prev => [...prev, {
        api: 'Credit Score',
        status: 'Error',
        success: false,
        error: error.message,
        timestamp: new Date().toLocaleString()
      }]);
    }
  };

  const testFinanceAPI = async () => {
    try {
      const response = await fetch('/api/finance');
      const result = await response.json();
      
      setTestResults(prev => [...prev, {
        api: 'Finance Data',
        status: response.status,
        success: result.success,
        data: result,
        timestamp: new Date().toLocaleString()
      }]);
      
      console.log('Finance API test result:', result);
    } catch (error) {
      console.error('Finance API test error:', error);
      setTestResults(prev => [...prev, {
        api: 'Finance Data',
        status: 'Error',
        success: false,
        error: error.message,
        timestamp: new Date().toLocaleString()
      }]);
    }
  };

  const testEquipmentAPI = async () => {
    try {
      const response = await fetch('/api/equipment');
      const result = await response.json();
      
      setTestResults(prev => [...prev, {
        api: 'Equipment Data',
        status: response.status,
        success: result.success,
        data: result,
        timestamp: new Date().toLocaleString()
      }]);
      
      console.log('Equipment API test result:', result);
    } catch (error) {
      console.error('Equipment API test error:', error);
      setTestResults(prev => [...prev, {
        api: 'Equipment Data',
        status: 'Error',
        success: false,
        error: error.message,
        timestamp: new Date().toLocaleString()
      }]);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">API Testing Page</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testCreditScoreAPI}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-4"
          >
            Test Credit Score API
          </button>
          
          <button
            onClick={testFinanceAPI}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors mr-4"
          >
            Test Finance API
          </button>
          
          <button
            onClick={testEquipmentAPI}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors mr-4"
          >
            Test Equipment API
          </button>
          
          <button
            onClick={clearResults}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Clear Results
          </button>
        </div>

        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{result.api}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {result.success ? 'Success' : 'Failed'}
                  </span>
                  <span className="text-sm text-gray-500">{result.timestamp}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Status Code:</span> {result.status}
                </div>
                
                {result.error && (
                  <div>
                    <span className="font-medium text-red-600">Error:</span> {result.error}
                  </div>
                )}
                
                <div>
                  <span className="font-medium">Response:</span>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


