import React, { useState } from 'react';
import { initialBlogs } from '../data/seedData.js';

export const BlogsPage = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);

  if (selectedBlog) {
    return (
      <div className="bg-stone-950 text-stone-100 min-h-screen py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <button 
            onClick={() => setSelectedBlog(null)} 
            className="text-xs text-amber-400 hover:underline cursor-pointer"
          >
            ← Back to Journal
          </button>
          
          <span className="text-xs text-amber-400 uppercase font-bold tracking-widest">{selectedBlog.category}</span>
          <h1 className="text-3xl font-serif text-amber-200 font-bold">{selectedBlog.title}</h1>
          <p className="text-xs text-stone-400">By {selectedBlog.author} • {selectedBlog.readTime}</p>

          <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full aspect-video object-cover rounded-2xl border border-amber-900/40" />

          <div className="text-xs text-stone-300 leading-relaxed space-y-4 pt-4 border-t border-stone-800">
            <p>{selectedBlog.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-xl mx-auto space-y-2 border-b border-stone-800 pb-6">
          <span className="text-xs text-amber-400 font-semibold uppercase tracking-widest">Journal & Insights</span>
          <h1 className="text-3xl font-serif text-amber-200 font-bold">Jewellery Buying & Care Guides</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {initialBlogs.map(blog => (
            <div 
              key={blog.id} 
              onClick={() => setSelectedBlog(blog)}
              className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden cursor-pointer hover:border-amber-500 transition-colors group shadow-xl"
            >
              <img src={blog.image} alt={blog.title} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="p-6 space-y-2">
                <span className="text-[10px] text-amber-400 uppercase font-bold tracking-widest">{blog.category}</span>
                <h3 className="text-lg font-serif text-amber-200 font-bold group-hover:text-amber-300">{blog.title}</h3>
                <p className="text-xs text-stone-400 line-clamp-2">{blog.excerpt}</p>
                <p className="text-[11px] text-stone-500 pt-2">{blog.readTime}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
