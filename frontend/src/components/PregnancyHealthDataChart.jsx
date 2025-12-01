import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, 
  AreaChart
} from 'recharts';
import { X } from 'lucide-react';
import Papa from 'papaparse';

const PregnancyHealthDataChart = ({ isOpen, onClose }) => {
  const [diabetesData, setDiabetesData] = useState([]);
  const [hypertensionData, setHypertensionData] = useState([]);
  const [yearlyAverages, setYearlyAverages] = useState([]);
  const [selectedState, setSelectedState] = useState('Total');
  const [stateList, setStateList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trends');
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load diabetes data
        const diabetesResponse = await fetch('/gestational_diabetes_corrected.csv').then(response => response.text());
        const parsedDiabetes = Papa.parse(diabetesResponse, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });
        
        // Load hypertension data
        const hypertensionResponse = await fetch('/gestational_hypertension_processed.csv').then(response => response.text());
        const parsedHypertension = Papa.parse(hypertensionResponse, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });

        setDiabetesData(parsedDiabetes.data);
        setHypertensionData(parsedHypertension.data);
        
        // Extract unique states and set default
        const states = [...new Set(parsedDiabetes.data.map(row => row["State/Territory"]))];
        setStateList(states);
        
        // Compute yearly averages for both conditions
        computeYearlyAverages(parsedDiabetes.data, parsedHypertension.data);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);
  
  const computeYearlyAverages = (diabetesData, hypertensionData) => {
    const years = [...new Set(diabetesData.map(row => row.Year))].sort();
    
    const averagesByYear = years.map(year => {
      const diabetesRows = diabetesData.filter(row => row.Year === year);
      const hypertensionRows = hypertensionData.filter(row => row.Year === year);
      
      const diabetesAvg = diabetesRows.reduce((sum, row) => sum + (row.Percent || 0), 0) / diabetesRows.length;
      const hypertensionAvg = hypertensionRows.reduce((sum, row) => sum + (row.Percent || 0), 0) / hypertensionRows.length;
      
      return {
        year,
        diabetesPercent: parseFloat(diabetesAvg.toFixed(2)),
        hypertensionPercent: parseFloat(hypertensionAvg.toFixed(2))
      };
    });
    
    setYearlyAverages(averagesByYear);
  };
  
  const getStateData = () => {
    const stateData = [];
    const years = [...new Set(diabetesData.map(row => row.Year))].sort();
    
    years.forEach(year => {
      const diabetesRow = diabetesData.find(row => 
        row.Year === year && row["State/Territory"] === selectedState);
      
      const hypertensionRow = hypertensionData.find(row => 
        row.Year === year && row["State/Territory"] === selectedState);
      
      if (diabetesRow || hypertensionRow) {
        stateData.push({
          year,
          diabetesPercent: diabetesRow ? diabetesRow.Percent : null,
          hypertensionPercent: hypertensionRow ? hypertensionRow.Percent : null
        });
      }
    });
    
    return stateData;
  };
  
  const getStateRankingsData = () => {
    // Get the most recent year
    const years = [...new Set(diabetesData.map(row => row.Year))].sort();
    const latestYear = years[years.length - 1];
    
    // Filter out the "Total" from rankings
    const states = stateList.filter(state => state !== 'Total');
    
    return states.map(state => {
      const diabetesRow = diabetesData.find(row => 
        row.Year === latestYear && row["State/Territory"] === state);
      
      const hypertensionRow = hypertensionData.find(row => 
        row.Year === latestYear && row["State/Territory"] === state);
        
      return {
        state,
        diabetesPercent: diabetesRow ? diabetesRow.Percent : 0,
        hypertensionPercent: hypertensionRow ? hypertensionRow.Percent : 0
      };
    }).sort((a, b) => b.diabetesPercent - a.diabetesPercent);
  };
  
  const getComparativeChanges = () => {
    // Get first and last years
    const years = [...new Set(diabetesData.map(row => row.Year))].sort();
    const firstYear = years[0];
    const lastYear = years[years.length - 1];
    
    // Filter out the "Total" for state comparisons
    const states = stateList.filter(state => state !== 'Total');
    
    return states.map(state => {
      const firstDiabetes = diabetesData.find(row => 
        row.Year === firstYear && row["State/Territory"] === state);
        
      const lastDiabetes = diabetesData.find(row => 
        row.Year === lastYear && row["State/Territory"] === state);
        
      const diabetesChange = lastDiabetes && firstDiabetes ? 
        ((lastDiabetes.Percent - firstDiabetes.Percent) / firstDiabetes.Percent * 100).toFixed(1) : 0;
        
      return {
        state,
        firstValue: firstDiabetes ? firstDiabetes.Percent : 0,
        lastValue: lastDiabetes ? lastDiabetes.Percent : 0,
        percentChange: parseFloat(diabetesChange)
      };
    }).sort((a, b) => b.percentChange - a.percentChange);
  };
  
  if (!isOpen) return null;

  // Custom Tooltip Component for the combined chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded">
          <p className="font-bold">{`Year: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pregnancy-health-modal">
      <div className="pregnancy-health-modal-overlay" onClick={onClose}></div>
      <div className="pregnancy-health-modal-content">
        <div className="pregnancy-health-modal-header">
          <h2>Pregnancy Health Conditions in Australia (2014-2022)</h2>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="pregnancy-health-modal-body">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner">Loading data...</div>
            </div>
            
          ) : (
            
            <>
              <div className="chart-intro">
  <h4>Understanding the Impact of Environmental Factors</h4>
  <p>
    This data visualization explores the relationship between pregnancy complications and 
    environmental factors across Australia from 2014-2022.
  </p>
</div>

              <div className="chart-tabs">
                <button 
                  className={`chart-tab ${activeTab === 'trends' ? 'active' : ''}`}
                  onClick={() => setActiveTab('trends')}
                >
                  National Trends
                </button>
                <button 
                  className={`chart-tab ${activeTab === 'state' ? 'active' : ''}`}
                  onClick={() => setActiveTab('state')}
                >
                  State/Territory Data
                </button>
                <button 
                  className={`chart-tab ${activeTab === 'rankings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('rankings')}
                >
                  Rankings
                </button>
                <button 
                  className={`chart-tab ${activeTab === 'changes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('changes')}
                >
                  Percentage Changes
                </button>
              </div>
              
              {/* National Trends Tab */}
              {activeTab === 'trends' && (
                <div className="chart-section">
                  <div className="chart-container">
                    <h3>National Trends in Gestational Diabetes and Hypertension</h3>
                    <div className="chart-description">
                      <p>
                        This chart shows the national averages for gestational diabetes and hypertension from 2014 to 2022.
                        <strong> Note the dramatic increase in diabetes rates</strong> compared to the relatively stable hypertension rates.
                      </p>
                    </div>
                    <div className="chart-wrapper">
                      <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={yearlyAverages}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="diabetesPercent" 
                            name="Gestational Diabetes" 
                            fill="#8884d8" 
                            stroke="#8884d8"
                            fillOpacity={0.3}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="hypertensionPercent" 
                            name="Gestational Hypertension" 
                            stroke="#82ca9d" 
                            strokeWidth={2}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="chart-insight">
                      <h4>Key Observation:</h4>
                      <p>Gestational diabetes rates have more than doubled (98.8% increase) from 2014 to 2022, 
                      while hypertension rates remained relatively stable. This significant increase might be 
                      correlated with climate factors including heat and air quality affected by bushfires.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* State/Territory Data Tab */}
              {activeTab === 'state' && (
                <div className="chart-section">
                  <div className="chart-container">
                    <div className="state-selector">
                      <label>Select State/Territory:</label>
                      <select 
                        value={selectedState} 
                        onChange={(e) => setSelectedState(e.target.value)}
                      >
                        {stateList.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    
                    <h3>Health Conditions in {selectedState}</h3>
                    <div className="chart-wrapper">
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={getStateData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="diabetesPercent" 
                            name="Gestational Diabetes" 
                            stroke="#8884d8" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="hypertensionPercent" 
                            name="Gestational Hypertension" 
                            stroke="#82ca9d" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Rankings Tab */}
              {activeTab === 'rankings' && (
                <div className="chart-section">
                  <div className="chart-container">
                    <h3>State/Territory Rankings (2022)</h3>
                    <div className="chart-description">
                      <p>
                        This chart shows the latest (2022) rates of gestational diabetes and hypertension across all states and territories,
                        sorted by diabetes rates from highest to lowest.
                      </p>
                    </div>
                    <div className="chart-wrapper">
                      <ResponsiveContainer width="100%" height={500}>
                        <BarChart 
                          data={getStateRankingsData()} 
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" unit="%" />
                          <YAxis type="category" dataKey="state" width={60} />
                          <Tooltip />
                          <Legend />
                          <Bar 
                            dataKey="diabetesPercent" 
                            name="Gestational Diabetes" 
                            fill="#8884d8" 
                          />
                          <Bar 
                            dataKey="hypertensionPercent" 
                            name="Gestational Hypertension" 
                            fill="#82ca9d" 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="chart-insight">
                      <h4>Key Observation:</h4>
                      <p>The Northern Territory and ACT show the highest rates of gestational diabetes (over 25%),
                        while the rates of hypertension show different patterns with SA and ACT having the highest rates.
                        This could suggest that different environmental factors affect these conditions differently.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Percentage Changes Tab */}
              {activeTab === 'changes' && (
                <div className="chart-section">
                  <div className="chart-container">
                    <h3>Percentage Increase in Gestational Diabetes (2014-2022)</h3>
                    <div className="chart-description">
                      <p>
                        This chart shows the percentage increase in gestational diabetes rates from 2014 to 2022 for each state/territory.
                      </p>
                    </div>
                    <div className="chart-wrapper">
                      <ResponsiveContainer width="100%" height={500}>
                        <BarChart 
                          data={getComparativeChanges()} 
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" unit="%" />
                          <YAxis type="category" dataKey="state" width={60} />
                          <Tooltip formatter={(value) => [`${value}%`, 'Increase']} />
                          <Bar 
                            dataKey="percentChange" 
                            name="% Increase in Gestational Diabetes" 
                            fill="#ff7675" 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="chart-insight">
                      <h4>Key Observation:</h4>
                      <p>ACT shows the highest percentage increase in gestational diabetes (145%), followed by NSW (116%) and Tasmania (108.6%).
                        This geographical pattern could be analyzed alongside bushfire impact data to identify potential correlations.</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="charts-conclusion">
                <h3>Insights for Further Investigation:</h3>
                <ol>
                  <li>The dramatic increase in gestational diabetes across all Australian states (national average doubled from 8.3% to 16.5%) warrants investigation into potential environmental factors, including heat stress and air quality from bushfires.</li>
                  <li>Different states show varying rates of increase, which could be correlated with regional bushfire exposure data.</li>
                  <li>The relatively stable gestational hypertension rates suggest that different pregnancy conditions may be affected differently by environmental factors.</li>
                  <li>Northern Territory and ACT consistently show the highest rates of gestational diabetes, which could be examined alongside climate and air quality data for these regions.</li>
                </ol>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PregnancyHealthDataChart;