import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Percent } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevents navigating to product detail
    addToCart(product, 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="glass-card rounded-2xl overflow-hidden shadow-glass group relative flex flex-col h-full"
    >
      {/* Product Image Panel */}
      <div className="relative pt-[80%] overflow-hidden bg-darkBg">
        <img
          src={product.images?.[0] || '/uploads/default-product.png'}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discount > 0 && (
            <span className="flex items-center gap-0.5 bg-gradient-to-r from-fire to-crimson text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
              <Percent className="h-2.5 w-2.5" /> {product.discount}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-gold text-darkBg text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg self-start">
              Featured
            </span>
          )}
        </div>

        {/* Quick Add To Cart Hover Button */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-gradient-to-r from-fire to-gold text-white font-extrabold text-xs py-2.5 px-5 rounded-full shadow-goldGlow hover:scale-105 transition-all"
          >
            <ShoppingCart className="h-4 w-4" /> Add To Cart
          </button>
        </div>
      </div>

      {/* Card Details Content */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-[10px] text-gold font-bold tracking-widest uppercase mb-1">{product.brand}</span>
        
        <Link to={`/product/${product._id}`} className="hover:text-gold transition-colors flex-grow">
          <h3 className="font-bold text-base text-gray-100 line-clamp-1 mb-2 group-hover:text-glow-gold transition-all duration-300">
            {product.name}
          </h3>
        </Link>

        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-4">
          <div className="flex text-gold">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.round(product.rating || 0)
                    ? 'fill-gold stroke-gold'
                    : 'stroke-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-gray-500 text-xs font-semibold">({product.numReviews || 0})</span>
        </div>

        {/* Pricing & Cart Button */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-col">
            {product.discount > 0 ? (
              <>
                <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                <span className="text-lg font-black text-glow-gold text-gold">₹{product.offerPrice}</span>
              </>
            ) : (
              <span className="text-lg font-black text-gray-100">₹{product.originalPrice}</span>
            )}
          </div>

          <Link
            to={`/product/${product._id}`}
            className="text-xs font-bold text-gray-400 group-hover:text-gold transition-colors py-1 px-3 border border-white/5 group-hover:border-gold/30 rounded-full"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
