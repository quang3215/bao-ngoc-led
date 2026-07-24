"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, ArrowLeft, Image as ImageIcon, CheckCircle, Settings, FileText, X, ChevronRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, uploadFileToFirebase } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/settings";

type ViewState = 'list' | 'form';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewState, setViewState] = useState<ViewState>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Scraper state
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  
  // Upload states
  const [isUploadingAppImage, setIsUploadingAppImage] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "san-pham-chieu-sang",
    subCategory: "den-led-downlight-am-tran",
    price: 0,
    stock: 0,
    isBestSeller: false,
    images: "",
    specs: {
      wattage: "",
      voltage: "",
      voltage_range: "",
      luminous_flux: "",
      color_temperature: "",
      luminous_efficacy: "",
      cri: "",
      lifespan: "",
      hole_size: "",
      warranty: ""
    },
    features: [""],
    variants: [] as { name: string, price: number }[],
    application: {
      title: "",
      description: "",
      image: "",
      isHtml: false
    }
  });

  const categories = useSettingsStore(state => state.settings.categories);

  const handleScrape = async () => {
    if (!scrapeUrl.trim()) {
      toast.error("Vui lòng nhập URL sản phẩm Rạng Đông!");
      return;
    }
    
    setIsScraping(true);
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scrapeUrl })
      });
      
      const resData = await response.json();
      
      if (!response.ok || resData.error) {
        throw new Error(resData.error || "Lỗi cào dữ liệu");
      }
      
      const scrapedData = resData.data;
      
      // Auto fill form with scraped data
      setFormData(prev => ({
        ...prev,
        sku: scrapedData.sku || prev.sku,
        name: scrapedData.name || prev.name,
        price: scrapedData.price || prev.price,
        images: scrapedData.images ? scrapedData.images.join("\n") : prev.images,
        application: {
          title: scrapedData.application?.title || prev.application.title,
          description: scrapedData.description || prev.application.description,
          image: scrapedData.application?.image || prev.application.image,
          isHtml: prev.application.isHtml
        },
        specs: {
          ...prev.specs,
          wattage: scrapedData.specs.wattage || prev.specs.wattage,
          color_temperature: scrapedData.specs.color_temperature || prev.specs.color_temperature,
          hole_size: scrapedData.specs.hole_size || prev.specs.hole_size,
          luminous_flux: scrapedData.specs.luminous_flux || prev.specs.luminous_flux,
          lifespan: scrapedData.specs.lifespan || prev.specs.lifespan,
        }
      }));
      
      toast.success("Cào dữ liệu thành công! Hãy kiểm tra lại thông tin.");
      setScrapeUrl(""); // clear after success
    } catch (error: any) {
      console.error("Scrape error:", error);
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setIsScraping(false);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAppImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setIsUploadingAppImage(true);
    try {
      const downloadURL = await uploadFileToFirebase(`products/app_${Date.now()}_${file.name}`, file);
      setFormData(prev => ({
        ...prev,
        application: { ...prev.application, image: downloadURL }
      }));
      toast.success("Tải file lên thành công!");
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error(error.message || "Lỗi khi tải file lên!");
    } finally {
      setIsUploadingAppImage(false);
    }
  };

  const handleProductImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    setIsUploadingImages(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const downloadURL = await uploadFileToFirebase(`products/img_${Date.now()}_${file.name}`, file);
        urls.push(downloadURL);
      }
      
      const newUrlsString = urls.join("\n");
      setFormData(prev => ({
        ...prev,
        images: prev.images ? prev.images + "\n" + newUrlsString : newUrlsString
      }));
      toast.success(`Đã tải lên ${urls.length} file thành công!`);
    } catch (error: any) {
      console.error("Error uploading files:", error);
      toast.error(error.message || "Lỗi khi tải các file lên!");
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleOpenForm = (product?: any) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        sku: product.sku || "",
        name: product.name || "",
        category: product.category || "san-pham-chieu-sang",
        subCategory: product.subCategory || "den-led-downlight-am-tran",
        price: product.price || 0,
        stock: product.stock || 0,
        isBestSeller: product.isBestSeller || false,
        images: product.images ? product.images.join("\n") : "",
        specs: {
          wattage: product.specs?.wattage || "",
          voltage: product.specs?.voltage || "",
          voltage_range: product.specs?.voltage_range || "",
          luminous_flux: product.specs?.luminous_flux || "",
          color_temperature: product.specs?.color_temperature || "",
          luminous_efficacy: product.specs?.luminous_efficacy || "",
          cri: product.specs?.cri || "",
          lifespan: product.specs?.lifespan || "",
          hole_size: product.specs?.hole_size || "",
          warranty: product.specs?.warranty || ""
        },
        features: product.features?.length > 0 ? product.features : [""],
        variants: product.variants || [],
        application: {
          title: product.application?.title || "",
          description: product.application?.description || "",
          image: product.application?.image || "",
          isHtml: product.application?.isHtml || false
        }
      });
    } else {
      setEditingId(null);
      setFormData({
        sku: "", name: "", category: "san-pham-chieu-sang", subCategory: "den-led-downlight-am-tran", price: 0, stock: 0, isBestSeller: false, images: "",
        specs: {
          wattage: "", voltage: "", voltage_range: "", luminous_flux: "", color_temperature: "",
          luminous_efficacy: "", cri: "", lifespan: "", hole_size: "", warranty: ""
        },
        features: [""],
        variants: [],
        application: { title: "", description: "", image: "", isHtml: false }
      });
    }
    setViewState('form');
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => setFormData({ ...formData, features: [...formData.features, ""] });
  
  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    if (newFeatures.length === 0) newFeatures.push("");
    setFormData({ ...formData, features: newFeatures });
  };

  const handleVariantChange = (index: number, field: 'name' | 'price', value: string | number) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => setFormData({ ...formData, variants: [...formData.variants, { name: "", price: 0 }] });
  
  const removeVariant = (index: number) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Parse images (handle commas or newlines)
      const rawImages = formData.images.replace(/,/g, '\n');
      const parsedImages = rawImages.split('\n').map(i => i.trim()).filter(Boolean);

      const productData = {
        sku: formData.sku,
        name: formData.name,
        category: formData.category,
        subCategory: formData.subCategory,
        price: Number(formData.price),
        stock: Number(formData.stock),
        isBestSeller: Boolean(formData.isBestSeller),
        images: parsedImages,
        specs: formData.specs,
        features: formData.features.filter(f => f.trim() !== ""),
        variants: formData.variants.filter(v => v.name.trim() !== ""),
        application: {
          title: formData.application.title.trim(),
          description: formData.application.description.trim(),
          image: formData.application.image.trim(),
          isHtml: formData.application.isHtml || false
        }
      };

      // Ensure sku is used as document ID
      const docId = editingId || formData.sku;
      await setDoc(doc(db, "products", docId), productData);
      
      setViewState('list');
      fetchProducts();
      toast.success("Lưu sản phẩm thành công!");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Có lỗi xảy ra khi lưu!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
      toast.success("Đã xóa sản phẩm!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Lỗi khi xóa!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickCategoryChange = async (productId: string, field: 'category' | 'subCategory', value: string) => {
    try {
      const updateData: any = { [field]: value };
      if (field === 'category') {
        updateData.subCategory = ""; // Reset sub category when main category changes
      }
      
      await setDoc(doc(db, "products", productId), updateData, { merge: true });
      
      setProducts(prev => prev.map(p => {
        if (p.id === productId) {
          if (field === 'category') {
             return { ...p, category: value, subCategory: "" };
          }
          return { ...p, [field]: value };
        }
        return p;
      }));
      toast.success("Cập nhật danh mục thành công!");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Lỗi khi cập nhật danh mục!");
    }
  };

  if (viewState === 'form') {
    return (
      <div className="max-w-5xl mx-auto pb-20">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => setViewState('list')} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </Button>
          <h1 className="text-2xl font-bold">{editingId ? "Sửa Sản phẩm" : "Thêm Sản phẩm mới"}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SCRAPER TOOL */}
          {!editingId && (
            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Image src="/vercel.svg" alt="Rạng Đông" width={20} height={20} className="opacity-50" />
                </div>
                <h2 className="text-lg font-bold text-blue-900">Import tự động từ Rạng Đông</h2>
              </div>
              <p className="text-sm text-blue-700/80 mb-4">
                Dán đường link sản phẩm từ website rangdong.com.vn vào đây để tự động điền Tên, Giá, Ảnh và Thông số.
              </p>
              <div className="flex gap-3">
                <Input 
                  value={scrapeUrl}
                  onChange={(e) => setScrapeUrl(e.target.value)}
                  placeholder="https://rangdong.com.vn/den-led-bulb-a60n1-9w-pr83.html" 
                  className="flex-1 bg-white border-blue-200 focus-visible:ring-blue-500"
                />
                <Button 
                  type="button" 
                  onClick={handleScrape} 
                  disabled={isScraping || !scrapeUrl.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
                >
                  {isScraping ? (
                    <><Loader2 className="animate-spin h-4 w-4 mr-2" /> Đang cào...</>
                  ) : (
                    "Lấy dữ liệu"
                  )}
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* CỘT TRÁI (Nội dung chính) */}
            <div className="xl:col-span-2 space-y-8">
              {/* THÔNG TIN CƠ BẢN */}
              <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                <div className="flex items-center gap-2 mb-4 border-b pb-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-bold">Thông tin Cơ bản</h2>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label>Tên sản phẩm *</Label>
                    <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Vd: Đèn LED Âm trần..." className="font-semibold text-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label>Mô tả ngắn gọn (Không bắt buộc)</Label>
                    <textarea 
                      className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                      placeholder="Một vài dòng giới thiệu nổi bật về sản phẩm..."
                    />
                  </div>
                </div>
              </div>

              {/* MÔ TẢ CHI TIẾT (ỨNG DỤNG) */}
              <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                <div className="flex items-center gap-2 mb-4 border-b pb-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <h2 className="text-lg font-bold">Mô tả Ứng dụng & Bài viết</h2>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tiêu đề bài viết</Label>
                    <Input value={formData.application.title} onChange={(e) => setFormData({...formData, application: {...formData.application, title: e.target.value}})} placeholder="Vd: KHÔNG GIAN SỐNG HIỆN ĐẠI..." />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Nội dung chi tiết</Label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                          checked={formData.application.isHtml}
                          onChange={(e) => setFormData({...formData, application: {...formData.application, isHtml: e.target.checked}})}
                        />
                        Dùng mã HTML (Dành cho nâng cao)
                      </label>
                    </div>
                    <textarea 
                      className="w-full min-h-[250px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring leading-relaxed" 
                      value={formData.application.description} 
                      onChange={(e) => setFormData({...formData, application: {...formData.application, description: e.target.value}})} 
                      placeholder={formData.application.isHtml ? "<h1>Tiêu đề</h1><p>Nội dung...</p>" : "Nhập bài viết mô tả chi tiết về ứng dụng thực tế, ưu điểm của sản phẩm..."}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Banner/Ảnh minh họa bài viết</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={formData.application.image} 
                        onChange={(e) => setFormData({...formData, application: {...formData.application, image: e.target.value}})} 
                        placeholder="Nhập link HOẶC tải lên..." 
                        className="flex-1"
                      />
                      <div className="relative shrink-0 flex items-center">
                        <input 
                          type="file" 
                          accept="image/*,application/pdf"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={handleAppImageUpload}
                          disabled={isUploadingAppImage}
                        />
                        <Button type="button" variant="outline" className="px-4" disabled={isUploadingAppImage}>
                          {isUploadingAppImage ? <Loader2 className="h-4 w-4 animate-spin" /> : "Tải lên ảnh"}
                        </Button>
                      </div>
                    </div>
                    {formData.application.image && (
                      <div className="mt-2 w-full max-w-sm rounded-lg overflow-hidden border">
                        <img src={formData.application.image} alt="Preview" className="w-full h-auto object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* TÍNH NĂNG NỔI BẬT */}
              <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h2 className="text-lg font-bold">Đặc điểm nổi bật (Features)</h2>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addFeature}><Plus className="h-4 w-4 mr-1"/> Thêm dòng</Button>
                </div>
                <div className="space-y-3">
                  {formData.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <Input value={feature} onChange={(e) => handleFeatureChange(idx, e.target.value)} placeholder="Nhập gạch đầu dòng (vd: Tiết kiệm điện 80%)..." className="bg-white" />
                      <Button type="button" variant="ghost" size="icon" className="text-red-500 flex-shrink-0 hover:bg-red-50" onClick={() => removeFeature(idx)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* THÔNG SỐ KỸ THUẬT */}
              <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                <div className="flex items-center gap-2 mb-4 border-b pb-2">
                  <Settings className="h-5 w-5 text-orange-500" />
                  <h2 className="text-lg font-bold">Thông số Kỹ thuật</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <Label className="text-slate-500 text-xs uppercase font-bold tracking-wider">Công suất</Label>
                    <Input className="bg-white" value={formData.specs.wattage} onChange={(e) => setFormData({...formData, specs: {...formData.specs, wattage: e.target.value}})} placeholder="10W" />
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <Label className="text-slate-500 text-xs uppercase font-bold tracking-wider">Điện áp danh định</Label>
                    <Input className="bg-white" value={formData.specs.voltage} onChange={(e) => setFormData({...formData, specs: {...formData.specs, voltage: e.target.value}})} placeholder="220V/50Hz" />
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <Label className="text-slate-500 text-xs uppercase font-bold tracking-wider">Dải điện áp</Label>
                    <Input className="bg-white" value={formData.specs.voltage_range} onChange={(e) => setFormData({...formData, specs: {...formData.specs, voltage_range: e.target.value}})} placeholder="150V - 250V" />
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <Label className="text-slate-500 text-xs uppercase font-bold tracking-wider">Nhiệt độ màu</Label>
                    <Input className="bg-white" value={formData.specs.color_temperature} onChange={(e) => setFormData({...formData, specs: {...formData.specs, color_temperature: e.target.value}})} placeholder="6500K/4000K/3000K" />
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <Label className="text-slate-500 text-xs uppercase font-bold tracking-wider">Quang thông</Label>
                    <Input className="bg-white" value={formData.specs.luminous_flux} onChange={(e) => setFormData({...formData, specs: {...formData.specs, luminous_flux: e.target.value}})} placeholder="1000 lm" />
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <Label className="text-slate-500 text-xs uppercase font-bold tracking-wider">Hiệu suất sáng</Label>
                    <Input className="bg-white" value={formData.specs.luminous_efficacy} onChange={(e) => setFormData({...formData, specs: {...formData.specs, luminous_efficacy: e.target.value}})} placeholder="100 lm/W" />
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <Label className="text-slate-500 text-xs uppercase font-bold tracking-wider">CRI (Hoàn màu)</Label>
                    <Input className="bg-white" value={formData.specs.cri} onChange={(e) => setFormData({...formData, specs: {...formData.specs, cri: e.target.value}})} placeholder="80" />
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <Label className="text-slate-500 text-xs uppercase font-bold tracking-wider">Tuổi thọ</Label>
                    <Input className="bg-white" value={formData.specs.lifespan} onChange={(e) => setFormData({...formData, specs: {...formData.specs, lifespan: e.target.value}})} placeholder="30.000 giờ" />
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <Label className="text-slate-500 text-xs uppercase font-bold tracking-wider">Lỗ khoét (Nút)</Label>
                    <Input className="bg-white" value={formData.specs.hole_size} onChange={(e) => setFormData({...formData, specs: {...formData.specs, hole_size: e.target.value}})} placeholder="90mm" />
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <Label className="text-slate-500 text-xs uppercase font-bold tracking-wider">Bảo hành</Label>
                    <Input className="bg-white" value={formData.specs.warranty} onChange={(e) => setFormData({...formData, specs: {...formData.specs, warranty: e.target.value}})} placeholder="2 năm" />
                  </div>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI (Phân loại & Giá & Ảnh) */}
            <div className="space-y-8">
              {/* TRẠNG THÁI & PHÂN LOẠI */}
              <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                <h3 className="font-bold border-b pb-2">Tổ chức Sản phẩm</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Trạng thái</Label>
                    <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg border">
                      <input 
                        type="checkbox" 
                        id="isBestSeller"
                        checked={formData.isBestSeller}
                        onChange={e => setFormData({...formData, isBestSeller: e.target.checked})}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="isBestSeller" className="text-sm font-bold cursor-pointer text-orange-600">
                        🔥 Sản phẩm Bán chạy
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Mã SKU *</Label>
                    <Input required value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} disabled={!!editingId} placeholder="Vd: LED-AT-01" className="font-mono text-sm bg-slate-50" />
                  </div>

                  <div className="space-y-2">
                    <Label>Danh mục chính *</Label>
                    <select 
                      required 
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={categories?.some(c => c.slug === formData.category) ? formData.category : ""} 
                      onChange={(e) => {
                        const newCategory = e.target.value;
                        const defaultSub = categories?.find(c => c.slug === newCategory)?.subCategories?.[0]?.slug || "";
                        setFormData({...formData, category: newCategory, subCategory: defaultSub});
                      }}
                    >
                      <option value="" disabled>-- Chọn danh mục --</option>
                      {categories?.map(cat => (
                        <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Danh mục con</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.subCategory} 
                      onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                    >
                      <option value="">-- Chọn (Không bắt buộc) --</option>
                      {(categories?.find(c => c.slug === formData.category)?.subCategories || []).map(sub => (
                        <option key={sub.slug} value={sub.slug}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* GIÁ & TỒN KHO */}
              <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                <h3 className="font-bold border-b pb-2">Giá & Tồn kho</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Giá bán (VNĐ) *</Label>
                    <Input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="text-lg font-bold text-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tồn kho</Label>
                    <Input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="font-bold">Các Phiên bản (Màu/CS)</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addVariant} className="h-8 text-xs"><Plus className="h-3 w-3 mr-1"/> Thêm</Button>
                  </div>
                  {formData.variants.length === 0 ? (
                    <p className="text-xs text-gray-500 italic text-center p-4 bg-slate-50 rounded-lg border border-dashed">Sản phẩm không có phiên bản (sử dụng giá mặc định).</p>
                  ) : (
                    <div className="space-y-3">
                      {formData.variants.map((variant, idx) => (
                        <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 relative group">
                          <Button type="button" variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeVariant(idx)}>
                            <X className="h-3 w-3" />
                          </Button>
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs text-slate-500">Tên (VD: 90/10W)</Label>
                              <Input className="h-8 text-sm" value={variant.name} onChange={(e) => handleVariantChange(idx, 'name', e.target.value)} />
                            </div>
                            <div>
                              <Label className="text-xs text-slate-500">Giá (VNĐ)</Label>
                              <Input className="h-8 text-sm font-medium" type="number" value={variant.price} onChange={(e) => handleVariantChange(idx, 'price', Number(e.target.value))} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* HÌNH ẢNH */}
              <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-purple-600" />
                    <h2 className="text-lg font-bold">Thư viện Ảnh</h2>
                  </div>
                </div>
                
                {/* Image Gallery Preview */}
                <div className="grid grid-cols-3 gap-3">
                  {formData.images.split('\n').map(url => url.trim()).filter(Boolean).map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg border overflow-hidden group bg-slate-50">
                      <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          type="button" 
                          size="icon" 
                          variant="destructive" 
                          className="h-8 w-8 rounded-full"
                          onClick={() => {
                            const urls = formData.images.split('\n').map(u => u.trim()).filter(Boolean);
                            urls.splice(idx, 1);
                            setFormData({...formData, images: urls.join('\n')});
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Upload Button */}
                  <label className="relative aspect-square rounded-lg border-2 border-dashed border-slate-300 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer flex flex-col items-center justify-center text-slate-500 group">
                    <input 
                      type="file" 
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleProductImagesUpload}
                      disabled={isUploadingImages}
                    />
                    {isUploadingImages ? (
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : (
                      <>
                        <Plus className="h-6 w-6 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium">Thêm ảnh</span>
                      </>
                    )}
                  </label>
                </div>
                <p className="text-xs text-slate-500">Bạn cũng có thể dán link ảnh trực tiếp bên dưới nếu cần:</p>
                <textarea 
                  className="w-full min-h-[80px] rounded-md border border-input bg-slate-50 px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono text-slate-400 focus:text-slate-900" 
                  value={formData.images} 
                  onChange={(e) => setFormData({...formData, images: e.target.value})} 
                  placeholder="https://.../img.jpg"
                />
              {/* LƯU THAY ĐỔI */}
              <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4 sticky top-6">
                <Button type="submit" className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                  {editingId ? "Lưu thay đổi" : "Xuất bản Sản phẩm"}
                </Button>
                <Button type="button" variant="outline" className="w-full h-12" onClick={() => setViewState('list')}>
                  Hủy bỏ
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý Sản phẩm</h1>
        <div className="flex gap-2">
          <Button className="gap-2" onClick={() => handleOpenForm()}>
            <Plus className="h-4 w-4" />Thêm sản phẩm mới
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">Mã SKU</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Giá bán</th>
                <th className="px-6 py-4">Tồn kho</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && products.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8">Đang tải dữ liệu...</td></tr>
              )}
              {!isLoading && products.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8">Chưa có sản phẩm nào.</td></tr>
              )}
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
                        <Image src={product.images?.[0] || "https://placehold.co/100"} alt={product.name} fill className="object-contain p-1" />
                      </div>
                      <span className="font-semibold text-slate-900 line-clamp-2 max-w-[250px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{product.sku}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 w-[160px]">
                      <select 
                        className="text-sm bg-transparent border border-transparent focus:border-purple-200 focus:ring-1 focus:ring-purple-500 rounded px-2 py-1 -ml-2 text-slate-700 font-medium w-full cursor-pointer hover:bg-slate-100 transition-colors"
                        value={product.category || ""}
                        onChange={(e) => handleQuickCategoryChange(product.id, 'category', e.target.value)}
                      >
                        <option value="" disabled>Chọn danh mục...</option>
                        {categories?.map((c: any) => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                      
                      {(categories?.find((c: any) => c.slug === product.category)?.subCategories?.length ?? 0) > 0 && (
                        <div className="flex items-center text-xs text-slate-400 pl-1">
                          <ChevronRight className="h-3 w-3 shrink-0 mr-1" />
                          <select 
                            className="text-xs bg-transparent border border-transparent focus:border-purple-200 focus:ring-1 focus:ring-purple-500 rounded px-1 py-1 -ml-1 text-slate-500 w-full cursor-pointer hover:bg-slate-100 transition-colors"
                            value={product.subCategory || ""}
                            onChange={(e) => handleQuickCategoryChange(product.id, 'subCategory', e.target.value)}
                          >
                            <option value="">Không có DM con</option>
                            {categories?.find((c: any) => c.slug === product.category)?.subCategories?.map((s: any) => (
                              <option key={s.slug} value={s.slug}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 h-8 w-8" onClick={() => handleOpenForm(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-slate-400 hover:text-destructive hover:bg-red-50 h-8 w-8" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {products.length > itemsPerPage && (
          <div className="flex items-center justify-between px-6 py-4 border-t bg-white">
            <div className="text-sm text-slate-500">
              Hiển thị <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-medium">{Math.min(currentPage * itemsPerPage, products.length)}</span> trong <span className="font-medium">{products.length}</span> sản phẩm
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <div className="text-sm font-medium px-2">
                Trang {currentPage} / {totalPages}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Tiếp
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
