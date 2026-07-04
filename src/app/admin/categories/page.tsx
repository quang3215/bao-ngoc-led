"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, ArrowUp, ArrowDown, Grid, ListTree, ChevronDown, ChevronRight, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, uploadFileToFirebase } from "@/lib/firebase";
import { toast } from "sonner";
import { MEGA_MENU_CATEGORIES, MainCategory, CategoryItem } from "@/lib/categories-data";
import { useSettingsStore } from "@/store/settings";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminCategoriesConfig() {
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const [uploadingState, setUploadingState] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const docRef = doc(db, "settings", "categories");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().items) {
        setCategories(docSnap.data().items);
      } else {
        // Fallback to static seed data
        setCategories(MEGA_MENU_CATEGORIES);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Không thể tải Cấu hình Danh mục.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "settings", "categories"), { items: categories });
      useSettingsStore.getState().fetchSettings();
      toast.success("Đã lưu cấu trúc Danh mục thành công!");
    } catch (error) {
      console.error("Error saving categories:", error);
      toast.error("Có lỗi xảy ra khi lưu.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleExpand = (slug: string) => {
    if (expandedCats.includes(slug)) {
      setExpandedCats(expandedCats.filter(s => s !== slug));
    } else {
      setExpandedCats([...expandedCats, slug]);
    }
  };

  const handleImageUpload = async (index: number, field: keyof MainCategory, file: File) => {
    if (!file) return;
    const uploadKey = `${index}-${field}`;
    setUploadingState(prev => ({ ...prev, [uploadKey]: true }));
    
    try {
      const downloadURL = await uploadFileToFirebase(`categories/banner_${Date.now()}_${file.name}`, file);
      
      const newCategories = [...categories];
      newCategories[index] = { ...newCategories[index], [field]: downloadURL };
      setCategories(newCategories);
      toast.success("Tải ảnh lên thành công!");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Lỗi khi tải ảnh lên!");
    } finally {
      setUploadingState(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  const addMainCategory = () => {
    const tempSlug = `cat-${Date.now()}`;
    setCategories([...categories, { name: "Danh mục mới", slug: tempSlug, subCategories: [] }]);
    setExpandedCats([...expandedCats, tempSlug]);
  };

  const updateMainCategory = (index: number, field: keyof MainCategory, value: string) => {
    const newCats = [...categories];
    newCats[index] = { ...newCats[index], [field]: value };
    setCategories(newCats);
  };

  const removeMainCategory = (index: number) => {
    const newCats = [...categories];
    newCats.splice(index, 1);
    setCategories(newCats);
  };

  const moveMainCategory = (index: number, direction: 'up' | 'down') => {
    const newCats = [...categories];
    if (direction === 'up' && index > 0) {
      [newCats[index - 1], newCats[index]] = [newCats[index], newCats[index - 1]];
    } else if (direction === 'down' && index < newCats.length - 1) {
      [newCats[index + 1], newCats[index]] = [newCats[index], newCats[index + 1]];
    }
    setCategories(newCats);
  };

  const addSubCategory = (mainIndex: number) => {
    const newCats = [...categories];
    newCats[mainIndex].subCategories.push({ name: "Danh mục con mới", slug: `sub-${Date.now()}` });
    setCategories(newCats);
  };

  const updateSubCategory = (mainIndex: number, subIndex: number, field: 'name' | 'slug', value: string) => {
    const newCats = [...categories];
    newCats[mainIndex].subCategories[subIndex][field] = value;
    setCategories(newCats);
  };

  const removeSubCategory = (mainIndex: number, subIndex: number) => {
    const newCats = [...categories];
    newCats[mainIndex].subCategories.splice(subIndex, 1);
    setCategories(newCats);
  };

  const moveSubCategory = (mainIndex: number, subIndex: number, direction: 'up' | 'down') => {
    const newCats = [...categories];
    const subs = newCats[mainIndex].subCategories;
    if (direction === 'up' && subIndex > 0) {
      [subs[subIndex - 1], subs[subIndex]] = [subs[subIndex], subs[subIndex - 1]];
    } else if (direction === 'down' && subIndex < subs.length - 1) {
      [subs[subIndex + 1], subs[subIndex]] = [subs[subIndex], subs[subIndex + 1]];
    }
    setCategories(newCats);
  };

  // Convert name to slug automatically
  const generateSlug = (text: string) => {
    return text.toString().toLowerCase()
      .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
      .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
      .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
      .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
      .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
      .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
      .replace(/đ/gi, 'd')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="font-medium animate-pulse">Đang tải cấu trúc Danh mục...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Quản lý Danh mục</h1>
          <p className="text-slate-500">Quản lý Cây danh mục 2 cấp: Cấp 1 (Chính) và Cấp 2 (Danh mục con).</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-primary h-11 px-6 font-bold shadow-sm rounded-xl">
          <Save className="h-4 w-4" />
          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <ListTree className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-lg">Cấu trúc Cây Danh Mục</h2>
          </div>
          <Button onClick={addMainCategory} variant="outline" size="sm" className="gap-2 rounded-xl bg-white border-primary/20 hover:border-primary/50 text-primary hover:bg-primary/5">
            <Plus className="h-4 w-4" />
            Thêm Danh mục Cấp 1
          </Button>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          {categories.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <Grid className="h-10 w-10 mx-auto text-slate-300 mb-3" />
              Chưa có danh mục nào. Hãy bắt đầu bằng việc thêm Danh mục Cấp 1.
            </div>
          ) : (
            categories.map((mainCat, mIndex) => {
              const isExpanded = expandedCats.includes(mainCat.slug);
              
              return (
                <div key={mIndex} className={`border rounded-xl transition-all duration-300 ${isExpanded ? 'border-primary/30 shadow-md ring-1 ring-primary/5' : 'border-slate-200 hover:border-primary/30'}`}>
                  {/* MAIN CATEGORY ROW */}
                  <div className={`p-4 flex items-center gap-3 bg-white ${isExpanded ? 'rounded-t-xl border-b border-slate-100' : 'rounded-xl'}`}>
                    
                    <button onClick={() => toggleExpand(mainCat.slug)} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors shrink-0">
                      {isExpanded ? <ChevronDown className="h-5 w-5 text-primary" /> : <ChevronRight className="h-5 w-5" />}
                    </button>
                    
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button onClick={() => moveMainCategory(mIndex, 'up')} disabled={mIndex === 0} className="p-1 rounded-sm text-slate-400 hover:bg-slate-100 hover:text-primary disabled:opacity-30">
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button onClick={() => moveMainCategory(mIndex, 'down')} disabled={mIndex === categories.length - 1} className="p-1 rounded-sm text-slate-400 hover:bg-slate-100 hover:text-primary disabled:opacity-30">
                        <ArrowDown className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="flex-1 flex flex-col gap-3 ml-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                          value={mainCat.name} 
                          onChange={(e) => {
                            updateMainCategory(mIndex, 'name', e.target.value);
                            // Auto generate slug if slug is generic or empty
                            if (mainCat.slug.startsWith('cat-') || !mainCat.slug) {
                              updateMainCategory(mIndex, 'slug', generateSlug(e.target.value));
                            }
                          }}
                          className="font-bold text-slate-900 border-slate-200 focus:border-primary/50"
                          placeholder="Tên danh mục chính (VD: Thiết bị điện)"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-sm hidden lg:inline-block shrink-0">Slug:</span>
                          <Input 
                            value={mainCat.slug} 
                            onChange={(e) => updateMainCategory(mIndex, 'slug', e.target.value)}
                            className="font-mono text-xs text-slate-500 bg-slate-50"
                            placeholder="thiet-bi-dien"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm hidden lg:inline-block shrink-0 min-w-[70px]">Banner:</span>
                        <div className="flex-1 flex gap-2">
                          <Input 
                            value={mainCat.bannerUrl || ''} 
                            onChange={(e) => updateMainCategory(mIndex, 'bannerUrl', e.target.value)}
                            className="text-sm text-slate-600 bg-white flex-1"
                            placeholder="Nhập Link ảnh HOẶC Tải ảnh lên..."
                          />
                          <div className="relative shrink-0 flex items-center">
                            <input 
                              type="file" 
                              accept="image/*,application/pdf"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleImageUpload(mIndex, 'bannerUrl', e.target.files[0]);
                                }
                              }}
                              disabled={uploadingState[`${mIndex}-bannerUrl`]}
                            />
                            <Button type="button" variant="outline" className="px-4 bg-white" disabled={uploadingState[`${mIndex}-bannerUrl`]}>
                              {uploadingState[`${mIndex}-bannerUrl`] ? "Đang tải..." : "Tải lên từ máy"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-4">
                      <Button onClick={() => addSubCategory(mIndex)} variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 hidden md:flex">
                        <Plus className="h-4 w-4 mr-1" /> Danh mục con
                      </Button>
                      <Button onClick={() => addSubCategory(mIndex)} variant="ghost" size="icon" className="text-primary hover:text-primary hover:bg-primary/10 md:hidden">
                        <Plus className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xoá danh mục</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc muốn xóa Danh mục này và toàn bộ danh mục con bên trong? Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeMainCategory(mIndex)} className="bg-red-600 hover:bg-red-700">Xóa</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {/* SUB CATEGORIES AREA */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-50/50 rounded-b-xl border-t border-slate-100 pl-14">
                      <div className="space-y-3">
                        {mainCat.subCategories.length === 0 ? (
                          <div className="text-sm text-slate-500 italic py-2">
                            Chưa có danh mục con nào. Bấm nút Thêm để tạo mới.
                          </div>
                        ) : (
                          mainCat.subCategories.map((subCat, sIndex) => (
                            <div key={sIndex} className="flex items-center gap-3 bg-white p-2 border border-slate-100 rounded-lg shadow-sm hover:border-slate-300 transition-colors group">
                              <div className="flex flex-col gap-0.5 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => moveSubCategory(mIndex, sIndex, 'up')} disabled={sIndex === 0} className="p-0.5 rounded-sm text-slate-400 hover:bg-slate-100 hover:text-primary disabled:opacity-30">
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                                <button onClick={() => moveSubCategory(mIndex, sIndex, 'down')} disabled={sIndex === mainCat.subCategories.length - 1} className="p-0.5 rounded-sm text-slate-400 hover:bg-slate-100 hover:text-primary disabled:opacity-30">
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                              </div>

                              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mx-1"></div>

                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <Input 
                                  value={subCat.name} 
                                  onChange={(e) => {
                                    updateSubCategory(mIndex, sIndex, 'name', e.target.value);
                                    if (subCat.slug.startsWith('sub-') || !subCat.slug) {
                                      updateSubCategory(mIndex, sIndex, 'slug', generateSlug(e.target.value));
                                    }
                                  }}
                                  className="h-8 text-sm"
                                  placeholder="Tên danh mục con"
                                />
                                <Input 
                                  value={subCat.slug} 
                                  onChange={(e) => updateSubCategory(mIndex, sIndex, 'slug', e.target.value)}
                                  className="h-8 text-xs font-mono text-slate-500 bg-slate-50"
                                  placeholder="danh-muc-con"
                                />
                              </div>

                              <Button onClick={() => removeSubCategory(mIndex, sIndex)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 shrink-0 opacity-50 group-hover:opacity-100 transition-all">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        )}
                        <Button onClick={() => addSubCategory(mIndex)} variant="outline" size="sm" className="mt-2 h-8 text-xs bg-white text-slate-500 border-dashed hover:border-primary hover:text-primary transition-colors">
                          <Plus className="h-3 w-3 mr-1" /> Thêm danh mục con
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
