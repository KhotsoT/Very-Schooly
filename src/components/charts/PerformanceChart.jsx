import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PerformanceChart = ({ data, title }) => {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm min-w-[300px]">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 truncate">{title}</h2>
            <div className="h-[300px] sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="average" stroke="#8884d8" name="Class Average" />
                        <Line type="monotone" dataKey="student" stroke="#82ca9d" name="Student Score" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PerformanceChart; 