import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  Upload, 
  Package, 
  DollarSign,
  Clock,
  Tag,
  FileText,
  Camera,
  Check,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import { useLoading } from '../../hooks/useLoading';
import { 
  menuFirebaseService,
  type CreateMenuItemInput,
  type UpdateMenuItemInput,
  type MenuItemFirestore
} from '../../services/menuFirebaseService';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem?: MenuItemFirestore | null;
  onSave: (item: MenuItemFirestore) => void;
}

const categories = [
  { id: 'doner', name: 'Döner', icon: '🥙' },
  { id: 'makarna', name: 'Makarna', icon: '🍝' },
  { id: 'icecek', name: 'İçecek', icon: '🥤' },
  { id: 'salata', name: 'Salata', icon: '🥗' },
  { id: 'corbalar', name: 'Çorbalar', icon: '🍲' },
  { id: 'tatli', name: 'Tatlı', icon: '🍰' }
];

const commonTags = [
  'popüler', 'özel', 'acılı', 'hafif', 'sıcak', 'soğuk', 
  'vejetaryen', 'protein', 'vitamin', 'organik', 'ev yapımı', 'geleneksel'
];

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  editingItem,
  onSave
}) => {
  const [formData, setFormData] = useState<CreateMenuItemInput>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    isVegetarian: false,
    isAvailable: true,
    calories: 0,
    tags: [],
    preparationTime: 0,
    ingredients: [],
    allergens: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [allergenInput, setAllergenInput] = useState('');

  const { showToast } = useToast();
  const { withLoading, isLoading } = useLoading();

  // Initialize form with editing item data
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        description: editingItem.description,
        price: editingItem.price,
        category: editingItem.category,
        image: editingItem.image,
        isVegetarian: editingItem.isVegetarian,
        isAvailable: editingItem.isAvailable,
        calories: editingItem.calories || 0,
        tags: editingItem.tags || [],
        preparationTime: editingItem.preparationTime || 0,
        ingredients: editingItem.ingredients || [],
        allergens: editingItem.allergens || []
      });
      setSelectedTags(editingItem.tags || []);
    } else {
      // Reset form for new item
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: '',
        isVegetarian: false,
        isAvailable: true,
        calories: 0,
        tags: [],
        preparationTime: 0,
        ingredients: [],
        allergens: []
      });
      setSelectedTags([]);
    }
    setErrors({});
  }, [editingItem, isOpen]);

  // Handle input changes
  const handleInputChange = (field: keyof CreateMenuItemInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ürün adı gereklidir';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Açıklama gereklidir';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Fiyat 0\'dan büyük olmalıdır';
    }
    if (!formData.category) {
      newErrors.category = 'Kategori seçimi gereklidir';
    }
    if (!formData.image.trim()) {
      newErrors.image = 'Ürün görseli gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle tag operations
  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      setFormData(prev => ({ ...prev, tags: newTags }));
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(newTags);
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  // Handle arrays (ingredients, allergens)
  const addToArray = (arrayType: 'ingredients' | 'allergens', value: string) => {
    if (value.trim()) {
      const currentArray = formData[arrayType] || [];
      if (!currentArray.includes(value.trim())) {
        const newArray = [...currentArray, value.trim()];
        setFormData(prev => ({ ...prev, [arrayType]: newArray }));
      }
    }
  };

  const removeFromArray = (arrayType: 'ingredients' | 'allergens', value: string) => {
    const currentArray = formData[arrayType] || [];
    const newArray = currentArray.filter(item => item !== value);
    setFormData(prev => ({ ...prev, [arrayType]: newArray }));
  };

  // Save product
  const handleSave = withLoading(async () => {
    if (!validateForm()) {
      showToast('Lütfen tüm gerekli alanları doldurun', 'error');
      return;
    }

    try {
      let savedItem: MenuItemFirestore;

      if (editingItem) {
        // Update existing item
        const updateData: UpdateMenuItemInput = {
          id: editingItem.id!,
          ...formData
        };
        await menuFirebaseService.updateMenuItem(updateData);
        
        savedItem = {
          ...editingItem,
          ...formData,
          updatedAt: new Date() as any
        };
        
        showToast('Ürün başarıyla güncellendi', 'success');
      } else {
        // Create new item
        const newItemId = await menuFirebaseService.createMenuItem(formData);
        
        savedItem = {
          id: newItemId,
          ...formData,
          rating: 0,
          reviewCount: 0,
          createdAt: new Date() as any,
          updatedAt: new Date() as any
        };
        
        showToast('Yeni ürün başarıyla eklendi', 'success');
      }

      onSave(savedItem);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('Ürün kaydedilirken hata oluştu', 'error');
    }
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Package className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingItem ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {editingItem ? 'Mevcut ürünü düzenleyin' : 'Menüye yeni ürün ekleyin'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Basic Info */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Temel Bilgiler
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Ürün Adı *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Örn: Tavuk Döner"
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Açıklama *</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Ürün açıklaması..."
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.description}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Fiyat (₺) *</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="number"
                            value={formData.price}
                            onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            className={`pl-10 ${errors.price ? 'border-red-500' : ''}`}
                            step="0.5"
                            min="0"
                          />
                        </div>
                        {errors.price && (
                          <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.price}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Hazırlık Süresi (dk)</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="number"
                            value={formData.preparationTime}
                            onChange={(e) => handleInputChange('preparationTime', parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="pl-10"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Category & Status */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Kategori & Durum
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Kategori *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map(category => (
                          <Button
                            key={category.id}
                            variant={formData.category === category.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleInputChange('category', category.id)}
                            className="justify-start"
                          >
                            <span className="mr-2">{category.icon}</span>
                            {category.name}
                          </Button>
                        ))}
                      </div>
                      {errors.category && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.isVegetarian}
                          onChange={(e) => handleInputChange('isVegetarian', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">🌱 Vejetaryen</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.isAvailable}
                          onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">✅ Mevcut</span>
                      </label>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Image */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Ürün Görseli
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Görsel URL *</label>
                      <Input
                        value={formData.image}
                        onChange={(e) => handleInputChange('image', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className={errors.image ? 'border-red-500' : ''}
                      />
                      {errors.image && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.image}
                        </p>
                      )}
                    </div>

                    {formData.image && (
                      <div className="relative">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </Card>

                {/* Tags */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Etiketler</h3>
                  
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {commonTags.map(tag => (
                        <Button
                          key={tag}
                          variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            if (selectedTags.includes(tag)) {
                              removeTag(tag);
                            } else {
                              addTag(tag);
                            }
                          }}
                          className="text-xs"
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Özel etiket ekle..."
                        className="flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && addTag(newTag)}
                      />
                      <Button onClick={() => addTag(newTag)} variant="outline" size="sm">
                        Ekle
                      </Button>
                    </div>

                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {selectedTags.map(tag => (
                          <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>

                {/* Additional Info */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Ek Bilgiler</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Kalori</label>
                      <Input
                        type="number"
                        value={formData.calories}
                        onChange={(e) => handleInputChange('calories', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">İçindekiler</label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={ingredientInput}
                          onChange={(e) => setIngredientInput(e.target.value)}
                          placeholder="İçerik ekle..."
                          className="flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addToArray('ingredients', ingredientInput);
                              setIngredientInput('');
                            }
                          }}
                        />
                        <Button
                          onClick={() => {
                            addToArray('ingredients', ingredientInput);
                            setIngredientInput('');
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Ekle
                        </Button>
                      </div>
                      {formData.ingredients && formData.ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {formData.ingredients.map(ingredient => (
                            <Badge
                              key={ingredient}
                              variant="outline"
                              className="cursor-pointer"
                              onClick={() => removeFromArray('ingredients', ingredient)}
                            >
                              {ingredient} ×
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Alerjenler</label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={allergenInput}
                          onChange={(e) => setAllergenInput(e.target.value)}
                          placeholder="Alerjen ekle..."
                          className="flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addToArray('allergens', allergenInput);
                              setAllergenInput('');
                            }
                          }}
                        />
                        <Button
                          onClick={() => {
                            addToArray('allergens', allergenInput);
                            setAllergenInput('');
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Ekle
                        </Button>
                      </div>
                      {formData.allergens && formData.allergens.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {formData.allergens.map(allergen => (
                            <Badge
                              key={allergen}
                              variant="destructive"
                              className="cursor-pointer"
                              onClick={() => removeFromArray('allergens', allergen)}
                            >
                              {allergen} ×
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onClose} disabled={isLoading()}>
              İptal
            </Button>
            <Button onClick={handleSave} disabled={isLoading()} className="flex items-center gap-2">
              {isLoading() ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {editingItem ? 'Güncelle' : 'Kaydet'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductFormModal;
