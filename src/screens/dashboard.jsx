import { Outlet, NavLink } from 'react-router-dom'
import '../cssFolder/screens/dashboard.css'

const DashboardPage = () => {
    const adminRoutes = {
        addProducts: { path: "/admin/dashboard/add-products", icon: "➕" },
        products: { path: "/admin/dashboard/products", icon: "📦" },
        users: { path: "/admin/dashboard/users", icon: "👥" },
        orders: { path: "/admin/dashboard/orders", icon: "🛒" },
        Report : { path: "/admin/dashboard/report", icon: "📊" },
    }
    return (
        <div className="dashboard-wrapper">
           
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-logo">
                    <h2>⚙️ Admin Panel</h2>
                </div>

                <nav className="sidebar-nav">
                    {
                        Object.values(adminRoutes).map((route, index) => (
                            <NavLink to={route.path} key={index} end>
                                {route.icon} {Object.keys(adminRoutes)[index]}
                            </NavLink>
                        ))  
                    }
                </nav>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                
                <Outlet />  {/* ✅ child pages render here */}
            </main>
                       
        </div>
    )
}

export default DashboardPage