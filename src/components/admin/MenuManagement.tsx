import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Package,
  Clock,
  Star,
  TrendingUp
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import { useLoading } from '../../hooks/useLoading';
import { menuFirebaseService } from '../../services/menuFirebaseService';
import type {
  MenuItemFirestore,
  CreateMenuItemInput,
  UpdateMenuItemInput
} from '../../services/menuFirebaseService';
import ProductFormModal from './ProductFormModal';

// Category icons mapping
const getCategoryIcon = (category: string) => {
  const iconMap: { [key: string]: string } = {
    doner: '🥙',
    makarna: '🍝',
    icecek: '🥤',
    tatli: '🍰',
    salata: '🥗',
    corbalar: '🍲'
  };
  return iconMap[category.toLowerCase()] || '🍽️';
};

// Category display names
const getCategoryDisplayName = (category: string) => {
  const displayMap: { [key: string]: string } = {
    doner: 'Döner',
    makarna: 'Makarna',
    icecek: 'İçecek',
    tatli: 'Tatlı',
    salata: 'Salata',
    corbalar: 'Çorbalar'
  };
  return displayMap[category.toLowerCase()] || category;
};

interface MenuManagementProps { }

const MenuManagement: React.FC<MenuManagementProps> = () => {
  const [menuItems, setMenuItems] = useState<MenuItemFirestore[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemFirestore | null>(null);

  const { showToast } = useToast();
  const { withLoading, isLoading } = useLoading();

  // Load menu items and categories
  const loadMenuData = withLoading(async () => {
    try {
      const [items, cats] = await Promise.all([
        menuFirebaseService.getAllMenuItems(),
        menuFirebaseService.getCategories()
      ]);

      setMenuItems(items);
      setCategories(cats);
      console.log('📋 Menu data loaded:', { items: items.length, categories: cats.length });
    } catch (error) {
      console.error('❌ Error loading menu data:', error);
      showToast('Menü verileri yüklenirken hata oluştu', 'error');
    }
  });

  // Toggle availability
  const handleToggleAvailability = withLoading(async (id: string, currentStatus: boolean) => {
    try {
      await menuFirebaseService.toggleAvailability(id, !currentStatus);

      // Update local state
      setMenuItems(prev => prev.map(item =>
        item.id === id ? { ...item, isAvailable: !currentStatus } : item
      ));

      showToast(
        `Ürün ${!currentStatus ? 'aktif' : 'pasif'} edildi`,
        'success'
      );
    } catch (error) {
      console.error('❌ Error toggling availability:', error);
      showToast('Ürün durumu güncellenirken hata oluştu', 'error');
    }
  });

  // Delete menu item
  const handleDeleteItem = withLoading(async (id: string, name: string) => {
    if (!confirm(`"${name}" ürününü silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      await menuFirebaseService.deleteMenuItem(id);

      // Update local state
      setMenuItems(prev => prev.filter(item => item.id !== id));

      showToast('Ürün başarıyla silindi', 'success');
    } catch (error) {
      console.error('❌ Error deleting item:', error);
      showToast('Ürün silinirken hata oluştu', 'error');
    }
  });

  // Handle save from modal
  const handleSaveItem = (savedItem: MenuItemFirestore) => {
    if (editingItem) {
      // Update existing item in list
      setMenuItems(prev => prev.map(item =>
        item.id === savedItem.id ? savedItem : item
      ));
    } else {
      // Add new item to list
      setMenuItems(prev => [savedItem, ...prev]);
    }

    // Close modal and reset editing state
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Open modal for editing
  const handleEditItem = (item: MenuItemFirestore) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Open modal for new item
  const handleNewItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Load data on component mount
  useEffect(() => {
    loadMenuData();
  }, []);

  // Calculate stats
  const stats = {
    total: menuItems.length,
    available: menuItems.filter(item => item.isAvailable).length,
    unavailable: menuItems.filter(item => !item.isAvailable).length,
    categories: categories.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            📋 Menü Yönetimi
          </h1>
          <p className="text-gray-600">
            Menü ürünlerini ekleyin, düzenleyin ve yönetin
          </p>
        </div>

        <Button
          onClick={handleNewItem}
          className="flex items-center gap-2"
          disabled={isLoading()}
        >
          <Plus className="w-4 h-4" />
          Yeni Ürün Ekle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Toplam Ürün</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Aktif Ürün</p>
              <p className="text-xl font-bold text-gray-900">{stats.available}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <EyeOff className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pasif Ürün</p>
              <p className="text-xl font-bold text-gray-900">{stats.unavailable}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Kategori</p>
              <p className="text-xl font-bold text-gray-900">{stats.categories}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Ürün adı veya açıklamasında ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {getCategoryIcon(category)} {getCategoryDisplayName(category)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Menu Items List */}
      {isLoading() ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <Badge variant={item.isAvailable ? 'success' : 'secondary'}>
                          {item.isAvailable ? 'Aktif' : 'Pasif'}
                        </Badge>
                        {item.isVegetarian && (
                          <Badge variant="success">
                            🌱 Vejetaryen
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 truncate mb-2">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{getCategoryIcon(item.category)} {getCategoryDisplayName(item.category)}</span>
                        <span>₺{item.price.toFixed(2)}</span>
                        {item.preparationTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.preparationTime} dk
                          </span>
                        )}
                        {item.rating && item.rating > 0 && (
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {item.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* Toggle Availability */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleAvailability(item.id!, item.isAvailable)}
                        disabled={isLoading()}
                      >
                        {item.isAvailable ? (
                          <EyeOff className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-green-500" />
                        )}
                      </Button>

                      {/* Edit */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditItem(item)}
                        disabled={isLoading()}
                      >
                        <Edit className="w-4 h-4 text-blue-500" />
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id!, item.name)}
                        disabled={isLoading()}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredItems.length === 0 && !isLoading() && (
            <Card className="p-8 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ürün Bulunamadı
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Arama kriterlerinize uygun ürün bulunamadı.'
                  : 'Henüz hiç ürün eklenmemiş.'
                }
              </p>
              {searchTerm || selectedCategory !== 'all' ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                >
                  Filtreleri Temizle
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setEditingItem(null);
                    setIsModalOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Ürünü Ekle
                </Button>
              )}
            </Card>
          )}
        </div>
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        editingItem={editingItem}
        onSave={handleSaveItem}
      />
    </div>
  );
};

export default MenuManagement;