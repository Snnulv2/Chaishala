import { Link } from 'react-router-dom'
import { GiTeapot } from 'react-icons/gi'
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-tea-900 text-tea-200 pt-12 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <GiTeapot className="text-chai-cream text-3xl" />
              <div>
                <span className="text-chai-cream font-display text-xl font-bold">Chaishala</span>
                <span className="text-tea-400 text-xs block">Premium Tea Shop</span>
              </div>
            </div>
            <p className="text-tea-400 text-sm leading-relaxed max-w-xs">
              Bringing you the finest teas from the gardens of Assam, Darjeeling, Kashmir and beyond. 
              Every sip tells a story of tradition and quality.
            </p>
            <div className="flex gap-4 mt-5">
              <a href="#" className="text-tea-400 hover:text-chai-cream transition-colors"><FiFacebook size={20} /></a>
              <a href="#" className="text-tea-400 hover:text-chai-cream transition-colors"><FiInstagram size={20} /></a>
              <a href="#" className="text-tea-400 hover:text-chai-cream transition-colors"><FiTwitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-chai-cream font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/menu', 'Our Teas'], ['/cart', 'Cart'], ['/my-orders', 'My Orders']].map(([path, label]) => (
                <li key={path}>
                  <Link to={path} className="text-tea-400 hover:text-chai-cream transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-chai-cream font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-tea-400">
                <FiMail size={16} className="flex-shrink-0" />
                <span>hello@chaishala.com</span>
              </li>
              <li className="flex items-center gap-2 text-tea-400">
                <FiPhone size={16} className="flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2 text-tea-400">
                <FiMapPin size={16} className="flex-shrink-0 mt-0.5" />
                <span>123 Tea Garden Road, Darjeeling, West Bengal 734101</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-tea-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-tea-500 text-sm">© {new Date().getFullYear()} Chaishala. All rights reserved.</p>
          <p className="text-tea-500 text-sm">Made with 🍵 in India</p>
        </div>
      </div>
    </footer>
  )
}
