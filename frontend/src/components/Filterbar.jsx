import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const categories = [
  { name: 'All', icon: 'fa-solid fa-fire', value: '' },
  { name: 'Rooms', icon: 'fa-solid fa-bed', value: 'room' },
  { name: 'Iconic cities', icon: 'fa-solid fa-city', value: 'iconic city' },
  { name: 'Mountain', icon: 'fa-solid fa-mountain-city', value: 'mountain' },
  { name: 'Beach', icon: 'fa-solid fa-water', value: 'beach' },
  { name: 'Castles', icon: 'fa-solid fa-fort-awesome', value: 'castle' },
  { name: 'Amazing Pools', icon: 'fa-solid fa-person-swimming', value: 'pool' },
  { name: 'Farms', icon: 'fa-solid fa-tractor', value: 'farm' },
  { name: 'Arctic', icon: 'fa-solid fa-snowflake', value: 'arctic' },
];

function FilterBar() {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || '';

  return (
    <div className="filters d-flex flex-wrap justify-content-center my-3 gap-3">
      {categories.map((cat) => (
        <Link
          key={cat.value || 'all'}
          to={`/listings${cat.value ? `?category=${encodeURIComponent(cat.value)}` : ''}`}
          className={`filter-item text-decoration-none d-flex flex-column align-items-center ${currentCategory === cat.value ? 'active-filter' : ''}`}
          style={{ color: currentCategory === cat.value ? '#0d6efd' : '#6c757d', opacity: currentCategory === cat.value ? 1 : 0.7 }}
        >
          <span><i className={cat.icon}></i></span>
          <span style={{ fontSize: '0.8rem' }}>{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}

export default FilterBar;