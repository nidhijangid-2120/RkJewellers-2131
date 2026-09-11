import React, { useState } from 'react';
import { initialGallery } from '../data/seedData.js';

export const GalleryPage = () => {
  const [activeAlbum, setActiveAlbum] = useState('All');

  const albums = ['All', 'Bridal Edit 2026', 'Eternal Solitaires', 'Heritage Craft'];

  const filtered = activeAlbum === 'All' 
    ? initialGallery 
    : initialGallery.filter(g => g.album === activeAlbum);

  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-xl mx-auto space-y-2 border-b border-stone-800 pb-6">
          <span className="text-xs text-amber-400 font-semibold uppercase tracking-widest">Bridal & High-Jewellery Lookbook</span>
          <h1 className="text-3xl font-serif text-amber-200 font-bold">Royal Gallery Edit</h1>
          <p className="text-xs text-stone-400">Discover handpicked polki trunks, solitaire diamond shoots, and temple gold craftsmanship.</p>
        </div>

        {/* Filter buttons */}
        <div className="flex justify-center gap-3 overflow-x-auto text-xs">
          {albums.map(alb => (
            <button
              key={alb}
              onClick={() => setActiveAlbum(alb)}
              className={`px-4 py-2 rounded-full border transition-colors cursor-pointer ${activeAlbum === alb ? 'bg-amber-500 text-stone-950 font-bold border-amber-500' : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-amber-300'}`}
            >
              {alb}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map(img => (
            <div key={img.id} className="group relative rounded-2xl overflow-hidden border border-amber-900/40 bg-stone-900 shadow-2xl">
              <img src={img.url} alt={img.title} className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <span className="text-[10px] text-amber-400 uppercase font-bold tracking-widest">{img.album}</span>
                <h3 className="text-base font-serif text-amber-200 font-bold">{img.title}</h3>
                <p className="text-xs text-stone-400">{img.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
