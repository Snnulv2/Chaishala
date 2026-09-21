import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import TeaCard from '../components/TeaCard'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'
import { GiLeafSwirl } from 'react-icons/gi'

export default function Menu() {
  const [teas, setTeas] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')
  const selectedCategory = searchParams.get('category') || ''

  useEffect(() => {
    axios.get('/api/teas/categories').then(({ data }) => {
      if (data.success) setCategories(data.categories)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (selectedCategory) params.set('category', selectedCategory)
    if (search) params.set('search', search)
    if (sort !== 'default') params.set('sort', sort)

    axios.get(`/api/teas?${params.toString()}`)
      .then(({ data }) => {
        if (data.success) setTeas(data.teas)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [selectedCategory, search, sort])

  const setCategory = (cat) => {
    const newParams = new URLSearchParams(searchParams)
    if (cat) newParams.set('category', cat)
    else newParams.delete('category')
    setSearchParams(newParams)
  }

  return (
    <div className="min-h-screen bg-chai-light">
      {/* Header Banner */}
      <div className="bg-tea-800 py-12 text-center">
        <GiLeafSwirl className="text-chai-cream text-5xl mx-auto mb-3" />
        <h1 className="font-display text-4xl sm:text-5xl text-chai-cream font-bold">Our Tea Collection</h1>
        <p className="text-tea-300 mt-2 text-lg">Premium teas sourced directly from Indian gardens</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-tea-100 p-5 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tea-400" size={18} />
              <input
                type="text"
                placeholder="Search teas..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-tea-200 rounded-xl focus:outline-none focus:border-tea-500 text-tea-800 bg-chai-light"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-tea-400 hover:text-tea-700">
                  <FiX size={16} />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <FiFilter className="text-tea-500" size={16} />
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="border border-tea-200 rounded-xl px-3 py-2.5 text-tea-700 bg-chai-light focus:outline-none focus:border-tea-500 text-sm"
              >
                <option value="default">Sort: Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Best Rated</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setCategory('')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!selectedCategory ? 'bg-tea-700 text-white shadow-sm' : 'bg-tea-50 text-tea-700 hover:bg-tea-100 border border-tea-200'}`}
            >
              All Teas
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.slug)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.slug ? 'bg-tea-700 text-white shadow-sm' : 'bg-tea-50 text-tea-700 hover:bg-tea-100 border border-tea-200'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-tea-500 text-sm mb-5">
          {loading ? 'Loading...' : `Showing ${teas.length} tea${teas.length !== 1 ? 's' : ''}`}
          {selectedCategory && ` in "${categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}"`}
        </p>

        {/* Tea Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-tea-100" />
            ))}
          </div>
        ) : teas.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-7xl">🍵</span>
            <p className="text-tea-600 text-xl font-display font-semibold mt-4">No teas found</p>
            <p className="text-tea-400 mt-2">Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(''); setCategory('') }} className="btn-primary mt-6 inline-block">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teas.map(tea => <TeaCard key={tea.id} tea={tea} />)}
          </div>
        )}
      </div>
    </div>
  )
}
