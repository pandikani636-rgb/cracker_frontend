import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import { Star, ShieldCheck, ShoppingCart, Info, CheckCircle, Flame, Plus, Minus } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const [detailRes, reviewRes] = await Promise.all([
          axios.get(`/products/${id}`),
          axios.get(`/reviews/product/${id}`),
        ]);

        if (detailRes.data.success) {
          setProduct(detailRes.data.product);
          setRelatedProducts(detailRes.data.relatedProducts || []);
          setActiveImage(detailRes.data.product.images?.[0] || '/uploads/default-product.png');
        }

        if (reviewRes.data.success) {
          setReviews(reviewRes.data.reviews);
        }
      } catch (err) {
        console.error('Error fetching product detail page details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleQtyIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      addToast(`Only ${product.stock} items in stock.`, 'warning');
    }
  };

  const handleQtyDecrease = () => {
    setQuantity(Math.max(1, quantity - 1));
  };

  const handleAddToCartSubmit = () => {
    addToCart(product, quantity);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      return addToast('Please enter a comment', 'warning');
    }

    setSubmittingReview(true);
    try {
      const response = await axios.post('/reviews', {
        productId: product._id,
        rating,
        comment,
      });

      if (response.data.success) {
        addToast(response.data.message || 'Review added!', 'success');
        setReviews([response.data.review, ...reviews]);
        
        // update average rating local display
        const newCount = reviews.length + 1;
        const newAvg = Math.round(((reviews.reduce((acc, r) => acc + r.rating, 0) + rating) / newCount) * 10) / 10;
        setProduct(prev => ({ ...prev, rating: newAvg, numReviews: newCount }));

        setComment('');
        setRating(5);
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Review submission failed.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 text-center text-gray-400 min-h-screen">
        <h2 className="text-xl font-bold">Product not found.</h2>
        <Link to="/shop" className="text-gold mt-4 block underline">Back to Showroom</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Product Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Left: Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative pt-[80%] rounded-2xl overflow-hidden border border-white/10 bg-darkBg shadow-2xl group">
            <img
              src={activeImage}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-125 cursor-zoom-in"
            />
          </div>

          {/* Thumbnail track */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`h-16 w-20 shrink-0 rounded-lg overflow-hidden border ${
                    activeImage === img ? 'border-gold shadow-goldGlow' : 'border-white/10'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <span className="text-xs text-gold font-extrabold uppercase tracking-widest mb-1">
            {product.brand}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-3 tracking-wider uppercase">
            {product.name}
          </h1>

          {/* Rating Summary */}
          <div className="flex items-center gap-1.5 mb-6 border-b border-white/5 pb-4">
            <div className="flex text-gold">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product.rating || 0)
                      ? 'fill-gold stroke-gold'
                      : 'stroke-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-300 font-bold text-sm">{product.rating || 0}</span>
            <span className="text-gray-500 text-xs font-semibold">({product.numReviews || 0} customer reviews)</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-4 mb-6">
            {product.discount > 0 ? (
              <>
                <span className="text-3xl font-black text-glow-gold text-gold">₹{product.offerPrice}</span>
                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                <span className="bg-fire/15 border border-fire/30 text-orange-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                  Save {product.discount}%
                </span>
              </>
            ) : (
              <span className="text-3xl font-black text-white">₹{product.originalPrice}</span>
            )}
          </div>

          <p className="text-sm text-gray-400 leading-relaxed mb-6 font-light">
            {product.description}
          </p>

          {/* Core Info Badges */}
          <div className="grid grid-cols-2 gap-4 mb-8 bg-[#101116] border border-white/5 p-4 rounded-xl">
            <div className="text-xs text-gray-400">
              Availability:{' '}
              {product.stock > 0 ? (
                <span className="text-green-400 font-bold inline-flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> In Stock ({product.stock} units)
                </span>
              ) : (
                <span className="text-red-400 font-bold">Out Of Stock</span>
              )}
            </div>
            <div className="text-xs text-gray-400">
              Tax Classification: <span className="text-gold font-semibold">{product.gst}% GST Added</span>
            </div>
            <div className="text-xs text-gray-400 col-span-2 border-t border-white/5 pt-2 flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-fire shrink-0" />
              <span>Sivakasi Premium Quality Firecrackers. Standard transit laws apply.</span>
            </div>
          </div>

          {/* Add to Cart Actions */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-8">
              {/* Qty Selector */}
              <div className="flex items-center border border-white/10 bg-[#0e0f13] rounded-full px-3 py-1.5">
                <button
                  onClick={handleQtyDecrease}
                  className="p-1 hover:text-gold transition-colors focus:outline-none"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                <button
                  onClick={handleQtyIncrease}
                  className="p-1 hover:text-gold transition-colors focus:outline-none"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={handleAddToCartSubmit}
                className="flex-grow btn-glow-gold text-white font-extrabold text-sm py-3.5 px-8 rounded-full border border-gold/30 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-4.5 w-4.5" /> Add To Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <section className="mb-20">
        <h2 className="text-xl sm:text-2xl font-extrabold uppercase text-white mb-6 tracking-wide">
          Customer <span className="text-gold">Reviews</span> ({reviews.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Review form */}
          <div className="md:col-span-1 glass-panel p-6 rounded-2xl border border-white/5 self-start shadow-glass">
            <h3 className="font-extrabold text-sm text-gold uppercase tracking-wider mb-4">Write a Review</h3>
            {user ? (
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                {/* Rating selection */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Your Rating</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="text-lg focus:outline-none"
                      >
                        <Star className={`h-5 w-5 ${star <= rating ? 'fill-gold stroke-gold' : 'stroke-gray-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Box */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Your Comment</label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you think of this cracker..."
                    className="w-full bg-[#121318] border border-white/10 rounded-lg p-3 text-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-gradient-to-r from-fire to-gold text-white text-xs font-bold py-2.5 rounded-full shadow-goldGlow"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-gray-500 mb-3">Please login to write reviews.</p>
                <Link
                  to="/login"
                  className="inline-block bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold text-[10px] font-bold rounded-full py-1.5 px-4"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {reviews.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl text-center border border-white/5">
                <p className="text-sm text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-200">{rev.userName}</span>
                    <span className="text-[10px] text-gray-500">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex text-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-gold stroke-gold' : 'stroke-gray-600'}`} />
                      ))}
                    </div>
                    {rev.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-0.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-bold px-2 py-0.5 rounded-full">
                        <ShieldCheck className="h-3 w-3" /> Verified Purchase
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 font-light mt-1 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="border-t border-white/5 pt-12 mb-8 flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-extrabold uppercase text-white tracking-wide">
              Related <span className="text-gold">Products</span>
            </h2>
            <Link to="/shop" className="text-xs text-gold hover:underline">View All</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
