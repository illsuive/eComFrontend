import { Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/header.jsx'
import Footer from './components/footer.jsx'
import HomePage from './screens/home.jsx'
import LoginPage from './screens/login.jsx'
import SignupPage from './screens/signup.jsx'
import VerifyPage from './screens/verify.jsx'
import VerifyEmail from './screens/verifyEmail.jsx'
import Profile from './screens/profile.jsx'
import ProductsPage from './screens/products.jsx'
import CartPage from './screens/cart.jsx'
import DashboardPage from './screens/dashboard.jsx'
import ProctedRoutes from './components/ProtectedRoute.jsx'
import ProductDetailsPage from './screens/productDetails.jsx'
import AddressFormPage from './screens/addressForm.jsx'
import OrderSuccessPage from './screens/orderSucces.jsx'
import ForgotPasswordPage from './screens/forgotPassword.jsx';
import VerifyOtpPage from './screens/verifyOtp.jsx';


// admin routes 

import AdminAddProductsPage from './screens/admin/adminAddProducts.jsx'
import AdminProductsPage from './screens/admin/adminProducts.jsx'
import AdminUsersPage from './screens/admin/adminUsers.jsx'
import AdminOrdersPage from './screens/admin/adminOrders.jsx'
import AdminUserInfoPage from './screens/admin/adminUserInfo.jsx'
import AdminOrderDataPage from './screens/admin/adminOrderData.jsx'
import AdminSalesReportPage from './screens/admin/adminSalesReport.jsx'

function App() {

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />
        <Route path="/profile/:id" element={<ProctedRoutes><Profile /></ProctedRoutes>} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
         <Route path="/address" element={<ProctedRoutes><AddressFormPage /></ProctedRoutes>} />
         <Route path="/success" element={<ProctedRoutes><OrderSuccessPage /></ProctedRoutes>} />
         <Route path="/forgot-password" element={<ForgotPasswordPage />} />
         <Route path="/verify-otp/:email" element={<VerifyOtpPage />} />


        {/* admin routes  */}

        <Route path="/admin/dashboard" element={
          <ProctedRoutes adminOnly={true}>
            <DashboardPage />
          </ProctedRoutes>}>
          <Route path="add-products" element={<AdminAddProductsPage />} />  {/* /admin/add-products */}
          <Route path="products" element={<AdminProductsPage />} />  {/* /admin/products */}
          <Route path="users" element={<AdminUsersPage />} />  {/* /admin/users */}
          <Route path="orders" element={<AdminOrdersPage />} />  {/* /admin/orders */}
          <Route path="users/:id" element={<AdminUserInfoPage />} />  {/* /admin/users/:id */}
          <Route path="orders/:id" element={<AdminOrderDataPage />} />  {/* /admin/order-data */}
          <Route path="report" element={<AdminSalesReportPage />} />  {/* /admin/report */}
        </Route>
      </Routes>
      <Footer />
    </div>
  )
}

export default App
