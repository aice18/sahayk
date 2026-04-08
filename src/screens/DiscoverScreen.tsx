import React, { useState, useMemo } from 'react';
import { Search, Filter, X, MapPin, DollarSign } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { SCHEMES } from '../constants';
import { Scheme } from '../types';

const DiscoverScreen: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories and count schemes
  const categories = useMemo(() => {
    const cats = new Set(SCHEMES.map(s => s.category));
    return ['All', ...Array.from(cats)];
  }, []);

  // Filter schemes based on search and category
  const filteredSchemes = useMemo(() => {
    return SCHEMES.filter(scheme => {
      const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Farmer': 'bg-green-100 text-green-800',
      'Health': 'bg-red-100 text-red-800',
      'Education': 'bg-blue-100 text-blue-800',
      'Housing': 'bg-amber-100 text-amber-800',
      'Business': 'bg-purple-100 text-purple-800',
      'Social Security': 'bg-pink-100 text-pink-800',
      'Digital India': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="px-4 pt-4 pb-2 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="Sahayk Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-2xl font-bold text-gray-900">{t('discover') || 'Discover Schemes'}</h1>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('searchPlaceholder') || 'Search schemes...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filter Toggle & Results Count */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">
              {filteredSchemes.length} {t('schemes') || 'schemes'} found
            </p>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium"
            >
              <Filter className="w-4 h-4" />
              {t('filters') || 'Filters'}
            </button>
          </div>

          {/* Category Filter */}
          {showFilters && (
            <div className="mb-3 pb-3 border-b">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="px-4 py-6 max-w-6xl mx-auto">
        {filteredSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 hover:border-blue-300"
              >
                {/* Image */}
                <div className="relative h-40 bg-gray-200 overflow-hidden">
                  <img
                    src={scheme.imageUrl}
                    alt={scheme.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                  {/* Category Badge */}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(scheme.category)}`}>
                    {scheme.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2">
                    {scheme.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {scheme.description}
                  </p>

                  {/* Benefits Preview */}
                  {scheme.benefits && scheme.benefits.length > 0 && (
                    <div className="mb-3 pb-3 border-b">
                      <p className="text-xs font-semibold text-gray-700 mb-1.5">Key Benefits:</p>
                      <div className="flex flex-wrap gap-1">
                        {scheme.benefits.slice(0, 2).map((benefit, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Info */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{t('eligibilityInfo') || 'Check eligibility criteria'}</span>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm">
                    {t('learnMore') || 'Learn More'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-semibold mb-2">
              {t('noSchemesFound') || 'No schemes found'}
            </p>
            <p className="text-gray-400 text-sm">
              {t('tryDifferentSearch') || 'Try adjusting your search or filters'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverScreen;
