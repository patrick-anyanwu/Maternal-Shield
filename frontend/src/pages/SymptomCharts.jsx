
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// Define consistent colors for symptoms
const SYMPTOM_COLORS = {
  'Headache': '#e83e8c',
  'Fatigue': '#6f42c1',
  'Swelling': '#fd7e14',
  'Breathing Issues': '#007bff',
  'Nausea': '#28a745',
  'Dizziness': '#6c757d'
};

// Utility function to prepare data for charts
const prepareDataForVisualization = (history) => {
  if (!history || Object.keys(history).length === 0) {
    return { lineChartData: [], symptomsOverTime: [], envCorrelation: { temperature: [], pm25: [] } };
  }
  
  // Get array of sorted dates
  const dates = Object.keys(history).sort();
  
  // Initialize the chart data for line chart
  const lineChartData = dates.map(date => {
    // Format the date for display
    const displayDate = new Date(date).toLocaleDateString('en-AU', {
      month: 'short',
      day: 'numeric'
    });
    
    // Start with the date for the data point
    const dataPoint = {
      date: displayDate,
      rawDate: date // Keep the original date format for sorting
    };
    
    // Add all symptom severities
    history[date].symptoms.forEach(symptom => {
      dataPoint[symptom.name] = symptom.severity;
    });
    
    // Add environmental data
    const envData = history[date].environmentalData;
    dataPoint.temperature = envData.temperature;
    dataPoint.pm25 = envData.pm25;
    dataPoint.aqi = envData.aqi;
    
    return dataPoint;
  });
  
  // Calculate environmental correlations
  const envRanges = {
    temperature: { low: [], medium: [], high: [] },
    pm25: { low: [], medium: [], high: [] }
  };
  
  // Group days by environmental factors
  Object.values(history).forEach(day => {
    // Categorize temperature
    if (day.environmentalData.temperature < 30) {
      envRanges.temperature.low.push(day);
    } else if (day.environmentalData.temperature < 35) {
      envRanges.temperature.medium.push(day);
    } else {
      envRanges.temperature.high.push(day);
    }
    
    // Categorize PM2.5
    if (day.environmentalData.pm25 < 10) {
      envRanges.pm25.low.push(day);
    } else if (day.environmentalData.pm25 < 20) {
      envRanges.pm25.medium.push(day);
    } else {
      envRanges.pm25.high.push(day);
    }
  });
  
  // Calculate average symptom severity for each environmental category
  const calculateAverages = (categoryData) => {
    const result = {};
    
    // Get all symptoms from the first entry
    const firstDay = Object.values(history)[0];
    const symptomNames = firstDay.symptoms.map(s => s.name);
    
    symptomNames.forEach(name => {
      // Get all severities for this symptom across all days in the category
      const severities = categoryData.map(day => {
        const symptom = day.symptoms.find(s => s.name === name);
        return symptom ? symptom.severity : 0;
      }).filter(severity => severity > 0); // Only count days where symptom was present
      
      // Calculate average if we have data
      if (severities.length > 0) {
        const sum = severities.reduce((a, b) => a + b, 0);
        result[name] = parseFloat((sum / severities.length).toFixed(1));
      } else {
        result[name] = 0;
      }
    });
    
    return result;
  };
  
  // Calculate averages for each category
  const tempCorrelation = {
    low: calculateAverages(envRanges.temperature.low),
    medium: calculateAverages(envRanges.temperature.medium),
    high: calculateAverages(envRanges.temperature.high)
  };
  
  const pm25Correlation = {
    low: calculateAverages(envRanges.pm25.low),
    medium: calculateAverages(envRanges.pm25.medium),
    high: calculateAverages(envRanges.pm25.high)
  };
  
  // Format for chart - create a grouped bar chart
  const formatForChart = (correlation, factorName) => {
    const chartData = [];
    
    // Get all symptom names with at least one non-zero severity
    const symptoms = Object.keys(correlation.low || correlation.medium || correlation.high || {})
      .filter(name => {
        return (correlation.low && correlation.low[name] > 0) || 
               (correlation.medium && correlation.medium[name] > 0) || 
               (correlation.high && correlation.high[name] > 0);
      });
    
    symptoms.forEach(symptom => {
      chartData.push({
        symptom: symptom,
        lowDays: correlation.low ? correlation.low[symptom] || 0 : 0,
        mediumDays: correlation.medium ? correlation.medium[symptom] || 0 : 0,
        highDays: correlation.high ? correlation.high[symptom] || 0 : 0,
        factor: factorName
      });
    });
    
    return chartData;
  };
  
  const envCorrelation = {
    temperature: formatForChart(tempCorrelation, 'Temperature'),
    pm25: formatForChart(pm25Correlation, 'PM2.5')
  };
  
  return { lineChartData, envCorrelation };
};

