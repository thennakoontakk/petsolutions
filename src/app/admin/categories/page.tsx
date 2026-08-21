'use client';

import { useState, useEffect } from 'react';
import { ListCollapse, Plus, Trash2, Save } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils/slugify';
import type { Category } from '@/lib/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentCategory, setParentCategory] = useState('Cat/Dog');
  const [displayOrder, setDisplayOrder] = useState('0');
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setSaving(true);
    setError(null);

    try {
      const supabase = createBrowserClient();
      const slug = slugify(name);

      const { data, error } = await supabase
        .from('categories')
        .insert({
          name,
          slug,
          description,
          parent_category: parentCategory,
          display_order: parseInt(displayOrder) || 0,
        })
        .select()
        .single();

      if (error) throw error;

      setCategories([...categories, data as Category].sort((a, b) => a.display_order - b.display_order));
      setName('');
      setDescription('');
      setDisplayOrder('0');
    } catch (err: any) {
      console.error('Error creating category:', err);
      setError(err.message || 'Error creating category. Slug must be unique.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? Make sure no products are linked to it.')) return;
    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Could not delete category. Ensure no products are currently assigned to it.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-text flex items-center gap-2">
          <ListCollapse className="text-accent" /> Categories Management
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Organize products into distinct pet sections and categories.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Side: Create form */}
        <form onSubmit={handleSubmit} className="w-full lg:w-96 glass p-6 rounded-2xl border border-white/40 space-y-4">
          <h3 className="font-heading font-bold text-base text-text border-b border-secondary/50 pb-2">
            Create Category
          </h3>
          
          {error && (
            <div className="p-3 bg-error-light text-error text-xs rounded-xl border border-error/20">
              {error}
            </div>
          )}

          <div>
            <label className="label">Category Name <span className="text-error">*</span></label>
            <input
              type="text"
              required
              placeholder="e.g. Cat Food - Wet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full text-xs"
            />
          </div>

          <div>
            <label className="label">Parent Section</label>
            <select
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
              className="input w-full text-xs"
            >
              <option value="Cat/Dog">Cat/Dog (Shared)</option>
              <option value="Dog">Dog Only</option>
              <option value="Cat">Cat Only</option>
            </select>
          </div>

          <div>
            <label className="label">Display Order</label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              className="input w-full text-xs"
            />
          </div>

          <div>
            <label className="label">Description (Optional)</label>
            <textarea
              rows={3}
              placeholder="Short description of the category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input w-full text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-1.5"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Plus size={14} /> Add Category
              </>
            )}
          </button>
        </form>

        {/* Right Side: List of Categories */}
        <div className="flex-1 w-full glass p-6 rounded-2xl border border-white/40">
          <h3 className="font-heading font-bold text-base text-text mb-6">
            Active Categories ({categories.length})
          </h3>

          {loading ? (
            <div className="py-4 text-center text-xs text-text-muted">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="py-4 text-center text-xs text-text-muted">No categories created yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-secondary/50 text-text-muted font-bold">
                    <th className="py-3 px-4">Order</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Pet Type</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="border-b border-secondary/20 hover:bg-secondary/10 transition-colors">
                      <td className="py-3 px-4 font-semibold">{cat.display_order}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-text">{cat.name}</p>
                          <p className="text-[10px] text-text-muted">{cat.description}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-text-muted font-mono">{cat.slug}</td>
                      <td className="py-3 px-4 text-accent font-semibold">{cat.parent_category}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 hover:bg-error-light hover:text-error rounded-lg transition-colors text-text-muted"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
