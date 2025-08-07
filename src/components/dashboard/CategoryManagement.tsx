import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Folder, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });
  
  const queryClient = useQueryClient();

  // Color options for categories
  const colorOptions = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6B7280', // Gray
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      console.log('Loading categories...');
      const categoriesData = await categoryService.getAllCategories();
      console.log('Categories loaded:', categoriesData);
      
      // Automatically remove duplicates
      await autoRemoveDuplicates(categoriesData);
      
      // Reload categories after potential duplicate removal
      const cleanCategoriesData = await categoryService.getAllCategories();
      setCategories(cleanCategoriesData);
    } catch (error) {
      toast.error('Failed to load categories');
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const autoRemoveDuplicates = async (categoriesData: Category[]) => {
    try {
      // Group categories by name (case-insensitive)
      const categoryGroups: { [key: string]: Category[] } = {};
      
      categoriesData.forEach(category => {
        const key = category.name.toLowerCase();
        if (!categoryGroups[key]) {
          categoryGroups[key] = [];
        }
        categoryGroups[key].push(category);
      });

      // Find duplicates
      const duplicateGroups = Object.values(categoryGroups).filter(group => group.length > 1);
      
      if (duplicateGroups.length === 0) {
        return; // No duplicates found
      }

      let deletedCount = 0;
      
      // For each duplicate group, keep the first one and delete the rest
      for (const group of duplicateGroups) {
        // Sort by creation date to keep the oldest
        group.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        
        // Delete all except the first (oldest) one
        for (let i = 1; i < group.length; i++) {
          await categoryService.deleteCategory(group[i].id);
          deletedCount++;
        }
      }

      if (deletedCount > 0) {
        console.log(`Automatically removed ${deletedCount} duplicate categories`);
        // Note: Changes won't apply to homepage until "Apply Changes" is clicked
      }
      
    } catch (error) {
      console.error('Error auto-removing duplicates:', error);
      // Don't show error toast for auto-cleanup, just log it
    }
  };

  const applyChangesToHomepage = async () => {
    // Simply invalidate the categories cache - homepage will refresh automatically
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    toast.success('Dashboard categories applied to homepage!');
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      await categoryService.createCategory(formData);
      toast.success('Category created successfully');
      setFormData({ name: '', description: '', color: '#3B82F6' });
      setShowAddForm(false);
      loadCategories();
      // Note: Changes won't apply to homepage until "Apply Changes" is clicked
    } catch (error) {
      toast.error('Failed to create category');
      console.error('Error creating category:', error);
    }
  };

  const handleEdit = async (category: Category) => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      await categoryService.updateCategory(category.id, formData);
      toast.success('Category updated successfully');
      setEditingId(null);
      setFormData({ name: '', description: '', color: '#3B82F6' });
      loadCategories();
      // Note: Changes won't apply to homepage until "Apply Changes" is clicked
    } catch (error) {
      toast.error('Failed to update category');
      console.error('Error updating category:', error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await categoryService.deleteCategory(id);
      toast.success('Category deleted successfully');
      loadCategories();
      // Note: Changes won't apply to homepage until "Apply Changes" is clicked
    } catch (error) {
      toast.error('Failed to delete category');
      console.error('Error deleting category:', error);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || '#3B82F6'
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', color: '#3B82F6' });
  };

  const startAdd = () => {
    setShowAddForm(true);
    setFormData({ name: '', description: '', color: '#3B82F6' });
  };

  const cancelAdd = () => {
    setShowAddForm(false);
    setFormData({ name: '', description: '', color: '#3B82F6' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600 mt-1">Organize your PDF collection with categories</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={applyChangesToHomepage}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            title="Update homepage with current dashboard categories"
          >
            <Check size={20} className="mr-2" />
            Apply to Homepage
          </button>
          <button
            onClick={startAdd}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="flex space-x-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter category description (optional)"
            />
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleAdd}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Save size={16} className="mr-2" />
              Save Category
            </button>
            <button
              onClick={cancelAdd}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <X size={16} className="mr-2" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Categories ({categories.length})</h2>
        </div>
        
        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Folder size={48} className="mx-auto mb-4 opacity-50" />
            <p>No categories found. Create your first category to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {categories.map((category) => (
              <div key={category.id} className="p-6">
                {editingId === category.id ? (
                  /* Edit Form */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color
                        </label>
                        <div className="flex space-x-2">
                          {colorOptions.map((color) => (
                            <button
                              key={color}
                              onClick={() => setFormData({ ...formData, color })}
                              className={`w-8 h-8 rounded-full border-2 ${
                                formData.color === color ? 'border-gray-800' : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(category)}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                      >
                        <X size={16} className="mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Display Mode */
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: category.color || '#3B82F6' }}
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-gray-600 mt-1">{category.description}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          Created {category.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit category"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;
