import React, { useEffect, useState } from "react";

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filteredResponse, setFilteredResponse] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
    setError("");
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const parsed = JSON.parse(jsonInput);

      if (!parsed.data || !Array.isArray(parsed.data)) {
        throw new Error("JSON must have a 'data' key with an array value.");
      }

      const response = await fetch("https://bajaj-backend-farz.onrender.com/bfhl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonInput,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${errorText}`);
      }

      const data = await response.json();
      setResponseData(data);
      setError("");
      setSelectedOptions([]);
    } catch (err) {
      setError(err.message);
      setResponseData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionToggle = (option) => {
    setSelectedOptions(prev => 
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  useEffect(() => {
    if (!responseData) return;

    const filtered = {};
    if (selectedOptions.includes("Alphabets")) {
      filtered.alphabets = responseData.alphabets;
    }
    if (selectedOptions.includes("Numbers")) {
      filtered.numbers = responseData.numbers;
    }
    if (selectedOptions.includes("HighestAlphabet")) {
      filtered.highest_alphabet = responseData.highest_alphabet;
    }

    setFilteredResponse(filtered);
  }, [selectedOptions, responseData]);

  const filterOptions = ["Numbers", "Alphabets", "HighestAlphabet"];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Input Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '2rem',
          padding: '1.5rem'
        }}>
          <h1 style={{
            color: '#2563eb',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem'
          }}>
            BFHL Data Processor
          </h1>
          
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              JSON Input
            </label>
            <textarea
              value={jsonInput}
              onChange={handleInputChange}
              placeholder='Enter JSON, e.g. { "data": ["A","C","z"] }'
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '6px',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
          >
            {isLoading ? "Processing..." : "Process Data"}
          </button>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              borderLeft: '4px solid #ef4444',
              padding: '1rem',
              marginTop: '1rem',
              borderRadius: '4px',
              color: '#b91c1c'
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Results Card */}
        {responseData && !error && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Filter Results
            </h2>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionToggle(option)}
                  style={{
                    backgroundColor: selectedOptions.includes(option) ? '#bfdbfe' : '#f3f4f6',
                    color: selectedOptions.includes(option) ? '#1e40af' : '#374151',
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {option}
                  {selectedOptions.includes(option) && (
                    <span style={{ fontSize: '1rem' }}>×</span>
                  )}
                </button>
              ))}
            </div>

            {Object.keys(filteredResponse).length > 0 && (
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '1rem',
                borderRadius: '6px'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '500',
                  color: '#1f2937',
                  marginBottom: '0.75rem'
                }}>
                  Filtered Response
                </h3>
                
                {filteredResponse.numbers && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '500' }}>Numbers: </span>
                    {filteredResponse.numbers.join(", ")}
                  </div>
                )}
                
                {filteredResponse.alphabets && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '500' }}>Alphabets: </span>
                    {filteredResponse.alphabets.join(", ")}
                  </div>
                )}
                
                {filteredResponse.highest_alphabet && (
                  <div>
                    <span style={{ fontWeight: '500' }}>Highest Alphabet: </span>
                    {filteredResponse.highest_alphabet}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;