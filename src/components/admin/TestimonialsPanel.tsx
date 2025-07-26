import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Star, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Plus, 
  Download,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Testimonial } from '../../lib/supabase';

const TestimonialsPanel: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Testimonial>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string>('');
  
  const [newTestimonial, setNewTestimonial] = useState<Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    location: '',
    rating: 5,
    text: '',
    image: '/assets/customer_avatar_2.png',
    source: 'manual',
    is_published: false,
    order_index: 0
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await adminService.getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setEditForm({ ...testimonial });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveTestimonial = async () => {
    if (!editingId || !editForm.id) return;

    try {
      const updated = await adminService.updateTestimonial(editForm as Testimonial);
      setTestimonials(updated);
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Error saving testimonial:', error);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const updated = await adminService.deleteTestimonial(id);
      setTestimonials(updated);
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  const togglePublished = async (testimonial: Testimonial) => {
    try {
      const updated = await adminService.updateTestimonial({
        ...testimonial,
        is_published: !testimonial.is_published
      });
      setTestimonials(updated);
    } catch (error) {
      console.error('Error updating testimonial:', error);
    }
  };

  const addNewTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.text) return;

    try {
      const updated = await adminService.addManualTestimonial({
        ...newTestimonial,
        order_index: testimonials.length + 1
      });
      setTestimonials(updated);
      setShowAddForm(false);
      setNewTestimonial({
        name: '',
        location: '',
        rating: 5,
        text: '',
        image: '/assets/customer_avatar_2.png',
        source: 'manual',
        is_published: false,
        order_index: 0
      });
    } catch (error) {
      console.error('Error adding testimonial:', error);
    }
  };

  const importGoogleReviews = async () => {
    setIsImporting(true);
    setImportStatus('');

    try {
      const result = await adminService.fetchGoogleReviews();
      setImportStatus(`Imported ${result.imported} new reviews out of ${result.total} total Google reviews`);
      
      if (result.imported > 0) {
        await loadTestimonials(); // Refresh the list
      }
    } catch (error) {
      console.error('Error importing Google reviews:', error);
      setImportStatus('Error importing Google reviews. Please check your API configuration.');
    } finally {
      setIsImporting(false);
      setTimeout(() => setImportStatus(''), 5000);
    }
  };

  const publishedCount = testimonials.filter(t => t.is_published).length;
  const unpublishedCount = testimonials.filter(t => !t.is_published).length;
  const googleCount = testimonials.filter(t => t.source === 'google').length;

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
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                Testimonials Management
              </h2>
              <p className="text-sm text-gray-600">Review and publish customer testimonials</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={importGoogleReviews}
              disabled={isImporting}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isImporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Importing...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Import Google Reviews
                </>
              )}
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Add Manual Review
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{unpublishedCount}</div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{googleCount}</div>
            <div className="text-sm text-gray-600">From Google</div>
          </div>
        </div>

        {importStatus && (
          <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
            importStatus.includes('Error') 
              ? 'bg-red-50 border border-red-200 text-red-700' 
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {importStatus.includes('Error') ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            <span className="text-sm">{importStatus}</span>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Add New Testimonial Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Add Manual Testimonial</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newTestimonial.location}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="City, TX"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <select
                      value={newTestimonial.rating}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Avatar Image URL
                    </label>
                    <input
                      type="text"
                      value={newTestimonial.image}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="/assets/customer_avatar.png"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testimonial Text
                  </label>
                  <textarea
                    value={newTestimonial.text}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Write the customer's testimonial here..."
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={addNewTestimonial}
                    disabled={!newTestimonial.name || !newTestimonial.text}
                    className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Save size={16} />
                    Add Testimonial
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Testimonials List */}
        <div className="space-y-4">
          <AnimatePresence>
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`border rounded-xl overflow-hidden ${
                  testimonial.is_published 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-orange-200 bg-orange-50'
                }`}
              >
                {editingId === testimonial.id ? (
                  // Edit Mode
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name
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
                            Location
                          </label>
                          <input
                            type="text"
                            value={editForm.location || ''}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating
                        </label>
                        <select
                          value={editForm.rating || 5}
                          onChange={(e) => setEditForm({ ...editForm, rating: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value={5}>5 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={3}>3 Stars</option>
                          <option value={2}>2 Stars</option>
                          <option value={1}>1 Star</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Testimonial Text
                        </label>
                        <textarea
                          value={editForm.text || ''}
                          onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={saveTestimonial}
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
                      <div className="flex items-start gap-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              testimonial.source === 'google' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {testimonial.source === 'google' ? 'Google' : 'Manual'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              testimonial.is_published 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              {testimonial.is_published ? 'Published' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{testimonial.location}</p>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} size={14} className="text-yellow-400 fill-current" />
                            ))}
                            {testimonial.date && (
                              <span className="text-xs text-gray-500 ml-2">{testimonial.date}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePublished(testimonial)}
                          className={`p-2 rounded-lg transition-colors ${
                            testimonial.is_published
                              ? 'text-green-600 hover:bg-green-100'
                              : 'text-orange-600 hover:bg-orange-100'
                          }`}
                          title={testimonial.is_published ? 'Hide from website' : 'Publish to website'}
                        >
                          {testimonial.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button
                          onClick={() => startEditing(testimonial)}
                          className="text-purple-600 hover:text-purple-700 p-2 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteTestimonial(testimonial.id)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 italic">"{testimonial.text}"</p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {testimonials.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">No testimonials yet</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={importGoogleReviews}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Import Google Reviews
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Manual Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsPanel;