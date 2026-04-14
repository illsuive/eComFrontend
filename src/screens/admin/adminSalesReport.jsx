import '../../cssFolder/screens/admin/adminSalesReport.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
// Added ResponsiveContainer for better layout control
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminSalesReportPage = () => {
    const [salesData, setSalesData] = useState({
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        totalSales: 0,
        formattingSales: []
    });
    const [loading, setLoading] = useState(true);

    const fetchSalesData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_URL}/orders/sales-report`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.data.success) {
                setSalesData({
                    totalOrders: res.data.totalOrders,
                    totalUsers: res.data.totalUsers,
                    totalProducts: res.data.totalProducts,
                    totalSales: res.data.totalSales,
                    formattingSales: res.data.formattingSales
                });
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalesData();
    }, []);

    if (loading) return <div className="loader">Analyzing financial records...</div>;

    return (
        <div className="admin-sales-wrapper">
            <header className="sales-header">
                <h1>Executive Sales Report</h1>
                <p>Metrics calculated over the last 30 days</p>
            </header>

            {/* 1. Top Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Sales</h3>
                    <p className="stat-value">${salesData.totalSales.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Orders</h3>
                    <p className="stat-value">{salesData.totalOrders}</p>
                </div>
                <div className="stat-card">
                    <h3>Registered Users</h3>
                    <p className="stat-value">{salesData.totalUsers}</p>
                </div>
                <div className="stat-card">
                    <h3>Active Products</h3>
                    <p className="stat-value">{salesData.totalProducts}</p>
                </div>
            </div>

            {/* 2. Visual Chart Section */}
            <section className="sales-chart-section">
                <h2>Revenue Trends</h2>
                <div className="chart-container" style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart
                            data={salesData.formattingSales}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                                dataKey="date" 
                                fontSize={12} 
                                tickMargin={10}
                            />
                            <YAxis fontSize={12} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Legend />
                            <Bar 
                                name="Revenue ($)" 
                                dataKey="total" 
                                fill="#4f46e5" // A professional indigo color
                                radius={[4, 4, 0, 0]} 
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* 3. Daily Sales Breakdown Table */}
            <section className="sales-breakdown">
                <h2>Daily Revenue Details</h2>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesData.formattingSales.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.date}</td>
                                    <td>${item.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default AdminSalesReportPage;