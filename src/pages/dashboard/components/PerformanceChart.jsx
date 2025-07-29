import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const PerformanceChart = () => {
  const monthlyData = [
    { month: 'Jan', leads: 45, conversions: 12, revenue: 125000 },
    { month: 'Feb', leads: 52, conversions: 15, revenue: 145000 },
    { month: 'Mar', leads: 38, conversions: 10, revenue: 98000 },
    { month: 'Apr', leads: 61, conversions: 18, revenue: 178000 },
    { month: 'May', leads: 55, conversions: 16, revenue: 162000 },
    { month: 'Jun', leads: 67, conversions: 22, revenue: 215000 },
    { month: 'Jul', leads: 73, conversions: 25, revenue: 245000 }
  ];

  const conversionData = [
    { month: 'Jan', rate: 26.7 },
    { month: 'Feb', rate: 28.8 },
    { month: 'Mar', rate: 26.3 },
    { month: 'Apr', rate: 29.5 },
    { month: 'May', rate: 29.1 },
    { month: 'Jun', rate: 32.8 },
    { month: 'Jul', rate: 34.2 }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground">Performance Overview</h3>
        <p className="text-sm text-muted-foreground mt-1">Monthly leads, conversions, and revenue trends</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leads & Revenue Chart */}
          <div>
            <h4 className="text-sm font-medium text-card-foreground mb-4">Leads & Revenue</h4>
            <div className="w-full h-64" aria-label="Monthly Leads and Revenue Bar Chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="var(--color-text-secondary)"
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="var(--color-text-secondary)"
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="var(--color-text-secondary)"
                    fontSize={12}
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--color-popover)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'leads' ? 'Leads' : 'Revenue'
                    ]}
                  />
                  <Bar 
                    yAxisId="left"
                    dataKey="leads" 
                    fill="var(--color-primary)" 
                    radius={[4, 4, 0, 0]}
                    name="leads"
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="revenue" 
                    fill="var(--color-accent)" 
                    radius={[4, 4, 0, 0]}
                    name="revenue"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Conversion Rate Chart */}
          <div>
            <h4 className="text-sm font-medium text-card-foreground mb-4">Conversion Rate Trend</h4>
            <div className="w-full h-64" aria-label="Monthly Conversion Rate Line Chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="var(--color-text-secondary)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="var(--color-text-secondary)"
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--color-popover)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value) => [`${value}%`, 'Conversion Rate']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="var(--color-success)" 
                    strokeWidth={3}
                    dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'var(--color-success)', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;