import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { 
  Filter, X, SlidersHorizontal, ArrowUpDown, 
  Search, Sparkles, Crown, Star, Award, 
  ChevronDown, ChevronUp, Grid, List, 
  ShoppingBag, TrendingUp, Flame, Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
  const location = useLocation();

  // Parse queries from URL on load
  const getQueryParam = (name) => {
    return new URLSearchParams(location.search).get(name) || '';
  };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(getQueryParam('search'));
  const [selectedCategory, setSelectedCategory] = useState(getQueryParam('category'));
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceMax, setPriceMax] = useState(3000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Mobile filter drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Sync search / category from URL queries
  useEffect(() => {
    setSearch(getQueryParam('search'));
    setSelectedCategory(getQueryParam('category'));
  }, [location.search]);

  // Fetch categories list once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/categories');
        if (res.data.success) setCategories(res.data.categories);
      } catch (err) {
        console.error('Error fetching categories');
      }
    };
    fetchCategories();
  }, []);

  // Fetch products matching filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('keyword', search);
        if (selectedCategory) queryParams.append('category', selectedCategory);
        if (selectedBrand) queryParams.append('brand', selectedBrand);
        if (priceMax) queryParams.append('priceMax', priceMax);
        if (minRating > 0) queryParams.append('rating', minRating);
        if (sort) queryParams.append('sort', sort);
        queryParams.append('page', page);
        queryParams.append('limit', 9);

        const res = await axios.get(`/products?${queryParams.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products);
          setTotalPages(res.data.totalPages);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, selectedCategory, selectedBrand, priceMax, minRating, sort, page]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceMax(3000);
    setMinRating(0);
    setSort('');
    setPage(1);
  };

  const handleCategorySelect = (catName) => {
    setSelectedCategory(selectedCategory === catName ? '' : catName);
    setPage(1);
  };

  // Get active filter count
  const activeFilters = [
    search, selectedCategory, selectedBrand, 
    priceMax < 3000 ? 'price' : null, 
    minRating > 0 ? 'rating' : null
  ].filter(Boolean).length;

  return (
    <div className="pt-24 pb-20 bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5] min-h-screen">
      {/* HERO BANNER - Light Theme */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5] via-transparent to-[#faf8f5]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="py-8 md:py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-100 rounded-xl border border-amber-200">
                    <Sparkles className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="text-amber-600/60 text-xs font-medium tracking-[0.2em] uppercase">
                    Premium Collection
                  </span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-light text-[#1a0e0a] tracking-tight">
                  <span className="font-serif italic text-amber-600/60">The</span>{' '}
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800">
                    Showroom
                  </span>
                </h1>
                <p className="text-amber-700/40 text-sm mt-2 font-light">
                  {products.length} premium products available
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* View toggle */}
                <div className="hidden sm:flex bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200/30 p-1 shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                        : 'text-amber-700/40 hover:text-amber-700/60'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                        : 'text-amber-700/40 hover:text-amber-700/60'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="md:hidden flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-amber-200/30 rounded-xl px-4 py-2.5 text-sm text-amber-700/60 hover:border-amber-400/50 hover:text-amber-700 transition-all duration-300 shadow-sm"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {activeFilters > 0 && (
                    <span className="bg-amber-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {activeFilters}
                    </span>
                  )}
                </button>

                {/* Sort Selection */}
                <div className="relative">
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-amber-200/30 rounded-xl px-4 py-2.5 text-sm shadow-sm">
                    <ArrowUpDown className="h-4 w-4 text-amber-600/60" />
                    <select
                      value={sort}
                      onChange={(e) => {
                        setSort(e.target.value);
                        setPage(1);
                      }}
                      className="bg-transparent text-amber-700/60 border-none outline-none cursor-pointer focus:ring-0 text-sm appearance-none pr-6"
                    >
                      <option value="" className="bg-white">Sort by</option>
                      <option value="priceAsc" className="bg-white">Price: Low → High</option>
                      <option value="priceDesc" className="bg-white">Price: High → Low</option>
                      <option value="rating" className="bg-white">Rating: High → Low</option>
                      <option value="popular" className="bg-white">Popularity</option>
                    </select>
                    <ChevronDown className="h-3 w-3 text-amber-600/40 pointer-events-none absolute right-3" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 relative">
          {/* SIDEBAR FILTERS (DESKTOP) - Light Theme */}
          <aside className="hidden md:block w-72 shrink-0">
            <div className="sticky top-28 bg-white/90 backdrop-blur-xl rounded-2xl border border-amber-200/30 p-6 shadow-lg shadow-amber-900/5">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-amber-200/20">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-amber-600" />
                  <h3 className="font-semibold text-sm text-[#1a0e0a] tracking-wide">Filters</h3>
                </div>
                <button 
                  onClick={resetFilters} 
                  className="text-xs text-amber-600/40 hover:text-amber-600 transition-colors duration-300"
                >
                  Reset All
                </button>
              </div>

              {/* Search Input */}
              <div className="mb-6">
                <h4 className="text-xs font-medium text-amber-700/40 uppercase tracking-[0.15em] mb-3">Search</h4>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search products..."
                    className="w-full bg-white/80 backdrop-blur-sm border border-amber-200/30 rounded-xl px-4 py-3 pl-11 text-sm text-[#1a0e0a] placeholder-amber-700/30 focus:outline-none focus:border-amber-400/60 transition-all duration-300 shadow-sm"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-600/30" />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-xs font-medium text-amber-700/40 uppercase tracking-[0.15em] mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label 
                      key={cat._id} 
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedCategory === cat.name 
                          ? 'bg-amber-50 border border-amber-300' 
                          : 'hover:bg-amber-50/50 border border-transparent'
                      }`}
                      onClick={() => handleCategorySelect(cat.name)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat.name}
                        onChange={() => {}}
                        className="hidden"
                      />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                        selectedCategory === cat.name 
                          ? 'border-amber-600 bg-amber-600' 
                          : 'border-amber-300/50 bg-transparent'
                      }`}>
                        {selectedCategory === cat.name && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm ${
                        selectedCategory === cat.name 
                          ? 'text-amber-800 font-medium' 
                          : 'text-amber-700/60'
                      }`}>
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-medium text-amber-700/40 uppercase tracking-[0.15em]">Max Price</h4>
                  <span className="text-sm font-semibold text-amber-700">₹{priceMax}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={priceMax}
                  onChange={(e) => {
                    setPriceMax(Number(e.target.value));
                    setPage(1);
                  }}
                  className="w-full h-1.5 bg-amber-200/30 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${(priceMax/5000)*100}%, rgba(212,175,55,0.2) ${(priceMax/5000)*100}%, rgba(212,175,55,0.2) 100%)`
                  }}
                />
                <div className="flex justify-between text-[10px] text-amber-700/30 mt-1.5">
                  <span>₹100</span>
                  <span>₹5000+</span>
                </div>
              </div>

              {/* Ratings */}
              <div>
                <h4 className="text-xs font-medium text-amber-700/40 uppercase tracking-[0.15em] mb-3">Minimum Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => {
                        setMinRating(minRating === stars ? 0 : stars);
                        setPage(1);
                      }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl w-full transition-all duration-300 ${
                        minRating === stars 
                          ? 'bg-amber-50 border border-amber-300' 
                          : 'hover:bg-amber-50/50 border border-transparent'
                      }`}
                    >
                      <div className="flex text-amber-500 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < stars ? 'fill-amber-500 stroke-amber-500' : 'stroke-amber-300/50 fill-transparent'}`} 
                          />
                        ))}
                      </div>
                      <span className={`text-sm ${
                        minRating === stars 
                          ? 'text-amber-800 font-medium' 
                          : 'text-amber-700/60'
                      }`}>
                        {stars} Stars & Up
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filters Display */}
              {activeFilters > 0 && (
                <div className="mt-6 pt-4 border-t border-amber-200/20">
                  <div className="flex flex-wrap gap-2">
                    {search && (
                      <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 text-xs text-amber-700">
                        {search}
                        <button onClick={() => { setSearch(''); setPage(1); }} className="hover:text-amber-900">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {selectedCategory && (
                      <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 text-xs text-amber-700">
                        {selectedCategory}
                        <button onClick={() => { setSelectedCategory(''); setPage(1); }} className="hover:text-amber-900">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* PRODUCTS CATALOG */}
          <main className="flex-grow">
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-amber-700/40 font-light">
                {loading ? 'Loading...' : `${products.length} products found`}
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-96">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Flame className="h-6 w-6 text-amber-600 animate-pulse" />
                  </div>
                </div>
                <p className="text-amber-700/30 text-sm mt-4 font-light">Loading premium products...</p>
              </div>
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl border border-amber-200/30 p-16 text-center shadow-lg shadow-amber-900/5"
              >
                <div className="inline-flex p-4 bg-amber-50 rounded-full border border-amber-200 mb-6">
                  <ShoppingBag className="h-12 w-12 text-amber-600/40" />
                </div>
                <h3 className="text-2xl font-light text-[#1a0e0a] mb-2">No Products Found</h3>
                <p className="text-amber-700/40 text-sm font-light mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={resetFilters}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-300 font-medium text-sm px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <>
                {/* Product Grid */}
                <div className={`grid ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                    : 'grid-cols-1 gap-4'
                }`}>
                  {products.map((product, idx) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className={`bg-white/80 backdrop-blur-sm border border-amber-200/30 hover:border-amber-400/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-amber-900/5 hover:-translate-y-1 ${
                        viewMode === 'list' ? 'flex flex-row' : ''
                      }`}>
                        <ProductCard product={product} viewMode={viewMode} />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination - Light Theme */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="h-10 w-10 rounded-xl bg-white/80 hover:bg-amber-50 border border-amber-200/30 hover:border-amber-400/50 text-amber-700/40 hover:text-amber-700 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 shadow-sm"
                    >
                      <ChevronDown className="h-4 w-4 rotate-90" />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`h-10 w-10 rounded-xl font-medium text-sm border transition-all duration-300 ${
                          page === i + 1
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 border-amber-500 text-white shadow-lg shadow-amber-500/20'
                            : 'bg-white/80 border-amber-200/30 text-amber-700/40 hover:border-amber-400/50 hover:text-amber-700 shadow-sm'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      className="h-10 w-10 rounded-xl bg-white/80 hover:bg-amber-50 border border-amber-200/30 hover:border-amber-400/50 text-amber-700/40 hover:text-amber-700 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 shadow-sm"
                    >
                      <ChevronDown className="h-4 w-4 -rotate-90" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER - Light Theme */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileFilterOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-sm bg-white border-l border-amber-200/30 h-full p-6 flex flex-col overflow-y-auto shadow-2xl z-10"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-amber-200/20">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-amber-600" />
                  <h3 className="font-semibold text-sm text-[#1a0e0a]">Filters</h3>
                </div>
                <button 
                  onClick={() => setMobileFilterOpen(false)} 
                  className="p-2 rounded-full hover:bg-amber-50 text-amber-700/40 hover:text-amber-700 transition-all duration-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <h4 className="text-xs font-medium text-amber-700/40 uppercase tracking-[0.15em] mb-3">Search</h4>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-white/80 backdrop-blur-sm border border-amber-200/30 rounded-xl px-4 py-3 pl-11 text-sm text-[#1a0e0a] placeholder-amber-700/30 focus:outline-none focus:border-amber-400/60 shadow-sm"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-600/30" />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-xs font-medium text-amber-700/40 uppercase tracking-[0.15em] mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label 
                      key={cat._id} 
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedCategory === cat.name 
                          ? 'bg-amber-50 border border-amber-300' 
                          : 'hover:bg-amber-50/50 border border-transparent'
                      }`}
                      onClick={() => handleCategorySelect(cat.name)}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                        selectedCategory === cat.name 
                          ? 'border-amber-600 bg-amber-600' 
                          : 'border-amber-300/50 bg-transparent'
                      }`}>
                        {selectedCategory === cat.name && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm ${
                        selectedCategory === cat.name 
                          ? 'text-amber-800 font-medium' 
                          : 'text-amber-700/60'
                      }`}>
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-medium text-amber-700/40 uppercase tracking-[0.15em]">Max Price</h4>
                  <span className="text-sm font-semibold text-amber-700">₹{priceMax}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full h-1.5 bg-amber-200/30 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${(priceMax/5000)*100}%, rgba(212,175,55,0.2) ${(priceMax/5000)*100}%, rgba(212,175,55,0.2) 100%)`
                  }}
                />
              </div>

              {/* Ratings */}
              <div className="mb-6">
                <h4 className="text-xs font-medium text-amber-700/40 uppercase tracking-[0.15em] mb-3">Minimum Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl w-full transition-all duration-300 ${
                        minRating === stars 
                          ? 'bg-amber-50 border border-amber-300' 
                          : 'hover:bg-amber-50/50 border border-transparent'
                      }`}
                    >
                      <div className="flex text-amber-500 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < stars ? 'fill-amber-500 stroke-amber-500' : 'stroke-amber-300/50 fill-transparent'}`} 
                          />
                        ))}
                      </div>
                      <span className={`text-sm ${
                        minRating === stars 
                          ? 'text-amber-800 font-medium' 
                          : 'text-amber-700/60'
                      }`}>
                        {stars} Stars & Up
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-amber-200/20 space-y-3">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-500/20"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    resetFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full bg-amber-50 hover:bg-amber-100 text-amber-700/60 hover:text-amber-700 text-sm py-3.5 rounded-xl transition-all duration-300"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;