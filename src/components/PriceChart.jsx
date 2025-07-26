import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PriceChart = () => {
  const data = [
    { day: 'Mon', price: 45 },
    { day: 'Tue', price: 48 },
    { day: 'Wed', price: 42 },
    { day: 'Thu', price: 50 },
    { day: 'Fri', price: 47 },
    { day: 'Sat', price: 52 },
    { day: 'Sun', price: 49 },
  ];

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip formatter={(value) => [`₹${value}`, 'Price']} />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#059669" 
            strokeWidth={2}
            dot={{ fill: '#059669' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
