import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Level {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  levels: Level[];
  createdAt: string;
}

export const Levels = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [addLevelModal, setAddLevelModal] = useState<{ open: boolean; categoryId: string | null }>({
    open: false,
    categoryId: null
  });
  const [newLevelForm, setNewLevelForm] = useState({
    name: '',
    description: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockCategories: Category[] = [
      {
        id: '1',
        name: 'Verification Levels',
        description: 'User verification and trust levels',
        createdAt: '2024-01-01',
        levels: [
          { id: '1', name: 'Bronze', description: 'Basic verification', categoryId: '1', createdAt: '2024-01-01' },
          { id: '2', name: 'Silver', description: 'Enhanced verification', categoryId: '1', createdAt: '2024-01-02' },
          { id: '3', name: 'Gold', description: 'Premium verification', categoryId: '1', createdAt: '2024-01-03' }
        ]
      },
      {
        id: '2',
        name: 'Service Tiers',
        description: 'Document delivery service levels',
        createdAt: '2024-01-01',
        levels: [
          { id: '4', name: 'Standard', description: 'Regular delivery service', categoryId: '2', createdAt: '2024-01-01' },
          { id: '5', name: 'Express', description: 'Fast delivery service', categoryId: '2', createdAt: '2024-01-02' }
        ]
      },
      {
        id: '3',
        name: 'Priority Levels',
        description: 'Document urgency classifications',
        createdAt: '2024-01-01',
        levels: []
      }
    ];

    setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 500);
  }, []);

  const handleAddLevel = async (categoryId: string) => {
    if (!newLevelForm.name.trim()) {
      toast({
        title: t('status.error'),
        description: t('levels.required'),
        variant: 'destructive'
      });
      return;
    }

    try {
      // In a real app, this would be an API call
      const newLevel: Level = {
        id: Date.now().toString(),
        name: newLevelForm.name.trim(),
        description: newLevelForm.description.trim() || undefined,
        categoryId,
        createdAt: new Date().toISOString()
      };

      setCategories(prev => prev.map(category => 
        category.id === categoryId 
          ? { ...category, levels: [...category.levels, newLevel] }
          : category
      ));

      setNewLevelForm({ name: '', description: '' });
      setAddLevelModal({ open: false, categoryId: null });

      toast({
        title: t('status.success'),
        description: t('levels.levelCreated')
      });
    } catch (error) {
      toast({
        title: t('status.error'),
        description: 'Failed to create level',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteLevel = async (levelId: string, categoryId: string) => {
    if (!confirm(t('levels.confirmDelete'))) return;

    try {
      setCategories(prev => prev.map(category => 
        category.id === categoryId 
          ? { ...category, levels: category.levels.filter(level => level.id !== levelId) }
          : category
      ));

      toast({
        title: t('status.success'),
        description: t('levels.levelDeleted')
      });
    } catch (error) {
      toast({
        title: t('status.error'),
        description: 'Failed to delete level',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('actions.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {t('levels.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('levels.subtitle')}
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('levels.noCategories')}</h3>
              <p className="text-muted-foreground">{t('ui.noData')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id} className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.levels.length} {category.levels.length === 1 ? t('levels.level') : t('levels.level') + 's'}
                    </Badge>
                  </CardTitle>
                  {category.description && (
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Levels List */}
                  <div className="space-y-2">
                    {category.levels.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        {t('levels.noLevels')}
                      </p>
                    ) : (
                      category.levels.map((level) => (
                        <div key={level.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{level.name}</h4>
                            {level.description && (
                              <p className="text-xs text-muted-foreground">{level.description}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {/* Edit functionality can be added later */}}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteLevel(level.id, category.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Level Button */}
                  <Dialog 
                    open={addLevelModal.open && addLevelModal.categoryId === category.id}
                    onOpenChange={(open) => setAddLevelModal({ 
                      open, 
                      categoryId: open ? category.id : null 
                    })}
                  >
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setAddLevelModal({ open: true, categoryId: category.id })}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {t('levels.addLevel')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>{t('levels.createLevel')}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="levelName">{t('levels.levelName')}</Label>
                          <Input
                            id="levelName"
                            placeholder={t('levels.enterLevelName')}
                            value={newLevelForm.name}
                            onChange={(e) => setNewLevelForm(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="levelDescription">{t('levels.description')}</Label>
                          <Textarea
                            id="levelDescription"
                            placeholder={t('levels.enterDescription')}
                            value={newLevelForm.description}
                            onChange={(e) => setNewLevelForm(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setAddLevelModal({ open: false, categoryId: null });
                              setNewLevelForm({ name: '', description: '' });
                            }}
                          >
                            {t('actions.cancel')}
                          </Button>
                          <Button onClick={() => handleAddLevel(category.id)}>
                            {t('actions.create')}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
