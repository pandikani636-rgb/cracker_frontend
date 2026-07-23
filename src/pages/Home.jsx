import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import CanvasFireworks from '../components/CanvasFireworks';
import ProductCard from '../components/ProductCard';
import { 
  Sparkles, ShieldCheck, Truck, Zap, Star, ArrowRight, 
  Flame, Gift, Clock, Crown, Gem, Award, Rocket, 
  PartyPopper, Music, Sun, Moon, Diamond, Heart, 
  ChevronRight, BadgeCheck, Medal, Sparkle, Layers,
  Palette, Compass, Target, Users, TrendingUp, Coffee,
  ChevronLeft, ChevronRight as ChevronRightIcon
} from 'lucide-react';

// Custom Cracker Animations Component
const CrackerAnimations = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle classes for different cracker types
    class SparklerParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 4;
        this.speedY = (Math.random() - 0.5) * 4 - 2;
        this.life = 1;
        this.decay = Math.random() * 0.015 + 0.005;
        this.color = `hsl(${Math.random() * 60 + 20}, 100%, ${Math.random() * 30 + 50}%)`;
        this.trail = [];
        this.maxTrail = 8;
      }

      update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrail) {
          this.trail.shift();
        }
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.05;
        this.life -= this.decay;
        this.size *= 0.99;
      }

      draw(ctx) {
        for (let i = 0; i < this.trail.length; i++) {
          const opacity = (i / this.trail.length) * this.life * 0.5;
          ctx.beginPath();
          ctx.arc(this.trail[i].x, this.trail[i].y, this.size * (i / this.trail.length), 0, Math.PI * 2);
          ctx.fillStyle = this.color.replace(')', `, ${opacity})`).replace('hsl', 'hsla');
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    class RocketParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 2;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.color = `hsl(${Math.random() * 360}, 100%, ${Math.random() * 30 + 50}%)`;
        this.gravity = 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
        this.speedX *= 0.99;
        this.speedY *= 0.99;
        this.life -= this.decay;
        this.size *= 0.99;
      }

      draw(ctx) {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.shadowBlur = 30;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    class FlowerPotParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 1;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed - 2;
        this.size = Math.random() * 5 + 2;
        this.life = 1;
        this.decay = Math.random() * 0.01 + 0.005;
        this.hue = Math.random() * 60 + 20;
        this.saturation = 100;
        this.lightness = Math.random() * 30 + 50;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.05;
        this.speedX *= 0.99;
        this.life -= this.decay;
        this.rotation += this.rotationSpeed;
        this.size *= 0.998;
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        const opacity = this.life;
        ctx.fillStyle = `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
        ctx.globalAlpha = opacity;
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          ctx.beginPath();
          ctx.ellipse(
            Math.cos(angle) * this.size,
            Math.sin(angle) * this.size,
            this.size * 0.6,
            this.size * 0.4,
            angle,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue + 30}, 100%, 70%)`;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
      }
    }

    class GroundWheelParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 30 + 10;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.05 + 0.02;
        this.size = Math.random() * 4 + 1;
        this.life = 1;
        this.decay = Math.random() * 0.01 + 0.005;
        this.hue = Math.random() * 60 + 20;
        this.spiral = 0;
      }

      update() {
        this.angle += this.speed;
        this.spiral += 0.01;
        this.radius *= 0.998;
        this.life -= this.decay;
        this.size *= 0.998;
      }

      draw(ctx) {
        const x = this.x + Math.cos(this.angle + this.spiral) * this.radius;
        const y = this.y + Math.sin(this.angle * 2 + this.spiral) * this.radius * 0.5;
        const opacity = this.life;
        ctx.globalAlpha = opacity;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.size * 3);
        gradient.addColorStop(0, `hsl(${this.hue}, 100%, 80%)`);
        gradient.addColorStop(1, `hsl(${this.hue + 30}, 100%, 50%)`);
        ctx.beginPath();
        ctx.arc(x, y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue + 60}, 100%, 90%)`;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }

    let particles = [];
    let time = 0;
    const crackerTypes = ['sparkler', 'rocket', 'flowerpot', 'groundwheel'];

    const createCrackerBurst = (type, x, y) => {
      const count = type === 'rocket' ? 80 : type === 'flowerpot' ? 40 : type === 'groundwheel' ? 30 : 25;
      for (let i = 0; i < count; i++) {
        let particle;
        switch(type) {
          case 'rocket':
            particle = new RocketParticle(x, y);
            break;
          case 'flowerpot':
            particle = new FlowerPotParticle(x, y);
            break;
          case 'groundwheel':
            particle = new GroundWheelParticle(x, y);
            break;
          default:
            particle = new SparklerParticle(x, y);
        }
        particles.push(particle);
      }
    };

    const spawnRandomCracker = () => {
      const type = crackerTypes[Math.floor(Math.random() * crackerTypes.length)];
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.6;
      createCrackerBurst(type, x, y);
    };

    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        spawnRandomCracker();
      }, i * 300);
    }

    const animate = () => {
      time++;
      ctx.fillStyle = 'rgba(26, 14, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (time % 30 === 0 && particles.length < 200) {
        spawnRandomCracker();
      }
      if (time % 60 === 0) {
        const x = Math.random() * canvas.width * 0.6 + canvas.width * 0.2;
        const y = Math.random() * canvas.height * 0.3 + canvas.height * 0.1;
        createCrackerBurst('rocket', x, y);
      }
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.life <= 0 || p.size < 0.1) {
          if (p instanceof RocketParticle && p.life < 0.3 && Math.random() < 0.05) {
            createCrackerBurst('sparkler', p.x, p.y);
          }
          particles.splice(i, 1);
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

// Image Slider Component
const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderImages = [
    {
      url: 'https://images.unsplash.com/photo-1545624446-43a72929a033?w=1920&q=80',
      alt: 'Sparklers Celebration'
    },
    {
      url: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=1920&q=80',
      alt: 'Ground Wheels Display'
    },
    {
      url: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=1920&q=80',
      alt: 'Flower Pots Show'
    },
    {
      url: 'https://images.unsplash.com/photo-1531266752426-aad472b7bbf4?w=1920&q=80',
      alt: 'Rockets Launch'
    },
    {
      url: 'https://images.unsplash.com/photo-1545624446-43a72929a033?w=1920&q=80',
      alt: 'Fireworks Display'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${sliderImages[currentIndex].url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        </motion.div>
      </AnimatePresence>

      {/* Slider Controls - Bigger */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white p-4 rounded-full border border-white/10 transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="h-7 w-7" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white p-4 rounded-full border border-white/10 transition-all duration-300 hover:scale-110"
      >
        <ChevronRightIcon className="h-7 w-7" />
      </button>

      {/* Slider Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentIndex 
                ? 'w-10 h-2.5 bg-amber-400 shadow-lg shadow-amber-400/50' 
                : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'
            } rounded-full`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-8 z-10 text-white/40 text-sm font-light backdrop-blur-sm bg-black/20 px-5 py-2.5 rounded-full border border-white/5">
        {currentIndex + 1} / {sliderImages.length}
      </div>
    </div>
  );
};

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const calculateTimeLeft = () => {
    const difference = +new Date("2026-11-09T00:00:00+05:30") - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get('/categories'),
          axios.get('/products?limit=8'),
        ]);

        if (catRes.data.success) setCategories(catRes.data.categories);
        if (prodRes.data.success) setFeaturedProducts(prodRes.data.products);
      } catch (err) {
        console.error('Error fetching home data, using placeholders.');
        setCategories([
          { _id: '1', name: 'Sparklers', image: 'https://images.unsplash.com/photo-1545624446-43a72929a033?w=400&q=80' },
          { _id: '2', name: 'Ground Wheels', image: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=400&q=80' },
          { _id: '3', name: 'Flower Pots', image: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=400&q=80' },
          { _id: '4', name: 'Rockets', image: 'https://images.unsplash.com/photo-1531266752426-aad472b7bbf4?w=400&q=80' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative overflow-x-hidden bg-[#f8f6f1]">
      {/* HERO SECTION with Image Slider and Cracker Animations */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Image Slider Background */}
        <ImageSlider />
        
        {/* Custom Cracker Animations */}
        <CrackerAnimations />
        
        {/* Canvas Fireworks overlay */}
        <CanvasFireworks />
        
        {/* Gradient Overlays for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a0e0a]/95 z-1" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/30 z-1" />
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 mt-16 select-none">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-8 py-3.5 mb-8 shadow-xl shadow-black/30">
              <Sparkle className="h-5 w-5 text-amber-300 animate-pulse" />
              <span className="text-amber-100/90 text-sm font-medium tracking-[0.2em] uppercase">
                Since 1985 — Crafting Celebrations
              </span>
              <Sparkle className="h-5 w-5 text-amber-300 animate-pulse" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-7xl md:text-8xl font-light tracking-tight text-white mb-6 leading-[1.05]"
          >
            <span className="font-serif italic text-amber-200/80">Illuminate</span>
            <br />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200">
              Every Moment
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-xl text-amber-100/70 max-w-2xl mx-auto mb-12 leading-relaxed font-light tracking-wide"
          >
            Premium fireworks from the heart of Sivakasi — where tradition meets 
            innovation in every spark, crackle, and burst of color.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-5 justify-center pointer-events-auto"
          >
            <Link
              to="/shop"
              className="group relative bg-gradient-to-r from-amber-200 to-amber-300 text-[#1a0e0a] font-semibold text-base px-14 py-5 rounded-full flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-200/40"
            >
              <span>Explore Collection</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/shop?filter=featured"
              className="bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white border border-white/20 hover:border-amber-200/50 font-medium text-base px-12 py-5 rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-amber-200/20"
            >
              <span className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-300" />
                Featured Selection
              </span>
            </Link>
          </motion.div>

          {/* Elegant Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 flex flex-wrap justify-center gap-10 text-sm"
          >
            <div className="flex items-center gap-2.5 text-amber-200/60">
              <BadgeCheck className="h-5 w-5 text-amber-300" />
              <span>Premium Quality</span>
            </div>
            <div className="flex items-center gap-2.5 text-amber-200/60">
              <ShieldCheck className="h-5 w-5 text-amber-300" />
              <span>Safety Certified</span>
            </div>
            <div className="flex items-center gap-2.5 text-amber-200/60">
              <Truck className="h-5 w-5 text-amber-300" />
              <span>Express Delivery</span>
            </div>
            <div className="flex items-center gap-2.5 text-amber-200/60">
              <Heart className="h-5 w-5 text-amber-300" />
              <span>10K+ Happy Customers</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FESTIVAL COUNTDOWN - Elegant Warm Section */}
      <section className="relative py-16 bg-gradient-to-r from-[#f5ede4] via-[#fff8f0] to-[#f5ede4] border-y border-amber-200/20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,150,100,0.05)_0%,transparent_70%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="p-5 bg-gradient-to-br from-amber-100/50 to-amber-50/30 rounded-2xl border border-amber-200/30 shadow-lg shadow-amber-200/10">
              <Gift className="h-12 w-12 text-amber-700" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-light text-[#1a0e0a] tracking-wide flex items-center gap-3">
                <span className="font-serif italic text-amber-600">Festival</span>
                <span className="font-semibold">Countdown</span>
                <span className="text-sm font-medium bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full">Live</span>
              </h2>
              <p className="text-sm text-amber-700/60 mt-1 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                Diwali 2026 — Order early for guaranteed delivery
              </p>
            </div>
          </div>

          {/* Elegant Countdown */}
          <div className="flex gap-4 sm:gap-6 items-center">
            {Object.keys(timeLeft).map((interval) => (
              <div key={interval} className="flex flex-col items-center">
                <div className="bg-white/80 backdrop-blur-xl border border-amber-200/30 rounded-2xl h-20 sm:h-24 w-20 sm:w-24 flex items-center justify-center text-3xl sm:text-4xl font-light text-[#1a0e0a] shadow-lg shadow-amber-200/10">
                  {timeLeft[interval] !== undefined ? String(timeLeft[interval]).padStart(2, '0') : '00'}
                </div>
                <span className="text-[11px] text-amber-700/50 uppercase tracking-[0.2em] mt-2 font-medium">{interval}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES - Professional Grid with Warm Tones */}
      <section className="py-28 max-w-7xl mx-auto px-4 relative z-10 bg-[#f8f6f1]">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-amber-50/50 px-5 py-2 rounded-full border border-amber-200/20 mb-4">
              <Compass className="h-4 w-4 text-amber-600" />
              <span className="text-amber-700 text-sm font-medium tracking-[0.2em] uppercase">Collections</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-light text-[#1a0e0a] mt-3">
              Browse By{' '}
              <span className="font-serif italic text-amber-600">Category</span>
            </h2>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto mt-4" />
            <p className="text-amber-700/50 mt-4 text-sm font-light">Discover our curated collection of premium fireworks</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group relative rounded-2xl overflow-hidden bg-white shadow-lg shadow-amber-900/5 border border-amber-200/20 hover:border-amber-300/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-900/10"
            >
              <Link to={`/shop?category=${encodeURIComponent(cat.name)}`}>
                <div className="relative pt-[130%]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.85] group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0e0a]/90 via-[#1a0e0a]/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="transform group-hover:translate-y-[-4px] transition-transform duration-300">
                      <h3 className="font-serif text-2xl text-white group-hover:text-amber-200 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-amber-200/50 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                        Explore <ChevronRight className="h-3 w-3" />
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-amber-200/30 rounded-full px-4 py-1.5 text-xs font-medium text-amber-700 shadow-lg">
                  {index === 0 ? '⭐ Featured' : '✨ Premium'}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TOP SELLING - Professional Light Section */}
      <section className="py-28 bg-gradient-to-b from-[#f8f6f1] via-white to-[#f8f6f1] relative z-10">
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-amber-50/50 px-5 py-2 rounded-full border border-amber-200/20 mb-4">
                <TrendingUp className="h-4 w-4 text-amber-600" />
                <span className="text-amber-700 text-sm font-medium tracking-[0.2em] uppercase">Bestsellers</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-light text-[#1a0e0a] mt-3">
                Top Selling{' '}
                <span className="font-serif italic text-amber-600">Crackers</span>
              </h2>
              <p className="text-amber-700/50 mt-3 text-sm font-light">Most requested fireworks this season</p>
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto mt-4" />
            </motion.div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-amber-200 border-t-amber-600" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Flame className="h-8 w-8 text-amber-600 animate-pulse" />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.map((prod, idx) => (
                <motion.div
                  key={prod._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="group"
                >
                  <div className="bg-white shadow-lg shadow-amber-900/5 border border-amber-200/20 hover:border-amber-300/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-amber-900/10 hover:-translate-y-2">
                    <ProductCard product={prod} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 bg-white hover:bg-amber-50 text-[#1a0e0a] border border-amber-200/30 hover:border-amber-300/50 rounded-full px-12 py-5 text-base font-medium transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/10"
            >
              View Full Collection <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US - Professional 3-Column */}
      <section className="py-28 max-w-7xl mx-auto px-4 relative z-10 bg-[#f8f6f1]">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-amber-50/50 px-5 py-2 rounded-full border border-amber-200/20 mb-4">
              <Target className="h-4 w-4 text-amber-600" />
              <span className="text-amber-700 text-sm font-medium tracking-[0.2em] uppercase">Why Choose Us</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-light text-[#1a0e0a] mt-3">
              The{' '}
              <span className="font-serif italic text-amber-600">Sivakasi</span> Standard
            </h2>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto mt-4" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative bg-white shadow-lg shadow-amber-900/5 p-10 rounded-2xl border border-amber-200/20 hover:border-amber-300/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-900/10 text-center"
          >
            <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200/30 inline-block mb-6 group-hover:scale-105 transition-transform duration-300">
              <ShieldCheck className="h-12 w-12 text-amber-600" />
            </div>
            <h3 className="font-serif text-2xl text-[#1a0e0a] mb-3">Certified Safety</h3>
            <p className="text-amber-700/60 text-sm leading-relaxed font-light">
              Rigorously tested for shell thickness, stability, and child-safe thermal thresholds — industry certified.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative bg-white shadow-lg shadow-amber-900/5 p-10 rounded-2xl border border-amber-200/20 hover:border-amber-300/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-900/10 text-center"
          >
            <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-200/30 inline-block mb-6 group-hover:scale-105 transition-transform duration-300">
              <Palette className="h-12 w-12 text-orange-600" />
            </div>
            <h3 className="font-serif text-2xl text-[#1a0e0a] mb-3">Brilliant Effects</h3>
            <p className="text-amber-700/60 text-sm leading-relaxed font-light">
              High-grade compositions deliver vibrant colors, clear sparkles, and spectacular long-duration displays.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group relative bg-white shadow-lg shadow-amber-900/5 p-10 rounded-2xl border border-amber-200/20 hover:border-amber-300/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-900/10 text-center"
          >
            <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-200/30 inline-block mb-6 group-hover:scale-105 transition-transform duration-300">
              <Truck className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="font-serif text-2xl text-[#1a0e0a] mb-3">Express Delivery</h3>
            <p className="text-amber-700/60 text-sm leading-relaxed font-light">
              Specialized logistics with secure packaging, real-time tracking, and full compliance with safety laws.
            </p>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS - Professional Light Cards */}
      <section className="py-28 bg-gradient-to-b from-[#f8f6f1] via-white to-[#f8f6f1] relative z-10 border-t border-amber-200/20">
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-amber-50/50 px-5 py-2 rounded-full border border-amber-200/20 mb-4">
                <Users className="h-4 w-4 text-amber-600" />
                <span className="text-amber-700 text-sm font-medium tracking-[0.2em] uppercase">Testimonials</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-light text-[#1a0e0a] mt-3">
                What Our{' '}
                <span className="font-serif italic text-amber-600">Customers</span> Say
              </h2>
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto mt-4" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative bg-white shadow-lg shadow-amber-900/5 p-8 rounded-2xl border border-amber-200/20 hover:border-amber-300/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-900/10"
            >
              <div className="flex text-amber-400 mb-5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-amber-400 stroke-amber-400" />)}
              </div>
              <p className="text-[#1a0e0a]/70 text-base italic leading-relaxed mb-6">
                "The Aerial Shells 120 shots were the absolute highlight of our wedding. Smooth ignition and high-altitude colorful display. 10/10!"
              </p>
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-amber-100 rounded-full flex items-center justify-center font-serif text-amber-700 border border-amber-200/30 text-lg">
                  RS
                </div>
                <div>
                  <h4 className="font-medium text-[#1a0e0a] text-base">Rahul Sharma</h4>
                  <span className="text-xs text-amber-700/50">Verified Buyer, Delhi</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative bg-white shadow-lg shadow-amber-900/5 p-8 rounded-2xl border border-amber-200/20 hover:border-amber-300/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-900/10"
            >
              <div className="flex text-amber-400 mb-5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-amber-400 stroke-amber-400" />)}
              </div>
              <p className="text-[#1a0e0a]/70 text-base italic leading-relaxed mb-6">
                "Ordered the Sparklers and Flower Pots combo for my kids. The low-smoke sparklers are genuinely fantastic, very bright and burn slow."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-orange-100 rounded-full flex items-center justify-center font-serif text-orange-700 border border-orange-200/30 text-lg">
                  PP
                </div>
                <div>
                  <h4 className="font-medium text-[#1a0e0a] text-base">Priya Patel</h4>
                  <span className="text-xs text-amber-700/50">Verified Buyer, Mumbai</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group relative bg-white shadow-lg shadow-amber-900/5 p-8 rounded-2xl border border-amber-200/20 hover:border-amber-300/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-900/10"
            >
              <div className="flex text-amber-400 mb-5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-amber-400 stroke-amber-400" />)}
              </div>
              <p className="text-[#1a0e0a]/70 text-base italic leading-relaxed mb-6">
                "Incredible customer support. There was a tracking delay, but their team handled it immediately and the package arrived securely."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center font-serif text-blue-700 border border-blue-200/30 text-lg">
                  MR
                </div>
                <div>
                  <h4 className="font-medium text-[#1a0e0a] text-base">Michael R.</h4>
                  <span className="text-xs text-amber-700/50">Verified Buyer, Bangalore</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FINAL CTA - Professional Elegant Banner */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#1a0e0a] via-[#2d1810] to-[#1a0e0a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,150,100,0.05)_0%,transparent_70%)]" />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c4a882' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 mb-6">
              <PartyPopper className="h-5 w-5 text-amber-300" />
              <span className="text-amber-200/60 text-sm font-medium tracking-[0.2em] uppercase">Limited Time</span>
            </div>
            
            <h2 className="text-4xl sm:text-6xl font-light text-white mb-4 leading-[1.1]">
              <span className="font-serif italic text-amber-200/60">Ready to</span>
              <br />
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200">
                Celebrate
              </span>
              <span className="text-white">?</span>
            </h2>
            <p className="text-amber-100/50 text-base mb-10 max-w-xl mx-auto leading-relaxed font-light">
              Join thousands of happy customers who trust us for their celebration needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-200 to-amber-300 text-[#1a0e0a] font-semibold text-base px-14 py-5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-200/30"
              >
                <Sparkle className="h-5 w-5" />
                Shop Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl hover:bg-white/10 text-white border border-white/10 hover:border-amber-200/40 px-12 py-5 rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-amber-200/10 text-base"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;