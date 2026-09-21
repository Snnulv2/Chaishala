import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import TeaSlideshow from '../components/TeaSlideshow'
import TeaCard from '../components/TeaCard'
import { FiArrowRight, FiTruck, FiAward, FiRefreshCw } from 'react-icons/fi'
import { GiTeapot, GiLeafSwirl, GiCoffeeCup } from 'react-icons/gi'

const features = [
  { icon: <FiTruck size={28} />, title: 'Free Shipping', desc: 'On orders above ₹499', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: <FiAward size={28} />, title: '100% Authentic', desc: 'Direct from tea gardens', color: 'text-tea-700', bg: 'bg-tea-50' },
  { icon: <GiLeafSwirl size={28} />, title: 'Fresh & Pure', desc: 'No preservatives, no additives', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: <FiRefreshCw size={28} />, title: 'Easy Returns', desc: '7-day return policy', color: 'text-blue-600', bg: 'bg-blue-50' },
]

const categories = [
  { name: 'Black Tea', slug: 'black-tea', emoji: '🫖', color: 'from-amber-800 to-amber-600' },
  { name: 'Green Tea', slug: 'green-tea', emoji: '🍃', color: 'from-green-700 to-green-500' },
  { name: 'Masala Chai', slug: 'masala-chai', emoji: '🌶️', color: 'from-orange-700 to-orange-500' },
  { name: 'Herbal Tea', slug: 'herbal-tea', emoji: '🌸', color: 'from-pink-700 to-pink-500' },
  { name: 'Darjeeling', slug: 'darjeeling', emoji: '⛰️', color: 'from-teal-700 to-teal-500' },
  { name: 'Specialty', slug: 'specialty', emoji: '✨', color: 'from-purple-700 to-purple-500' },
]

export default function Home() {
  const [featuredTeas, setFeaturedTeas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/teas?featured=true')
      .then(({ data }) => {
        if (data.success) setFeaturedTeas(data.teas.slice(0, 4))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="animate-fade-in">
      {/* Slideshow */}
      <TeaSlideshow />

      {/* Features Bar */}
      <section className="bg-tea-800 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-center justify-center md:justify-start">
                <div className={`${f.bg} ${f.color} p-2.5 rounded-xl`}>{f.icon}</div>
                <div className="text-left">
                  <p className="text-chai-cream font-semibold text-sm">{f.title}</p>
                  <p className="text-tea-400 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-tea-500 text-sm font-semibold uppercase tracking-widest">Browse by Type</span>
          <h2 className="font-display text-3xl sm:text-4xl text-tea-800 font-bold mt-2">Explore Tea Categories</h2>
          <div className="flex justify-center mt-3 gap-1">
            <span className="w-8 h-1 bg-tea-700 rounded-full" />
            <span className="w-3 h-1 bg-tea-400 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              to={`/menu?category=${cat.slug}`}
              className={`bg-gradient-to-br ${cat.color} rounded-2xl p-5 text-center text-white hover:scale-105 hover:shadow-xl transition-all duration-300 group`}
            >
              <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">{cat.emoji}</span>
              <span className="font-semibold text-sm leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Teas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-tea-500 text-sm font-semibold uppercase tracking-widest">Best Sellers</span>
              <h2 className="font-display text-3xl sm:text-4xl text-tea-800 font-bold mt-2">Featured Teas</h2>
              <div className="flex mt-3 gap-1">
                <span className="w-8 h-1 bg-tea-700 rounded-full" />
                <span className="w-3 h-1 bg-tea-400 rounded-full" />
              </div>
            </div>
            <Link to="/menu" className="hidden sm:flex items-center gap-2 text-tea-700 hover:text-tea-900 font-semibold transition-colors">
              View All <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-chai-cream rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTeas.map(tea => <TeaCard key={tea.id} tea={tea} />)}
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
              View All Teas <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Tea Story Section */}
      <section className="py-20 bg-tea-pattern bg-chai-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-tea-500 text-sm font-semibold uppercase tracking-widest">Our Story</span>
              <h2 className="font-display text-3xl sm:text-4xl text-tea-800 font-bold mt-2 mb-6">
                From Garden to Your Cup
              </h2>
              <p className="text-tea-700 leading-relaxed mb-4">
                At Chaishala, we believe that every cup of tea is a journey. We source our teas directly from the finest gardens across India — the rolling hills of Darjeeling, the lush valleys of Assam, and the pristine gardens of Kashmir.
              </p>
              <p className="text-tea-700 leading-relaxed mb-6">
                Our expert tea masters carefully select each batch to ensure you receive only the most flavorful, aromatic, and authentic teas, preserving centuries-old traditions in every sip.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[['500+', 'Tea Varieties'], ['10K+', 'Happy Customers'], ['15+', 'Years of Expertise']].map(([num, label]) => (
                  <div key={label} className="text-center p-4 bg-white rounded-xl shadow-sm border border-tea-100">
                    <p className="text-2xl font-bold text-tea-700 font-display">{num}</p>
                    <p className="text-xs text-tea-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>
              <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
                Shop Now <FiArrowRight />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=700&q=85"
                alt="Tea preparation"
                className="rounded-3xl shadow-2xl w-full object-cover h-96"
              />
              <div className="absolute -bottom-6 -left-6 bg-tea-700 text-white p-5 rounded-2xl shadow-xl">
                <GiTeapot size={36} className="text-chai-cream mb-1" />
                <p className="font-display text-lg font-bold">Premium Quality</p>
                <p className="text-tea-300 text-xs">Handpicked &amp; curated</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-tea-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl text-chai-cream font-bold mb-10">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Priya S.', text: 'The Masala Chai Mix is absolutely divine! It takes me back to my grandmother\'s kitchen. Will order again!', rating: 5 },
              { name: 'Rahul M.', text: 'Darjeeling First Flush is worth every penny. The delicate floral notes are unmatched. Excellent packaging too!', rating: 5 },
              { name: 'Sneha K.', text: 'Fast delivery and the Kashmiri Kahwa is incredible. The aroma alone is therapeutic. Highly recommended!', rating: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-tea-700 rounded-2xl p-6 text-left">
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, j) => <span key={j} className="text-chai-gold">⭐</span>)}
                </div>
                <p className="text-tea-200 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <p className="text-chai-cream font-semibold text-sm">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 hero-gradient text-white">
        <div className="max-w-3xl mx-auto text-center px-4">
          <GiCoffeeCup size={56} className="mx-auto mb-4 text-chai-cream opacity-80" />
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Start Your Tea Journey Today</h2>
          <p className="text-tea-200 mb-8 text-lg">Explore over 12 varieties of premium Indian teas. Free shipping on orders above ₹499!</p>
          <Link to="/menu" className="bg-chai-cream text-tea-900 hover:bg-white font-bold px-10 py-4 rounded-2xl text-lg transition-all shadow-xl hover:shadow-2xl inline-block">
            Shop All Teas
          </Link>
        </div>
      </section>
    </div>
  )
}
