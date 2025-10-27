import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const categories = [
  { name: 'All', icon: 'fa-solid fa-fire', value: '', gradient: 'from-orange-400 to-red-500' },
  { name: 'Rooms', icon: 'fa-solid fa-bed', value: 'room', gradient: 'from-blue-400 to-indigo-500' },
  { name: 'Iconic cities', icon: 'fa-solid fa-city', value: 'iconic city', gradient: 'from-purple-400 to-pink-500' },
  { name: 'Mountain', icon: 'fa-solid fa-mountain-city', value: 'mountain', gradient: 'from-green-400 to-teal-500' },
  { name: 'Beach', icon: 'fa-solid fa-water', value: 'beach', gradient: 'from-cyan-400 to-blue-500' },
  { name: 'Castles', icon: 'fa-solid fa-fort-awesome', value: 'castle', gradient: 'from-violet-400 to-purple-500' },
  { name: 'Pools', icon: 'fa-solid fa-person-swimming', value: 'pool', gradient: 'from-sky-400 to-cyan-500' }, // Shortened name
  { name: 'Farms', icon: 'fa-solid fa-tractor', value: 'farm', gradient: 'from-lime-400 to-green-500' },
  { name: 'Arctic', icon: 'fa-solid fa-snowflake', value: 'arctic', gradient: 'from-blue-300 to-indigo-400' },
];

function FilterBar() {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || '';

  return (
    <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        {/* Enable horizontal scrolling, ensure no wrapping */}
        <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide pb-2 flex-nowrap">
          {categories.map((cat) => {
            const isActive = currentCategory === cat.value;

            return (
              <Link
                key={cat.value || 'all'}
                to={`/listings${cat.value ? `?category=${encodeURIComponent(cat.value)}` : ''}`}
                // Arrange items side-by-side, center vertically
                className={`
                  group flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                  transition-all duration-300 relative whitespace-nowrap
                  ${isActive
                    ? 'bg-gradient-to-br ' + cat.gradient + ' text-white shadow-md scale-105'
                    : 'bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }
                `}
              >
                {/* Icon container - remove mb, adjust size */}
                <div className={`
                  flex items-center justify-center w-6 h-6 rounded-full
                  transition-all duration-300
                  ${isActive
                    ? 'bg-white/20'
                    : 'group-hover:scale-110'
                  }
                `}>
                  <i className={`${cat.icon} text-sm ${isActive ? 'text-white' : ''}`}></i>
                </div>
                {/* Text */}
                <span className={`
                  text-sm font-medium
                  ${isActive ? 'text-white' : ''}
                `}>
                  {cat.name}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-[3px] bg-indigo-600 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      
    </div>
  );
}

export default FilterBar;