const SymptomCharts = ({ symptomHistory, activeVisualTab }) => {
  const [chartData, setChartData] = useState({
    lineChartData: [],
    envCorrelation: { temperature: [], pm25: [] }
  });
  const [activeSymptoms, setActiveSymptoms] = useState([]);
  const [showAllSymptoms, setShowAllSymptoms] = useState(true);
  
  useEffect(() => {
    if (symptomHistory && Object.keys(symptomHistory).length > 0) {
      const processedData = prepareDataForVisualization(symptomHistory);
      setChartData(processedData);
      
      // Get unique symptom names with values
      const symptoms = new Set();
      processedData.lineChartData.forEach(day => {
        Object.keys(day).forEach(key => {
          if (key !== 'date' && key !== 'rawDate' && 
              key !== 'temperature' && key !== 'pm25' && key !== 'aqi' &&
              day[key] > 0) {
            symptoms.add(key);
          }
        });
      });
      setActiveSymptoms(Array.from(symptoms));
    }
  }, [symptomHistory]);
  
  const toggleSymptom = (symptom) => {
    if (activeSymptoms.includes(symptom)) {
      setActiveSymptoms(activeSymptoms.filter(s => s !== symptom));
      setShowAllSymptoms(false);
    } else {
      setActiveSymptoms([...activeSymptoms, symptom]);
      // Check if now all symptoms are selected
      const allSymptomsFromData = new Set();
      chartData.lineChartData.forEach(day => {
        Object.keys(day).forEach(key => {
          if (key !== 'date' && key !== 'rawDate' && 
              key !== 'temperature' && key !== 'pm25' && key !== 'aqi') {
            allSymptomsFromData.add(key);
          }
        });
      });
      if (activeSymptoms.length + 1 === allSymptomsFromData.size) {
        setShowAllSymptoms(true);
      }
    }
  };
  
  const toggleAllSymptoms = () => {
    if (showAllSymptoms) {
      setActiveSymptoms([]);
      setShowAllSymptoms(false);
    } else {
      // Select all symptoms
      const allSymptomsFromData = new Set();
      chartData.lineChartData.forEach(day => {
        Object.keys(day).forEach(key => {
          if (key !== 'date' && key !== 'rawDate' && 
              key !== 'temperature' && key !== 'pm25' && key !== 'aqi') {
            allSymptomsFromData.add(key);
          }
        });
      });
      setActiveSymptoms(Array.from(allSymptomsFromData));
      setShowAllSymptoms(true);
    }
  };
  
  const getSymptomColor = (symptom) => {
    return SYMPTOM_COLORS[symptom] || '#000000';
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="date">{label}</p>
          <div className="tooltip-items">
            {payload.map((entry, index) => {
              if (entry.value > 0 && entry.name !== 'temperature' && entry.name !== 'pm25' && entry.name !== 'aqi') {
                return (
                  <p key={index} style={{ color: entry.color }}>
                    {entry.name}: {entry.value}/5
                  </p>
                );
              }
              return null;
            })}
          </div>
        </div>
      );
    }
    return null;
  };
  
  const renderLineChart = () => {
    if (chartData.lineChartData.length === 0) {
      return <div className="empty-chart">No symptom data available</div>;
    }
    
    return (
      <div className="chart-container">
        <h3>Symptom Severity Over Time</h3>
        <div className="symptom-filter">
          <div className="filter-item all">
            <label>
              <input 
                type="checkbox" 
                checked={showAllSymptoms} 
                onChange={toggleAllSymptoms}
              />
              All Symptoms
            </label>
          </div>
          {Object.keys(SYMPTOM_COLORS).map(symptom => (
            <div key={symptom} className="filter-item">
              <label style={{ color: getSymptomColor(symptom) }}>
                <input 
                  type="checkbox" 
                  checked={activeSymptoms.includes(symptom)} 
                  onChange={() => toggleSymptom(symptom)}
                />
                {symptom}
              </label>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {activeSymptoms.map(symptom => (
              <Line 
                key={symptom}
                type="monotone"
                dataKey={symptom}
                name={symptom}
                stroke={getSymptomColor(symptom)}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  const renderTemperatureCorrelationChart = () => {
    if (chartData.envCorrelation.temperature.length === 0) {
      return null;
    }
    
    return (
      <div className="chart-container">
        <h3>Symptom Correlation with Temperature</h3>
        <p className="chart-description">
          This chart shows the average severity of each symptom during days with different temperature ranges.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData.envCorrelation.temperature}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 5]} />
            <YAxis type="category" dataKey="symptom" width={120} />
            <Tooltip 
              formatter={(value, name, props) => {
                if (value === 0) return ['Not reported', name];
                return [`${value.toFixed(1)}/5`, name];
              }}
              labelFormatter={(value) => `${value} average severity`}
            />
            <Legend 
              payload={[
                { value: 'Under 30°C', type: 'square', color: '#8884d8' },
                { value: '30-35°C', type: 'square', color: '#82ca9d' },
                { value: 'Over 35°C', type: 'square', color: '#ff7300' }
              ]}
            />
            <Bar dataKey="lowDays" name="Under 30°C" fill="#8884d8" />
            <Bar dataKey="mediumDays" name="30-35°C" fill="#82ca9d" />
            <Bar dataKey="highDays" name="Over 35°C" fill="#ff7300" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  const renderPM25CorrelationChart = () => {
    if (chartData.envCorrelation.pm25.length === 0) {
      return null;
    }
    
    return (
      <div className="chart-container">
        <h3>Symptom Correlation with PM2.5</h3>
        <p className="chart-description">
          This chart shows the average severity of each symptom during days with different PM2.5 levels.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData.envCorrelation.pm25}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 5]} />
            <YAxis type="category" dataKey="symptom" width={120} />
            <Tooltip 
              formatter={(value, name, props) => {
                if (value === 0) return ['Not reported', name];
                return [`${value.toFixed(1)}/5`, name];
              }}
              labelFormatter={(value) => `${value} average severity`}
            />
            <Legend 
              payload={[
                { value: 'Under 10', type: 'square', color: '#8dd1e1' },
                { value: '10-20', type: 'square', color: '#a4de6c' },
                { value: 'Over 20', type: 'square', color: '#ff8042' }
              ]}
            />
            <Bar dataKey="lowDays" name="Under 10" fill="#8dd1e1" />
            <Bar dataKey="mediumDays" name="10-20" fill="#a4de6c" />
            <Bar dataKey="highDays" name="Over 20" fill="#ff8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  const renderRadarChart = () => {
    if (chartData.lineChartData.length === 0 || activeSymptoms.length <= 1) {
      return null;
    }
    
    // Prepare data for radar chart - get max severity for each symptom
    const radarData = activeSymptoms.map(symptomName => {
      const maxSeverity = Math.max(
        ...chartData.lineChartData
          .map(day => day[symptomName] || 0)
      );
      
      const avgSeverity = chartData.lineChartData
        .filter(day => day[symptomName] > 0)
        .reduce((sum, day) => sum + day[symptomName], 0) / 
        chartData.lineChartData.filter(day => day[symptomName] > 0).length || 0;
      
      return {
        symptom: symptomName,
        maxSeverity: maxSeverity,
        avgSeverity: parseFloat(avgSeverity.toFixed(1))
      };
    }).filter(item => item.maxSeverity > 0);
    
    if (radarData.length <= 1) {
      return null; // Radar chart needs at least 2 data points
    }
    
    return (
      <div className="chart-container">
        <h3>Symptom Pattern Profile</h3>
        <p className="chart-description">
          This radar chart shows your symptom pattern profile - the maximum and average severity of each symptom.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="symptom" />
            <PolarRadiusAxis angle={90} domain={[0, 5]} />
            <Radar
              name="Maximum Severity"
              dataKey="maxSeverity"
              stroke="#e83e8c"
              fill="#e83e8c"
              fillOpacity={0.5}
            />
            <Radar
              name="Average Severity"
              dataKey="avgSeverity"
              stroke="#6f42c1"
              fill="#6f42c1"
              fillOpacity={0.5}
            />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  if (activeVisualTab === 'overview') {
    return (
      <div className="symptom-charts">
        {renderLineChart()}
        {renderRadarChart()}
      </div>
    );
  } else if (activeVisualTab === 'temperature') {
    return (
      <div className="symptom-charts">
        {renderTemperatureCorrelationChart()}
      </div>
    );
  } else if (activeVisualTab === 'pm25') {
    return (
      <div className="symptom-charts">
        {renderPM25CorrelationChart()}
      </div>
    );
  }
  
  // Default fallback
  return (
    <div className="symptom-charts">
      {renderLineChart()}
    </div>
  );
};

export default SymptomCharts;