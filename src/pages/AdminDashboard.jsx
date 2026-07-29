import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import {
  LayoutDashboard, ShoppingBag, FolderOpen, Ticket, ShieldAlert,
  ArrowUpRight, Users, PlusCircle, Trash2, Edit, CheckCircle, RefreshCw,
  Package, CreditCard, Mail, Calendar,
  TrendingUp, TrendingDown, MoreVertical, Eye, Settings, LogOut,
  IndianRupee, X, Loader, BarChart3, PieChart, LineChart,
  Activity, DollarSign, ShoppingCart, User, Clock, Award, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Route protection
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // View control
  const [activeTab, setActiveTab] = useState('analytics');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Data states
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Forms states
  const [productForm, setProductForm] = useState({
    name: '', category: '', brand: '', description: '',
    images: [], stock: 100, originalPrice: 0, discount: 0, gst: 18
  });
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', image: '' });
  const [couponForm, setCouponForm] = useState({ code: '', discountPercentage: 10, maxDiscount: 200, expiryDate: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);

  // Flags
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all data initially and on tab change
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user, activeTab]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'analytics') {
        const [statsRes, productsRes, ordersRes] = await Promise.all([
          axios.get('/admin/dashboard-stats'),
          axios.get('/products?limit=100'),
          axios.get('/orders')
        ]);
        if (statsRes.data.success) setStats(statsRes.data.stats);
        if (productsRes.data.success) setProducts(productsRes.data.products);
        if (ordersRes.data.success) setOrders(ordersRes.data.orders);
      } else if (activeTab === 'products') {
        const [catRes, prodRes] = await Promise.all([
          axios.get('/categories'),
          axios.get('/products?limit=100')
        ]);
        if (catRes.data.success) setCategories(catRes.data.categories);
        if (prodRes.data.success) setProducts(prodRes.data.products);
      } else if (activeTab === 'orders') {
        const res = await axios.get('/orders');
        if (res.data.success) setOrders(res.data.orders);
      } else if (activeTab === 'categories') {
        const res = await axios.get('/categories');
        if (res.data.success) setCategories(res.data.categories);
      } else if (activeTab === 'coupons') {
        const res = await axios.get('/coupons');
        if (res.data.success) setCoupons(res.data.coupons);
      }
    } catch (err) {
      console.error('Error fetching admin details:', err);
      addToast('Error loading dashboard assets', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchAdminData();
    addToast('Data refreshed successfully!', 'success');
  };

  // PRODUCT CRUD ACTIONS
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.category || !productForm.originalPrice) {
      return addToast('Please enter required details', 'warning');
    }
    setSubmitting(true);
    try {
      const imgArray = productForm.images && productForm.images.length > 0 
        ? productForm.images 
        : ['/uploads/default-product.png'];
      
      const productData = { ...productForm, images: imgArray };
      
      let res;
      if (editingProduct) {
        res = await axios.put(`/products/${editingProduct._id}`, productData);
        if (res.data.success) {
          addToast('Product updated successfully!', 'success');
          setProducts(products.map(p => p._id === editingProduct._id ? res.data.product : p));
          setEditingProduct(null);
          if (activeTab === 'analytics') {
            const statsRes = await axios.get('/admin/dashboard-stats');
            if (statsRes.data.success) setStats(statsRes.data.stats);
          }
        }
      } else {
        res = await axios.post('/products', productData);
        if (res.data.success) {
          addToast('Product added successfully!', 'success');
          setProducts([res.data.product, ...products]);
          if (activeTab === 'analytics') {
            const statsRes = await axios.get('/admin/dashboard-stats');
            if (statsRes.data.success) setStats(statsRes.data.stats);
          }
        }
      }
      
      setShowProductForm(false);
      setProductForm({
        name: '', category: '', brand: '', description: '',
        images: [], stock: 100, originalPrice: 0, discount: 0, gst: 18
      });
    } catch (err) {
      addToast(editingProduct ? 'Failed to update product' : 'Failed to create product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      const res = await axios.delete(`/products/${id}`);
      if (res.data.success) {
        addToast('Product removed successfully.', 'success');
        setProducts(products.filter(p => p._id !== id));
        if (activeTab === 'analytics') {
          const statsRes = await axios.get('/admin/dashboard-stats');
          if (statsRes.data.success) setStats(statsRes.data.stats);
        }
      }
    } catch (err) {
      addToast('Error deleting product', 'error');
    }
  };

  const handleProductEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category?._id || product.category,
      brand: product.brand || '',
      description: product.description || '',
      images: product.images || [],
      stock: product.stock || 100,
      originalPrice: product.originalPrice || 0,
      discount: product.discount || 0,
      gst: product.gst || 18
    });
    setShowProductForm(true);
  };

  // CATEGORY CRUD
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name) return;
    setSubmitting(true);
    try {
      let res;
      if (editingCategory) {
        res = await axios.put(`/categories/${editingCategory._id}`, categoryForm);
        if (res.data.success) {
          addToast('Category updated successfully!', 'success');
          setCategories(categories.map(c => c._id === editingCategory._id ? res.data.category : c));
          setEditingCategory(null);
        }
      } else {
        res = await axios.post('/categories', categoryForm);
        if (res.data.success) {
          addToast('Category created successfully!', 'success');
          setCategories([...categories, res.data.category]);
        }
      }
      setShowCategoryForm(false);
      setCategoryForm({ name: '', description: '', image: '' });
    } catch (err) {
      addToast(editingCategory ? 'Failed to update category' : 'Error creating category', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategoryDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      const res = await axios.delete(`/categories/${id}`);
      if (res.data.success) {
        addToast('Category deleted', 'success');
        setCategories(categories.filter(c => c._id !== id));
      }
    } catch (err) {
      addToast('Error deleting category', 'error');
    }
  };

  const handleCategoryEdit = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      image: category.image || ''
    });
    setShowCategoryForm(true);
  };

  // COUPON CRUD
  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.expiryDate) return;
    setSubmitting(true);
    try {
      let res;
      if (editingCoupon) {
        res = await axios.put(`/coupons/${editingCoupon._id}`, couponForm);
        if (res.data.success) {
          addToast('Coupon updated successfully!', 'success');
          setCoupons(coupons.map(c => c._id === editingCoupon._id ? res.data.coupon : c));
          setEditingCoupon(null);
        }
      } else {
        res = await axios.post('/coupons', couponForm);
        if (res.data.success) {
          addToast('Coupon created successfully!', 'success');
          setCoupons([...coupons, res.data.coupon]);
        }
      }
      setShowCouponForm(false);
      setCouponForm({ code: '', discountPercentage: 10, maxDiscount: 200, expiryDate: '' });
    } catch (err) {
      addToast(editingCoupon ? 'Failed to update coupon' : 'Error creating coupon', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCouponDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      const res = await axios.delete(`/coupons/${id}`);
      if (res.data.success) {
        addToast('Coupon deleted', 'success');
        setCoupons(coupons.filter(c => c._id !== id));
      }
    } catch (err) {
      addToast('Error deleting coupon', 'error');
    }
  };

  const handleCouponEdit = (coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage || 10,
      maxDiscount: coupon.maxDiscount || 200,
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : ''
    });
    setShowCouponForm(true);
  };

  // ORDER STATUS UPDATE
  const handleOrderStatusUpdate = async (id, currentStatus) => {
    const statuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled'];
    const nextIdx = statuses.indexOf(currentStatus) + 1;
    if (nextIdx >= statuses.length - 1 && currentStatus === 'Delivered') return;

    const newStatus = statuses[nextIdx];
    const desc = prompt(`Enter tracking status update description:`, `Your order has been updated to: ${newStatus}`);
    
    if (desc !== null) {
      try {
        const res = await axios.put(`/orders/${id}/status`, { status: newStatus, description: desc || `Order updated to ${newStatus}` });
        if (res.data.success) {
          addToast(`Order updated to: ${newStatus}`, 'success');
          setOrders(orders.map(o => o._id === id ? { ...o, orderStatus: newStatus } : o));
        }
      } catch (err) {
        addToast('Failed to update status', 'error');
      }
    }
  };

  const handleProductImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const urls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        const res = await axios.post('/admin/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (res.data.success) {
          urls.push(res.data.url);
        }
      } catch (err) {
        console.error('Error uploading image:', err);
        addToast('Error uploading image', 'error');
      }
    }
    
    setProductForm(prev => ({
      ...prev,
      images: [...prev.images, ...urls]
    }));
    addToast('Images uploaded successfully!', 'success');
  };

  const handleCategoryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await axios.post('/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.success) {
        setCategoryForm(prev => ({
          ...prev,
          image: res.data.url
        }));
        addToast('Category image uploaded successfully!', 'success');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      addToast('Error uploading image', 'error');
    }
  };

  if (!user || user.role !== 'admin') return null;

  // Sidebar menu items
  const menuItems = [
    { id: 'analytics', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'products', icon: ShoppingBag, label: 'Products' },
    { id: 'orders', icon: CheckCircle, label: 'Orders' },
    { id: 'categories', icon: FolderOpen, label: 'Categories' },
    { id: 'coupons', icon: Ticket, label: 'Coupons' },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const getProductCount = () => products.length;
  const getOrderCount = () => orders.length;
  const getCustomerCount = () => {
    if (stats?.totalUsers) return stats.totalUsers;
    const uniqueUsers = new Set(orders.map(o => o.user?._id).filter(Boolean));
    return uniqueUsers.size || 0;
  };
  const getTotalRevenue = () => {
    if (stats?.totalRevenue) return stats.totalRevenue;
    return orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  };

  // Generate mock data for charts if stats not available
  const getMonthlyData = () => {
    if (stats?.monthlyStats && stats.monthlyStats.length > 0) {
      return stats.monthlyStats;
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(m => ({
      _id: m,
      orders: Math.floor(Math.random() * 300) + 50,
      revenue: Math.floor(Math.random() * 30000) + 5000
    }));
  };

  const monthlyData = getMonthlyData();
  const maxRevenue = Math.max(...monthlyData.map(m => m.revenue), 1);
  const maxOrders = Math.max(...monthlyData.map(m => m.orders), 1);

  // Category distribution for pie chart
  const getCategoryDistribution = () => {
    const dist = {};
    products.forEach(p => {
      const catName = p.category?.name || 'Uncategorized';
      dist[catName] = (dist[catName] || 0) + 1;
    });
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  };

  const categoryDist = getCategoryDistribution();
  const pieColors = ['#f59e0b', '#f97316', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#ef4444', '#ec4899'];

  // Status distribution for donut chart
  const getStatusDistribution = () => {
    const statuses = ['Delivered', 'Pending', 'Out For Delivery', 'Cancelled', 'Returned'];
    const dist = {};
    statuses.forEach(s => dist[s] = 0);
    orders.forEach(o => {
      const status = o.orderStatus || 'Pending';
      dist[status] = (dist[status] || 0) + 1;
    });
    return Object.entries(dist).filter(([_, v]) => v > 0).map(([name, value]) => ({ name, value }));
  };

  const statusDist = getStatusDistribution();

  // Calculate growth percentages
  const calculateGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const currentMonthRevenue = monthlyData[monthlyData.length - 1]?.revenue || 0;
  const previousMonthRevenue = monthlyData[monthlyData.length - 2]?.revenue || 0;
  const revenueGrowth = calculateGrowth(currentMonthRevenue, previousMonthRevenue);

  const currentMonthOrders = monthlyData[monthlyData.length - 1]?.orders || 0;
  const previousMonthOrders = monthlyData[monthlyData.length - 2]?.orders || 0;
  const ordersGrowth = calculateGrowth(currentMonthOrders, previousMonthOrders);

  return (
    <div className="min-h-screen bg-[#f8f6f1]">
      {/* Main Layout - No Navbar/Footer */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`flex-shrink-0 bg-white border-r border-amber-200/20 shadow-lg shadow-amber-900/5 transition-all duration-300 overflow-y-auto ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}>
          <div className="flex flex-col h-full">
            <div className={`p-4 border-b border-amber-200/20 ${sidebarCollapsed ? 'text-center' : ''}`}>
              <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg shadow-amber-400/20">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1a0e0a] truncate">{user?.name || 'Admin'}</p>
                    <p className="text-xs text-amber-600/60">Administrator</p>
                  </div>
                )}
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === item.id 
                      ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm' 
                      : 'text-amber-700/50 hover:bg-amber-50/50 hover:text-amber-700'
                  } ${sidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <item.icon className={`h-5 w-5 flex-shrink-0 ${activeTab === item.id ? 'text-amber-600' : ''}`} />
                  {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              ))}
            </nav>

            <div className="border-t border-amber-200/20 p-3 space-y-2">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-amber-700/40 hover:bg-amber-50/50 hover:text-amber-700 transition-all duration-300 ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                <MoreVertical className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="text-sm font-medium">More</span>}
              </button>
              <button
                onClick={logout}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500/40 hover:bg-red-50 hover:text-red-500 transition-all duration-300 ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#f8f6f1]">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-light text-[#1a0e0a]">
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-sm text-amber-700/40">Welcome back, {user?.name || 'Admin'}!</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={refreshData}
                disabled={refreshing}
                className="p-2.5 rounded-xl hover:bg-amber-50 text-amber-700/40 hover:text-amber-700 transition-all border border-transparent hover:border-amber-200 flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="text-xs">{refreshing ? 'Loading...' : 'Refresh'}</span>
              </button>
              <button className="p-2.5 rounded-xl hover:bg-amber-50 text-amber-700/40 hover:text-amber-700 transition-all border border-transparent hover:border-amber-200">
                <Mail className="h-5 w-5" />
              </button>
              <button className="p-2.5 rounded-xl hover:bg-amber-50 text-amber-700/40 hover:text-amber-700 transition-all border border-transparent hover:border-amber-200">
                <Calendar className="h-5 w-5" />
              </button>
              <button className="p-2.5 rounded-xl hover:bg-amber-50 text-amber-700/40 hover:text-amber-700 transition-all border border-transparent hover:border-amber-200">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ANALYTICS VIEW - Multiple Graphs */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200/20 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-amber-700/40">Total Sales</span>
                    <div className="p-2 bg-amber-50 rounded-xl">
                      <DollarSign className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[#1a0e0a]">{formatCurrency(getTotalRevenue())}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500 font-medium">{revenueGrowth.toFixed(1)}%</span>
                    <span className="text-xs text-amber-700/40">from last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200/20 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-amber-700/40">Total Customers</span>
                    <div className="p-2 bg-blue-50 rounded-xl">
                      <Users className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[#1a0e0a]">{getCustomerCount()}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500 font-medium">+8.2%</span>
                    <span className="text-xs text-amber-700/40">from last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200/20 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-amber-700/40">Total Products</span>
                    <div className="p-2 bg-purple-50 rounded-xl">
                      <Package className="h-5 w-5 text-purple-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[#1a0e0a]">{getProductCount()}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500 font-medium">+3.1%</span>
                    <span className="text-xs text-amber-700/40">from last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200/20 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-amber-700/40">Total Orders</span>
                    <div className="p-2 bg-orange-50 rounded-xl">
                      <ShoppingCart className="h-5 w-5 text-orange-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[#1a0e0a]">{getOrderCount()}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500 font-medium">{ordersGrowth.toFixed(1)}%</span>
                    <span className="text-xs text-amber-700/40">from last month</span>
                  </div>
                </div>
              </div>

              {/* Row 1: Bar Chart + Pie Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Revenue Bar Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200/20">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-sm font-semibold text-[#1a0e0a]">Monthly Revenue</h3>
                      <p className="text-xs text-amber-700/40">Revenue trend over the year</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-amber-700/40">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-amber-400"></div>
                        <span>Revenue</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative h-52">
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-amber-700/30 py-2">
                      <span>{formatCurrency(maxRevenue)}</span>
                      <span>{formatCurrency(maxRevenue * 0.75)}</span>
                      <span>{formatCurrency(maxRevenue * 0.5)}</span>
                      <span>{formatCurrency(maxRevenue * 0.25)}</span>
                      <span>{formatCurrency(0)}</span>
                    </div>
                    <div className="absolute left-14 right-0 top-0 bottom-0 flex items-end justify-between gap-1">
                      {monthlyData.map((m, i) => {
                        const height = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
                        return (
                          <div key={i} className="flex flex-col items-center flex-1 group">
                            <div className="relative w-full max-w-8">
                              <div 
                                className="w-full bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-sm transition-all duration-500 group-hover:from-amber-500 group-hover:to-amber-400"
                                style={{ height: `${Math.max(height, 4)}%`, minHeight: '4px' }}
                              />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#1a0e0a] text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                                {formatCurrency(m.revenue)}
                              </div>
                            </div>
                            <span className="text-[10px] text-amber-700/40 mt-1">{m._id}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Category Distribution Pie Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200/20">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-sm font-semibold text-[#1a0e0a]">Category Distribution</h3>
                      <p className="text-xs text-amber-700/40">Products by category</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center h-52">
                    {categoryDist.length > 0 ? (
                      <div className="relative w-48 h-48">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                          {categoryDist.map((item, index) => {
                            const total = categoryDist.reduce((sum, i) => sum + i.value, 0);
                            const percentage = (item.value / total) * 100;
                            const startAngle = categoryDist.slice(0, index).reduce((sum, i) => sum + (i.value / total) * 360, 0);
                            const endAngle = startAngle + (percentage * 3.6);
                            const largeArc = percentage > 50 ? 1 : 0;
                            const startX = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
                            const startY = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
                            const endX = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
                            const endY = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
                            return (
                              <path
                                key={index}
                                d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`}
                                fill={pieColors[index % pieColors.length]}
                                className="transition-all duration-300 hover:opacity-80"
                              />
                            );
                          })}
                          <circle cx="50" cy="50" r="25" fill="white" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-[#1a0e0a]">{products.length}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-amber-700/40 text-sm">No categories data</p>
                    )}
                    <div className="ml-4 space-y-1">
                      {categoryDist.slice(0, 5).map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: pieColors[i % pieColors.length] }} />
                          <span className="text-amber-700/60">{item.name}</span>
                          <span className="text-[#1a0e0a] font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Orders Line Chart + Status Donut Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Orders Trend Line Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200/20">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-sm font-semibold text-[#1a0e0a]">Orders Trend</h3>
                      <p className="text-xs text-amber-700/40">Monthly order volume</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-amber-700/40">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span>Orders</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative h-52">
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-amber-700/30 py-2">
                      <span>{maxOrders}</span>
                      <span>{Math.round(maxOrders * 0.75)}</span>
                      <span>{Math.round(maxOrders * 0.5)}</span>
                      <span>{Math.round(maxOrders * 0.25)}</span>
                      <span>0</span>
                    </div>
                    <div className="absolute left-14 right-0 top-0 bottom-0">
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polyline
                          points={monthlyData.map((m, i) => {
                            const x = (i / (monthlyData.length - 1)) * 100;
                            const y = 100 - ((m.orders / maxOrders) * 90 + 5);
                            return `${x},${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="transition-all duration-500"
                        />
                        {monthlyData.map((m, i) => {
                          const x = (i / (monthlyData.length - 1)) * 100;
                          const y = 100 - ((m.orders / maxOrders) * 90 + 5);
                          return (
                            <circle
                              key={i}
                              cx={x}
                              cy={y}
                              r="3"
                              fill="#f59e0b"
                              className="transition-all duration-300 hover:r-5"
                            />
                          );
                        })}
                        {/* Area under line */}
                        <polygon
                          points={monthlyData.map((m, i) => {
                            const x = (i / (monthlyData.length - 1)) * 100;
                            const y = 100 - ((m.orders / maxOrders) * 90 + 5);
                            return `${x},${y}`;
                          }).join(' ') + ` ${100},100 0,100`
                          }
                          fill="url(#areaGradient)"
                          opacity="0.2"
                        />
                        <defs>
                          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Order Status Donut Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200/20">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-sm font-semibold text-[#1a0e0a]">Order Status</h3>
                      <p className="text-xs text-amber-700/40">Distribution by status</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center h-52">
                    {statusDist.length > 0 ? (
                      <div className="flex items-center gap-8">
                        <div className="relative w-40 h-40">
                          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                            {statusDist.map((item, index) => {
                              const total = statusDist.reduce((sum, i) => sum + i.value, 0);
                              const percentage = (item.value / total) * 100;
                              const startAngle = statusDist.slice(0, index).reduce((sum, i) => sum + (i.value / total) * 360, 0);
                              const endAngle = startAngle + (percentage * 3.6);
                              const largeArc = percentage > 50 ? 1 : 0;
                              const startX = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
                              const startY = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
                              const endX = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
                              const endY = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
                              const color = item.name === 'Delivered' ? '#10b981' :
                                           item.name === 'Pending' ? '#f59e0b' :
                                           item.name === 'Out For Delivery' ? '#3b82f6' :
                                           item.name === 'Cancelled' ? '#ef4444' : '#8b5cf6';
                              return (
                                <path
                                  key={index}
                                  d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`}
                                  fill={color}
                                  className="transition-all duration-300 hover:opacity-80"
                                />
                              );
                            })}
                            <circle cx="50" cy="50" r="25" fill="white" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-[#1a0e0a]">{orders.length}</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          {statusDist.map((item, i) => {
                            const colors = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];
                            return (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: colors[i % colors.length] }} />
                                <span className="text-amber-700/60">{item.name}</span>
                                <span className="text-[#1a0e0a] font-medium">{item.value}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-amber-700/40 text-sm">No order status data</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 3: Quick Stats + Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200/20 lg:col-span-1">
                  <h3 className="text-sm font-semibold text-[#1a0e0a] mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-amber-50/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <Zap className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-amber-700/40">Avg Order Value</p>
                          <p className="text-sm font-semibold text-[#1a0e0a]">
                            {getOrderCount() > 0 ? formatCurrency(getTotalRevenue() / getOrderCount()) : formatCurrency(0)}
                          </p>
                        </div>
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-amber-700/40">Avg Delivery Time</p>
                          <p className="text-sm font-semibold text-[#1a0e0a]">2.4 days</p>
                        </div>
                      </div>
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Award className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-amber-700/40">Top Category</p>
                          <p className="text-sm font-semibold text-[#1a0e0a]">
                            {categoryDist.length > 0 ? categoryDist.reduce((a, b) => a.value > b.value ? a : b).name : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Users className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-amber-700/40">Conversion Rate</p>
                          <p className="text-sm font-semibold text-[#1a0e0a]">18.5%</p>
                        </div>
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200/20 lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-[#1a0e0a]">Recent Activity</h3>
                    <span className="text-xs text-amber-700/40">Last 7 days</span>
                  </div>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border-b border-amber-200/10 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            order.orderStatus === 'Delivered' ? 'bg-green-500' :
                            order.orderStatus === 'Pending' ? 'bg-amber-500' :
                            order.orderStatus === 'Cancelled' ? 'bg-red-500' :
                            'bg-blue-500'
                          }`} />
                          <div>
                            <p className="text-sm text-[#1a0e0a] font-medium">
                              Order #{order._id?.substring(0, 8).toUpperCase() || 'N/A'}
                            </p>
                            <p className="text-xs text-amber-700/40">
                              {order.user?.name || 'Guest'} • {formatCurrency(order.totalAmount)}
                            </p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.orderStatus === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.orderStatus || 'Pending'}
                        </span>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <p className="text-center text-amber-700/40 py-4">No recent activity</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-amber-200/20 overflow-hidden">
                <div className="px-6 py-4 border-b border-amber-200/20 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#1a0e0a]">Recent Orders</h3>
                  <button className="text-xs text-amber-600/60 hover:text-amber-600 flex items-center gap-1">
                    View All <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-amber-50/50 text-amber-700/60 text-xs">
                      <tr>
                        <th className="px-6 py-3 text-left font-medium">Order ID</th>
                        <th className="px-6 py-3 text-left font-medium">Customer</th>
                        <th className="px-6 py-3 text-left font-medium">Date</th>
                        <th className="px-6 py-3 text-left font-medium">Items</th>
                        <th className="px-6 py-3 text-left font-medium">Total</th>
                        <th className="px-6 py-3 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-200/10">
                      {orders.slice(0, 6).map((order) => (
                        <tr key={order._id} className="hover:bg-amber-50/30 transition-colors">
                          <td className="px-6 py-3 text-amber-700/60 font-mono text-xs">#{order._id?.substring(0, 8).toUpperCase() || 'N/A'}</td>
                          <td className="px-6 py-3 text-[#1a0e0a]">{order.user?.name || 'Guest'}</td>
                          <td className="px-6 py-3 text-amber-700/40">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-3 text-amber-700/40">{order.items?.length || 0}</td>
                          <td className="px-6 py-3 font-medium text-[#1a0e0a]">{formatCurrency(order.totalAmount)}</td>
                          <td className="px-6 py-3">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              order.orderStatus === 'Delivered' 
                                ? 'bg-green-100 text-green-700' 
                                : order.orderStatus === 'Cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {order.orderStatus || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-amber-700/40">No orders found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS VIEW */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-amber-200/20 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1a0e0a]">Product Catalog</h2>
                    <p className="text-sm text-amber-700/40">
                      <span className="font-semibold text-[#1a0e0a]">{products.length}</span> products available
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        name: '', category: '', brand: '', description: '',
                        images: [], stock: 100, originalPrice: 0, discount: 0, gst: 18
                      });
                      setShowProductForm(!showProductForm);
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm shadow-amber-500/20"
                  >
                    <PlusCircle className="h-4 w-4" /> Add New Product
                  </button>
                </div>

                <AnimatePresence>
                  {showProductForm && (
                    <motion.form 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleProductSubmit} 
                      className="bg-amber-50/50 rounded-xl p-6 border border-amber-200 mb-6 overflow-hidden"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-sm text-amber-700">
                          {editingProduct ? 'Edit Product' : 'Create New Product'}
                        </h3>
                        <button type="button" onClick={() => setShowProductForm(false)} className="text-amber-700/40 hover:text-amber-700">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          placeholder="Product Name *"
                          className="bg-white border border-amber-200/50 rounded-xl px-4 py-2.5 text-sm text-[#1a0e0a] focus:outline-none focus:border-amber-400 transition-colors"
                        />
                        <select
                          required
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="bg-white border border-amber-200/50 rounded-xl px-4 py-2.5 text-sm text-[#1a0e0a] focus:outline-none focus:border-amber-400 transition-colors"
                        >
                          <option value="" className="text-[#1a0e0a]">Select Category *</option>
                          {categories.map((c) => (
                            <option key={c._id} value={c._id} className="text-[#1a0e0a]">{c.name}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={productForm.brand}
                          onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                          placeholder="Brand Name"
                          className="bg-white border border-amber-200/50 rounded-xl px-4 py-2.5 text-sm text-[#1a0e0a] focus:outline-none focus:border-amber-400 transition-colors"
                        />
                        <input
                          type="number"
                          required
                          value={productForm.originalPrice}
                          onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                          placeholder="Original Price (₹) *"
                          className="bg-white border border-amber-200/50 rounded-xl px-4 py-2.5 text-sm text-[#1a0e0a] focus:outline-none focus:border-amber-400 transition-colors"
                        />
                        <input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                          placeholder="Stock quantity"
                          className="bg-white border border-amber-200/50 rounded-xl px-4 py-2.5 text-sm text-[#1a0e0a] focus:outline-none focus:border-amber-400 transition-colors"
                        />
                        <input
                          type="number"
                          value={productForm.discount}
                          onChange={(e) => setProductForm({ ...productForm, discount: Number(e.target.value) })}
                          placeholder="Discount % (e.g. 10)"
                          className="bg-white border border-amber-200/50 rounded-xl px-4 py-2.5 text-sm text-[#1a0e0a] focus:outline-none focus:border-amber-400 transition-colors"
                        />
                        <div className="bg-white border border-amber-200/50 rounded-xl p-4 sm:col-span-2">
                          <label className="block text-xs font-semibold text-amber-700/60 uppercase tracking-wider mb-2">Product Images</label>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleProductImageUpload}
                            className="text-xs text-[#1a0e0a] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                          />
                          {productForm.images.length > 0 && (
                            <div className="flex gap-2 flex-wrap mt-4">
                              {productForm.images.map((img, idx) => (
                                <div key={idx} className="relative w-16 h-16 rounded-lg border border-amber-200/50 overflow-hidden bg-amber-50/10">
                                  <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => setProductForm(prev => ({
                                      ...prev,
                                      images: prev.images.filter((_, i) => i !== idx)
                                    }))}
                                    className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <textarea
                          required
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          placeholder="Product Description *"
                          rows={3}
                          className="bg-white border border-amber-200/50 rounded-xl px-4 py-2.5 text-sm text-[#1a0e0a] focus:outline-none focus:border-amber-400 transition-colors sm:col-span-2"
                        />
                      </div>
                      <div className="flex gap-3 justify-end text-sm font-medium mt-4">
                        <button
                          type="button"
                          onClick={() => setShowProductForm(false)}
                          className="px-5 py-2 border border-amber-200/50 rounded-xl hover:bg-amber-50 transition-colors text-[#1a0e0a]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors shadow-sm shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2"
                        >
                          {submitting && <Loader className="h-4 w-4 animate-spin" />}
                          {submitting ? (editingProduct ? 'Updating...' : 'Creating...') : (editingProduct ? 'Update Product' : 'Create Product')}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-amber-50/50 text-amber-700/60 text-xs">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">#</th>
                        <th className="px-4 py-3 text-left font-medium">Name</th>
                        <th className="px-4 py-3 text-left font-medium">Category</th>
                        <th className="px-4 py-3 text-left font-medium">Price</th>
                        <th className="px-4 py-3 text-left font-medium">Stock</th>
                        <th className="px-4 py-3 text-center font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-200/10">
                      {products.map((p, index) => (
                        <tr key={p._id} className="hover:bg-amber-50/30 transition-colors">
                          <td className="px-4 py-3 text-amber-700/40 text-xs">{index + 1}</td>
                          <td className="px-4 py-3 font-medium text-[#1a0e0a]">{p.name}</td>
                          <td className="px-4 py-3 text-amber-700/60">{p.category?.name || 'Unassigned'}</td>
                          <td className="px-4 py-3 font-semibold text-[#1a0e0a]">{formatCurrency(p.offerPrice || p.originalPrice)}</td>
                          <td className={`px-4 py-3 font-medium ${p.stock <= 10 ? 'text-red-500' : 'text-amber-700/60'}`}>{p.stock}</td>
                          <td className="px-4 py-3 flex gap-2 justify-center">
                            <button
                              onClick={() => handleProductEdit(p)}
                              className="p-2 text-amber-700/30 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleProductDelete(p._id)}
                              className="p-2 text-amber-700/30 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr>
                          <td colSpan="6" className="px-4 py-8 text-center text-amber-700/40">
                            No products found. Click "Add New Product" to create your first product!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS VIEW */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl shadow-sm border border-amber-200/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#1a0e0a]">Order Management</h2>
                  <p className="text-sm text-amber-700/40">
                    <span className="font-semibold text-[#1a0e0a]">{orders.length}</span> orders total
                  </p>
                </div>
                <button onClick={refreshData} className="text-xs text-amber-600/60 hover:text-amber-600 flex items-center gap-1">
                  <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
                </button>
              </div>
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o._id} className="p-4 rounded-xl border border-amber-200/20 hover:border-amber-300/50 transition-colors bg-amber-50/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-sm">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <strong className="text-[#1a0e0a] font-mono text-xs">#{o._id?.substring(0, 8).toUpperCase() || 'N/A'}</strong>
                          <span className="text-amber-700/40 text-xs">{new Date(o.createdAt).toLocaleString()}</span>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            o.orderStatus === 'Delivered' 
                              ? 'bg-green-100 text-green-700' 
                              : o.orderStatus === 'Cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {o.orderStatus || 'Pending'}
                          </span>
                        </div>
                        <p className="text-amber-700/60">Buyer: <span className="text-[#1a0e0a]">{o.user?.name || 'Guest'}</span> ({o.user?.email || 'No email'})</p>
                        <p className="text-amber-700/60 mt-1">Total: <strong className="text-amber-700 font-bold">{formatCurrency(o.totalAmount)}</strong> | Items: {o.items?.length || 0} | Method: {o.paymentMethod || 'N/A'}</p>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        {o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled' && (
                          <button
                            onClick={() => handleOrderStatusUpdate(o._id, o.orderStatus)}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-medium px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                          >
                            <RefreshCw className="h-3 w-3" /> Update Status
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-center text-amber-700/40 py-8">No orders found.</p>
                )}
              </div>
            </div>
          )}

          {/* CATEGORIES VIEW */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-amber-200/20 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1a0e0a]">Categories</h2>
                    <p className="text-sm text-amber-700/40">
                      <span className="font-semibold text-[#1a0e0a]">{categories.length}</span> categories available
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setCategoryForm({ name: '', description: '', image: '' });
                      setShowCategoryForm(!showCategoryForm);
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm shadow-amber-500/20"
                  >
                    <PlusCircle className="h-4 w-4" /> Add Category
                  </button>
                </div>

                <AnimatePresence>
                  {showCategoryForm && (
                    <motion.form 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleCategorySubmit} 
                      className="bg-amber-50/50 rounded-xl p-6 border border-amber-200 mb-6 overflow-hidden"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-sm text-amber-700">
                          {editingCategory ? 'Edit Category' : 'Create New Category'}
                        </h3>
                        <button type="button" onClick={() => setShowCategoryForm(false)} className="text-amber-700/40 hover:text-amber-700">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          required
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                          placeholder="Category Name *"
                          className="bg-white border border-amber-200/50 rounded-xl px-4 py-2.5 text-sm text-[#1a0e0a] focus:outline-none focus:border-amber-400 transition-colors"
                        />
                        <div className="bg-white border border-amber-200/50 rounded-xl p-4 sm:col-span-2">
                          <label className="block text-xs font-semibold text-amber-700/60 uppercase tracking-wider mb-2">Category Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCategoryImageUpload}
                            className="text-xs text-[#1a0e0a] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                          />
                          {categoryForm.image && (
                            <div className="relative w-20 h-20 rounded-lg border border-amber-200/50 overflow-hidden bg-amber-50/10 mt-4">
                              <img src={categoryForm.image} alt="Category preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setCategoryForm(prev => ({ ...prev, image: '' }))}
                                className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                        <textarea
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                          placeholder="Category Description"
                          rows={2}
                          className="bg-white border border-amber-200/50 rounded-xl px-4 py-2.5 text-sm text-[#1a0e0a] focus:outline-none focus:border-amber-400 transition-colors sm:col-span-2"
                        />
                      </div>
                      <div className="flex gap-3 justify-end text-sm font-medium mt-4">
                        <button
                          type="button"
                          onClick={() => setShowCategoryForm(false)}
                          className="px-5 py-2 border border-amber-200/50 rounded-xl hover:bg-amber-50 transition-colors text-[#1a0e0a]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors shadow-sm shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2"
                        >
                          {submitting && <Loader className="h-4 w-4 animate-spin" />}
                          {submitting ? (editingCategory ? 'Updating...' : 'Creating...') : (editingCategory ? 'Update' : 'Create')}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((c) => (
                    <div key={c._id} className="p-4 rounded-xl border border-amber-200/20 hover:border-amber-300/50 transition-colors bg-amber-50/10 flex justify-between items-center">
                      <div>
                        <strong className="text-[#1a0e0a] text-sm block">{c.name}</strong>
                        <span className="text-xs text-amber-700/40 block mt-0.5">{c.description || 'No description'}</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleCategoryEdit(c)}
                          className="p-2 text-amber-700/30 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleCategoryDelete(c._id)}
                          className="p-2 text-amber-700/30 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <p className="col-span-full text-center text-amber-700/40 py-8">No categories found.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* COUPONS VIEW */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-amber-200/20 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1a0e0a]">Promotion Coupons</h2>
                    <p className="text-sm text-amber-700/40">
                      <span className="font-semibold text-[#1a0e0a]">{coupons.length}</span> coupons available
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCoupon(null);
                      setCouponForm({ code: '', discountPercentage: 10, maxDiscount: 200, expiryDate: '' });
                      setShowCouponForm(!showCouponForm);
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm shadow-amber-500/20"
                  >
                    <PlusCircle className="h-4 w-4" /> Add Coupon
                  </button>
                </div>

                <AnimatePresence>
                  {showCouponForm && (
                    <motion.form 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleCouponSubmit} 
                      className="bg-amber-50/50 rounded-xl p-6 border border-amber-200 mb-6 overflow-hidden"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-sm text-amber-700">
                          {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                        </h3>
                        <button type="button" onClick={() => setShowCouponForm(false)} className="text-amber-700/40 hover:text-amber-700">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input
                          type="text"
                          required
                          value={couponForm.code}
                          onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                          placeholder="CODE (e.g. DIWALI25)"
                          className="bg-white border border-amber-200/50 rounded-xl px-4 py-2.5 text-sm text-[#1a0e0a] uppercase focus:outline-none focus:border-amber-400 transition-colors"
                        />
                        <input
                          type="number"
                          required
                          value={couponForm.discountPercentage}
                          onChange={(e) => setCouponForm({ ...couponForm, discountPercentage: Number(e.target.value) })}
                          placeholder="Discount %"
                          className="bg-white border border-amber-200/50 rounded-xl px-4 py-2.5 text-sm text-[#1a0e0a] focus:outline-none focus:border-amber-400 transition-colors"
                        />
                        <input
                          type="number"
                          required
                          value={couponForm.maxDiscount}
                          onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: Number(e.target.value) })}
                          placeholder="Max Discount (₹)"
                          className="bg-white border border-amber-200/50 rounded-xl px-4 py-2.5 text-sm text-[#1a0e0a] focus:outline-none focus:border-amber-400 transition-colors"
                        />
                        <input
                          type="date"
                          required
                          value={couponForm.expiryDate}
                          onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })}
                          className="bg-white border border-amber-200/50 rounded-xl px-4 py-2.5 text-sm text-[#1a0e0a] focus:outline-none focus:border-amber-400 transition-colors sm:col-span-3"
                        />
                      </div>
                      <div className="flex gap-3 justify-end text-sm font-medium mt-4">
                        <button
                          type="button"
                          onClick={() => setShowCouponForm(false)}
                          className="px-5 py-2 border border-amber-200/50 rounded-xl hover:bg-amber-50 transition-colors text-[#1a0e0a]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors shadow-sm shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2"
                        >
                          {submitting && <Loader className="h-4 w-4 animate-spin" />}
                          {submitting ? (editingCoupon ? 'Updating...' : 'Creating...') : (editingCoupon ? 'Update' : 'Create')}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coupons.map((c) => (
                    <div key={c._id} className="p-4 rounded-xl border border-amber-200/20 hover:border-amber-300/50 transition-colors bg-amber-50/10 flex justify-between items-center">
                      <div>
                        <strong className="text-[#1a0e0a] text-sm block font-mono">{c.code}</strong>
                        <span className="text-xs text-amber-700/40 block mt-0.5">
                          {c.discountPercentage}% off (Max {formatCurrency(c.maxDiscount)}) | Expires: {new Date(c.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleCouponEdit(c)}
                          className="p-2 text-amber-700/30 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleCouponDelete(c._id)}
                          className="p-2 text-amber-700/30 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {coupons.length === 0 && (
                    <p className="col-span-full text-center text-amber-700/40 py-8">No coupons found.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;