import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Plus, Edit, Trash2, Save, X, Upload, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { GalleryImage } from '../../types/admin';
import { supabase } from '../../lib/supabase';

const GalleryManagementPanel: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<GalleryImage>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newImageForm, setNewImageForm] = useState<Omit<GalleryImage, 'id' | 'createdAt'>>({
    url: '',
    alt: '',
    category: 'process',
    order: 0
  });
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const data = await adminService.getGalleryImages();
      setImages(data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error loading gallery images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (image: GalleryImage) => {
    setEditingId(image.id);
    setEditForm({ ...image });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveImage = async () => {
    if (!editingId || !editForm.id) return;

    try {
      const updated = await adminService.updateGalleryImage(editForm as GalleryImage);
      setImages(updated.sort((a, b) => a.order - b.order));
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const deleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      // Find the image to get storage path
      const imageToDelete = images.find(img => img.id === id);
      const storagePath = imageToDelete?.storage_path;
      
      const updated = await adminService.deleteGalleryImageWithFile(id, storagePath);
      setImages(updated.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setUploadingFile(true);
    setUploadError('');

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(filePath);

      // Update form with uploaded image URL
      setNewImageForm({
        ...newImageForm,
        url: urlData.publicUrl,
        alt: newImageForm.alt || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload image');
    } finally {
      setUploadingFile(false);
    }
  };

  const addNewImage = async () => {
    if (!newImageForm.url || !newImageForm.alt) return;

    try {
      // Store additional metadata for uploaded files
      const imageData = {
        ...newImageForm,
        order: images.length + 1,
        storage_path: newImageForm.url.includes('supabase') ? 
          newImageForm.url.split('/').pop() : undefined,
        file_size: undefined // We could store this if needed
      };

      const updated = await adminService.addGalleryImage({
        ...imageData
      });
      setImages(updated.sort((a, b) => a.order - b.order));
      setShowAddForm(false);
      setNewImageForm({
        url: '',
        alt: '',
        category: 'process',
        order: 0
      });
      setUploadError('');
    } catch (error) {
      console.error('Error adding image:', error);
    }
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
              <Image size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                Gallery Management
              </h2>
              <p className="text-sm text-gray-600">Manage your portfolio images</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add Image
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Add New Image Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Add New Image</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Image File
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {uploadingFile ? (
                              <>
                                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                                <p className="text-sm text-gray-500">Uploading...</p>
                              </>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={uploadingFile}
                          />
                        </label>
                      </div>
                      
                      {uploadError && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                          <AlertCircle size={16} />
                          {uploadError}
                        </div>
                      )}
                    </div>

                    <div className="text-center text-gray-500 text-sm">
                      — OR —
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={newImageForm.url}
                        onChange={(e) => setNewImageForm({ ...newImageForm, url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Preview uploaded image */}
                {newImageForm.url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </label>
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={newImageForm.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => setUploadError('Invalid image URL')}
                      />
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={newImageForm.alt}
                      onChange={(e) => setNewImageForm({ ...newImageForm, alt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Describe the image..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newImageForm.category}
                      onChange={(e) => setNewImageForm({ ...newImageForm, category: e.target.value as 'before' | 'after' | 'process' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="before">Before</option>
                      <option value="after">After</option>
                      <option value="process">Process</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={addNewImage}
                    disabled={!newImageForm.url || !newImageForm.alt || uploadingFile}
                    className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Save size={16} />
                    Add Image
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    disabled={uploadingFile}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Images Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {images.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                {editingId === image.id ? (
                  // Edit Mode
                  <div className="p-4 bg-gray-50">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={editForm.url || ''}
                          onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alt Text
                        </label>
                        <input
                          type="text"
                          value={editForm.alt || ''}
                          onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          value={editForm.category || 'process'}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value as 'before' | 'after' | 'process' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        >
                          <option value="before">Before</option>
                          <option value="after">After</option>
                          <option value="process">Process</option>
                        </select>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={saveImage}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-3 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 transition-colors text-sm flex items-center justify-center gap-1"
                        >
                          <Save size={14} />
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="relative group">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                          <button
                            onClick={() => startEditing(image)}
                            className="bg-white text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteImage(image.id)}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          image.category === 'before' ? 'bg-red-100 text-red-700' :
                          image.category === 'after' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {image.category}
                        </span>
                        <span className="text-xs text-gray-500">#{image.order}</span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{image.alt}</p>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {images.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Image size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">No images in your gallery yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus size={16} />
              Add Your First Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManagementPanel;