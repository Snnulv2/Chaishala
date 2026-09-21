import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import { Link } from 'react-router-dom'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1400&q=85',
    title: 'Discover the Finest Assam Teas',
    subtitle: 'Rich, bold & malty — straight from the gardens of Brahmaputra valley',
    cta: 'Shop Assam Tea',
    tag: '🌿 Black Tea Collection',
  },
  {
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1400&q=85',
    title: 'Pure Himalayan Green Tea',
    subtitle: 'Light, fresh & full of antioxidants. Your daily wellness ritual.',
    cta: 'Explore Green Teas',
    tag: '💚 Green Tea Collection',
  },
  {
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=1400&q=85',
    title: 'Authentic Masala Chai',
    subtitle: 'The soul of India in every cup — spiced, aromatic & heartwarming',
    cta: 'Try Masala Chai',
    tag: '🫚 Chai Collection',
  },
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85',
    title: 'Darjeeling First Flush',
    subtitle: 'The champagne of teas — delicate floral notes from the first spring harvest',
    cta: 'Order Darjeeling',
    tag: '⭐ Premium Collection',
  },
  {
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1400&q=85',
    title: 'Kashmiri Kahwa & Rare Whites',
    subtitle: 'Saffron, almonds & rose petals — a cup of royal Kashmir',
    cta: 'View Specialty Teas',
    tag: '✨ Specialty Collection',
  },
]

export default function TeaSlideshow() {
  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="h-[520px] sm:h-[620px]"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
                  <div className="max-w-xl animate-fade-in">
                    <span className="inline-block bg-tea-700/80 backdrop-blur-sm text-chai-cream text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wider uppercase">
                      {slide.tag}
                    </span>
                    <h2 className="text-white font-display text-3xl sm:text-5xl font-bold leading-tight mb-4 drop-shadow-lg">
                      {slide.title}
                    </h2>
                    <p className="text-tea-200 text-base sm:text-lg mb-8 leading-relaxed max-w-md">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link to="/menu" className="bg-tea-700 hover:bg-tea-600 text-white font-semibold px-7 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl">
                        {slide.cta}
                      </Link>
                      <Link to="/menu" className="border-2 border-white/70 text-white hover:bg-white/10 font-semibold px-7 py-3 rounded-xl transition-all backdrop-blur-sm">
                        View All Teas
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Decorative steam animation */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-chai-light to-transparent z-10 pointer-events-none" />
    </div>
  )
}
