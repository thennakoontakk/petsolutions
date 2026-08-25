'use client';

import { useState, useEffect } from 'react';
import { ListCollapse, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils/slugify';
import type { Category } from '@/lib/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentCategory, setParentCategory] = useState<'Cat' | 'Dog' | 'Cat/Dog'>('Cat/Dog');
  const [displayOrder, setDisplayOrder] = useState('0');
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit Modal State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editParentCategory, setEditParentCategory] = useState<'Cat' | 'Dog' | 'Cat/Dog'>('Cat/Dog');
  const [editDisplayOrder, setEditDisplayOrder] = useState('0');
  const [editDescription, setEditDescription] = useState('');
  const [updating, setUpdating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

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

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditParentCategory(cat.parent_category);
    setEditDisplayOrder(cat.display_order.toString());
    setEditDescription(cat.description || '');
    setEditError(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editName) return;

    setUpdating(true);
    setEditError(null);

    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: editName,
          slug: editSlug || slugify(editName),
          parent_category: editParentCategory,
          display_order: parseInt(editDisplayOrder) || 0,
          description: editDescription || null,
        })
        .eq('id', editingCategory.id)
        .select()
        .single();

      if (error) throw error;

      setCategories(
        categories
          .map((c) => (c.id === editingCategory.id ? (data as Category) : c))
          .sort((a, b) => a.display_order - b.display_order)
      );
      setEditingCategory(null);
    } catch (err: any) {
      console.error('Error updating category:', err);
      setEditError(err.message || 'Error updating category.');
    } finally {
      setUpdating(false);
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
          Organize products into distinct pet sections and assign them to navigation dropdowns.
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
              placeholder="e.g. Tick & Flea Prevention"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full text-xs"
            />
          </div>

          <div>
            <label className="label">Parent Section (Navigation Target)</label>
            <select
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value as any)}
              className="input w-full text-xs"
            >
              <option value="Cat/Dog">🐾 Cat & Dog (Shared / Both)</option>
              <option value="Dog">🐶 Dog Only</option>
              <option value="Cat">🐱 Cat Only</option>
            </select>
          </div>

          <div>
            <label className="label">Display Order (Sorting)</label>
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
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-base text-text">
              Active Categories ({categories.length})
            </h3>
            <span className="text-[11px] text-text-muted">
              Displayed in header dropdowns & filter sidebars
            </span>
          </div>

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
                    <th className="py-3 px-4">Pet Section</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="border-b border-secondary/20 hover:bg-secondary/10 transition-colors">
                      <td className="py-3 px-4 font-semibold">{cat.display_order}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-text">{cat.name}</p>
                          {cat.description && (
                            <p className="text-[10px] text-text-muted">{cat.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-text-muted font-mono">{cat.slug}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            cat.parent_category === 'Dog'
                              ? 'bg-amber-100 text-amber-800'
                              : cat.parent_category === 'Cat'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {cat.parent_category === 'Dog' ? '🐶 Dog Only' : cat.parent_category === 'Cat' ? '🐱 Cat Only' : '🐾 Shared (Dog & Cat)'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 hover:bg-accent/20 hover:text-accent rounded-lg transition-colors text-text-muted inline-flex items-center"
                          title="Edit Category"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 hover:bg-error-light hover:text-error rounded-lg transition-colors text-text-muted inline-flex items-center"
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

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-secondary-alt/40 relative animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-secondary/40 mb-4">
              <h3 className="font-heading font-bold text-base text-text flex items-center gap-2">
                <Edit2 size={16} className="text-accent" /> Edit Category
              </h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-1 rounded-full hover:bg-secondary/40 text-text-muted hover:text-text"
              >
                <X size={18} />
              </button>
            </div>

            {editError && (
              <div className="p-3 mb-4 bg-error-light text-error text-xs rounded-xl border border-error/20">
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="label">Category Name <span className="text-error">*</span></label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input w-full text-xs"
                />
              </div>

              <div>
                <label className="label">Slug (URL identifier)</label>
                <input
                  type="text"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className="input w-full text-xs font-mono"
                />
              </div>

              <div>
                <label className="label">Parent Section (Navigation Target)</label>
                <select
                  value={editParentCategory}
                  onChange={(e) => setEditParentCategory(e.target.value as any)}
                  className="input w-full text-xs"
                >
                  <option value="Cat/Dog">🐾 Cat & Dog (Shared / Both)</option>
                  <option value="Dog">🐶 Dog Only</option>
                  <option value="Cat">🐱 Cat Only</option>
                </select>
              </div>

              <div>
                <label className="label">Display Order (Sorting)</label>
                <input
                  type="number"
                  value={editDisplayOrder}
                  onChange={(e) => setEditDisplayOrder(e.target.value)}
                  className="input w-full text-xs"
                />
              </div>

              <div>
                <label className="label">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="input w-full text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-secondary/40">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="btn btn-ghost text-xs py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn btn-primary text-xs py-2 font-bold flex items-center gap-1.5"
                >
                  {updating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save size={14} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
