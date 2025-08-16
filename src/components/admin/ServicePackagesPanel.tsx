import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Edit, Save, X, Plus, Trash2, Star, DollarSign } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { ServicePackage } from '../../types/admin';
import type { VehicleSize, PackagePricing } from '../../lib/supabase';

const ServicePackagesPanel: React.FC = () => {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [vehicleSizes, setVehicleSizes] = useState<VehicleSize[]>([]);
  const [packagePricing, setPackagePricing] = useState<PackagePricing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServicePackage>>({});
  const [showPricingModal, setShowPricingModal] = useState<string | null>(null);
  const [pricingForm, setPricingForm] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [packagesData, sizesData, pricingData] = await Promise.all([
        adminService.getServicePackages(),
        adminService.getVehicleSizes(),
        adminService.getPackagePricing()
      ]);
      
      setPackages(packagesData.sort((a, b) => a.order_index - b.order_index));
      setVehicleSizes(sizesData);
      setPackagePricing(pricingData);
    } catch (error) {
      console.error('Error loading data:', error);
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
      setPackages(updated.sort((a, b) => a.order_index - b.order_index));
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  const openPricingModal = (packageId: string) => {
    setShowPricingModal(packageId);
    
    // Initialize pricing form with current values
    const currentPricing: { [key: string]: number } = {};
    vehicleSizes.forEach(size => {
      const pricing = packagePricing.find(
        p => p.package_id === packageId && p.vehicle_size_id === size.id
      );
      currentPricing[size.id] = pricing?.price || 0;
    });
    setPricingForm(currentPricing);
  };

  const savePricing = async () => {
    if (!showPricingModal) return;

    try {
      // Update pricing for each vehicle size
      await Promise.all(
        Object.entries(pricingForm).map(([vehicleSizeId, price]) =>
          adminService.updatePackagePricing(showPricingModal, vehicleSizeId, price)
        )
      );

      // Reload pricing data
      const pricingData = await adminService.getPackagePricing();
      setPackagePricing(pricingData);
      
      setShowPricingModal(null);
      setPricingForm({});
    } catch (error) {
      console.error('Error saving pricing:', error);
    }
  };

  const getPriceRange = (packageId: string): string => {
    const prices = vehicleSizes
      .map(size => {
        const pricing = packagePricing.find(
          p => p.package_id === packageId && p.vehicle_size_id === size.id
        );
        return pricing?.price || 0;
      })
      .filter(price => price > 0);

    if (prices.length === 0) return 'Not set';
    
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    return min === max ? `$${min}` : `$${min} - $${max}`;
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
                Service Packages & Pricing
              </h2>
              <p className="text-sm text-gray-600">Manage packages and vehicle size-based pricing</p>
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
                            Legacy Price Range (for fallback)
                          </label>
                          <input
                            type="text"
                            value={editForm.price || ''}
                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="e.g., $89 - $129"
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
                          {getPriceRange(pkg.id)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openPricingModal(pkg.id)}
                          className="text-green-600 hover:text-green-700 p-2 hover:bg-green-50 rounded-lg transition-colors"
                          title="Set vehicle size pricing"
                        >
                          <DollarSign size={20} />
                        </button>
                        <button
                          onClick={() => startEditing(pkg)}
                          className="text-purple-600 hover:text-purple-700 p-2 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          <Edit size={20} />
                        </button>
                      </div>
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

                    {/* Vehicle Size Pricing Display */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Pricing by Vehicle Size</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {vehicleSizes.map(size => {
                          const pricing = packagePricing.find(
                            p => p.package_id === pkg.id && p.vehicle_size_id === size.id
                          );
                          return (
                            <div key={size.id} className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-sm font-medium text-gray-700">{size.name}</div>
                              <div className="text-lg font-bold text-purple-600">
                                {pricing ? `$${pricing.price}` : 'Not set'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Set Vehicle Size Pricing</h3>
              <button
                onClick={() => setShowPricingModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {vehicleSizes.map(size => (
                <div key={size.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {size.name}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={pricingForm[size.id] || ''}
                      onChange={(e) => setPricingForm({
                        ...pricingForm,
                        [size.id]: parseFloat(e.target.value) || 0
                      })}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={savePricing}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 transition-colors"
              >
                Save Pricing
              </button>
              <button
                onClick={() => setShowPricingModal(null)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePackagesPanel;