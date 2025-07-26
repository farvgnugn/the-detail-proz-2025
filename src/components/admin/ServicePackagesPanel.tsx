import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Edit, Save, X, Plus, Trash2, Star } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { ServicePackage } from '../../types/admin';

const ServicePackagesPanel: React.FC = () => {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServicePackage>>({});

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const data = await adminService.getServicePackages();
      setPackages(data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error loading service packages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (pkg: ServicePackage) => {
    setEditingId(pkg.id);
    setEditForm({ ...pkg });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const savePackage = async () => {
    if (!editingId || !editForm.id) return;

    try {
      const updated = await adminService.updateServicePackage(editForm as ServicePackage);
      setPackages(updated.sort((a, b) => a.order - b.order));
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  const addFeature = (section: 'interior' | 'exterior') => {
    if (!editForm[section]) {
      setEditForm({
        ...editForm,
        [section]: ['']
      });
    } else {
      setEditForm({
        ...editForm,
        [section]: [...editForm[section]!, '']
      });
    }
  };

  const updateFeature = (section: 'interior' | 'exterior', index: number, value: string) => {
    if (!editForm[section]) return;
    
    const updated = [...editForm[section]!];
    updated[index] = value;
    setEditForm({
      ...editForm,
      [section]: updated
    });
  };

  const removeFeature = (section: 'interior' | 'exterior', index: number) => {
    if (!editForm[section]) return;
    
    const updated = editForm[section]!.filter((_, i) => i !== index);
    setEditForm({
      ...editForm,
      [section]: updated
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-2 rounded-lg">
              <Package size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                Service Packages
              </h2>
              <p className="text-sm text-gray-600">Manage pricing and service details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          <AnimatePresence>
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                {editingId === pkg.id ? (
                  // Edit Mode
                  <div className="p-6 bg-gray-50">
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Package Name
                          </label>
                          <input
                            type="text"
                            value={editForm.name || ''}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price Range
                          </label>
                          <input
                            type="text"
                            value={editForm.price || ''}
                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`popular-${pkg.id}`}
                          checked={editForm.popular || false}
                          onChange={(e) => setEditForm({ ...editForm, popular: e.target.checked })}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <label htmlFor={`popular-${pkg.id}`} className="text-sm font-medium text-gray-700">
                          Mark as Popular Package
                        </label>
                      </div>

                      {/* Interior Features */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">Interior Services</h4>
                          <button
                            onClick={() => addFeature('interior')}
                            className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1"
                          >
                            <Plus size={16} />
                            Add Feature
                          </button>
                        </div>
                        <div className="space-y-2">
                          {editForm.interior?.map((feature, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => updateFeature('interior', index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                placeholder="Enter service feature..."
                              />
                              <button
                                onClick={() => removeFeature('interior', index)}
                                className="text-red-500 hover:text-red-700 p-2"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Exterior Features */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">Exterior Services</h4>
                          <button
                            onClick={() => addFeature('exterior')}
                            className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1"
                          >
                            <Plus size={16} />
                            Add Feature
                          </button>
                        </div>
                        <div className="space-y-2">
                          {editForm.exterior?.map((feature, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => updateFeature('exterior', index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                placeholder="Enter service feature..."
                              />
                              <button
                                onClick={() => removeFeature('exterior', index)}
                                className="text-red-500 hover:text-red-700 p-2"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={savePackage}
                          className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 transition-colors flex items-center gap-2"
                        >
                          <Save size={16} />
                          Save Changes
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-serif font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                            {pkg.name}
                          </h3>
                          {pkg.popular && (
                            <span className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              <Star size={12} />
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-2xl font-bold text-purple-600 mb-4">
                          {pkg.price}
                        </div>
                      </div>
                      <button
                        onClick={() => startEditing(pkg)}
                        className="text-purple-600 hover:text-purple-700 p-2 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Edit size={20} />
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-purple-600 mb-3">Interior Services</h4>
                        <ul className="space-y-2">
                          {pkg.interior.map((feature, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-purple-600 mb-3">Exterior Services</h4>
                        <ul className="space-y-2">
                          {pkg.exterior.map((feature, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ServicePackagesPanel;