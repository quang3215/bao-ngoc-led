import { create } from 'zustand';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MEGA_MENU_CATEGORIES, MainCategory } from '@/lib/categories-data';

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  isMegaMenu: boolean;
  iconType: string;
}

export interface SocialLinks {
  facebook?: string;
  youtube?: string;
  zaloOA?: string;
  tiktok?: string;
}

export interface FooterLinkGroup {
  id: string;
  title: string;
  links: { label: string; href: string }[];
}

export interface SiteSettings {
  hotline: string;
  zalo: string;
  logoUrl?: string;
  mapUrl?: string;
  socialLinks?: SocialLinks;
  menuItems: MenuItem[];
  categories: MainCategory[];
  footer: {
    companyName: string;
    taxCode: string;
    address: string;
    email: string;
    description: string;
    linkGroups: FooterLinkGroup[];
  };
}

interface SettingsState {
  settings: SiteSettings;
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: {
    hotline: "0936 668 583", // Default fallback
    zalo: "0936668583", // Default fallback
    logoUrl: "",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.301549429419!2d105.84589991476313!3d21.012616486006764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab8ea88915e7%3A0x7d0fa040da50fbc1!2zMTEgUC4gUGjDuW5nIEto4bKhYyBLaG9hbiwgTmfDtSBUaMOsIE5o4bqtbSwgSGFpIELDoCBUcsawbmcsIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1689000000000!5m2!1svi!2s",
    socialLinks: {
      facebook: "https://facebook.com",
      youtube: "https://youtube.com",
      zaloOA: "https://zalo.me",
      tiktok: "https://tiktok.com"
    },
    categories: MEGA_MENU_CATEGORIES, // Fallback to hardcoded list initially
    menuItems: [
      { id: "1", label: "Trang chủ", href: "/", isMegaMenu: false, iconType: "home" },
      { id: "2", label: "Danh mục sản phẩm", href: "#", isMegaMenu: true, iconType: "grid" },
      { id: "3", label: "Về chúng tôi", href: "/ve-chung-toi", isMegaMenu: false, iconType: "info" },
      { id: "4", label: "Liên hệ", href: "/lien-he", isMegaMenu: false, iconType: "phone" }
    ],
    footer: {
      companyName: "CÔNG TY CỔ PHẦN GIẢI PHÁP CHIẾU SÁNG BẢO NGỌC",
      taxCode: "0109102232",
      address: "Số 11, Phố Phùng Khắc Khoan, Phường Hai Bà Trưng, Thành phố Hà Nội",
      email: "contact@baongocled.com",
      description: "Tiên phong kiến tạo không gian ánh sáng hoàn mỹ. Cung cấp giải pháp chiếu sáng toàn diện, thi công dự án lớn, hệ thống nhà thông minh (Smart Home) và phân phối bán lẻ thiết bị điện.",
      linkGroups: [
        {
          id: "group-1",
          title: "Danh mục nổi bật",
          links: [
            { label: "Đèn LED Âm trần", href: "/danh-muc/den-led-am-tran" },
            { label: "Đèn LED Tube", href: "/danh-muc/den-led-tuyp" },
            { label: "Đèn LED Panel", href: "/danh-muc/den-led-panel" },
            { label: "Đèn LED Pha", href: "/danh-muc/den-led-pha" },
          ]
        },
        {
          id: "group-2",
          title: "Hỗ trợ khách hàng",
          links: [
            { label: "Chính sách bảo hành", href: "/trang/chinh-sach-bao-hanh" },
            { label: "Chính sách đổi trả", href: "/trang/chinh-sach-doi-tra" },
            { label: "Hướng dẫn mua hàng", href: "/trang/huong-dan-mua-hang" },
            { label: "Phương thức thanh toán", href: "/trang/thanh-toan" },
          ]
        }
      ]
    }
  },
  isLoading: true,
  fetchSettings: async () => {
    try {
      const docRef = doc(db, 'settings', 'general');
      const docSnap = await getDoc(docRef);
      
      const menuRef = doc(db, 'settings', 'menu_links');
      const menuSnap = await getDoc(menuRef);

      const catRef = doc(db, 'settings', 'categories');
      const catSnap = await getDoc(catRef);

      const data = docSnap.exists() ? docSnap.data() : {};
      const menuData = menuSnap.exists() ? menuSnap.data() : {};
      const catData = catSnap.exists() ? catSnap.data() : {};

      set({
        settings: {
          hotline: data.hotline || "0936 668 583",
          zalo: data.zalo || "0936668583",
          logoUrl: data.logoUrl || "",
          mapUrl: data.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.301549429419!2d105.84589991476313!3d21.012616486006764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab8ea88915e7%3A0x7d0fa040da50fbc1!2zMTEgUC4gUGjDuW5nIEto4bKhYyBLaG9hbiwgTmfDtSBUaMOsIE5o4bqtbSwgSGFpIELDoCBUcsawbmcsIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1689000000000!5m2!1svi!2s",
          socialLinks: {
            facebook: data.socialLinks?.facebook || "https://facebook.com",
            youtube: data.socialLinks?.youtube || "https://youtube.com",
            zaloOA: data.socialLinks?.zaloOA || "https://zalo.me",
            tiktok: data.socialLinks?.tiktok || "https://tiktok.com"
          },
          categories: catData.items || MEGA_MENU_CATEGORIES,
          menuItems: menuData.items || [
            { id: "1", label: "Trang chủ", href: "/", isMegaMenu: false, iconType: "home" },
            { id: "2", label: "Danh mục sản phẩm", href: "#", isMegaMenu: true, iconType: "grid" },
            { id: "3", label: "Về chúng tôi", href: "/ve-chung-toi", isMegaMenu: false, iconType: "info" },
            { id: "4", label: "Liên hệ", href: "/lien-he", isMegaMenu: false, iconType: "phone" }
          ],
          footer: {
            companyName: data.footer?.companyName || "CÔNG TY CỔ PHẦN GIẢI PHÁP CHIẾU SÁNG BẢO NGỌC",
            taxCode: data.footer?.taxCode || "0109102232",
            address: data.footer?.address || "Số 11, Phố Phùng Khắc Khoan, Phường Hai Bà Trưng, Thành phố Hà Nội",
            email: data.footer?.email || "contact@baongocled.com",
            description: data.footer?.description || "Tiên phong kiến tạo không gian ánh sáng hoàn mỹ. Cung cấp giải pháp chiếu sáng toàn diện, thi công dự án lớn, hệ thống nhà thông minh (Smart Home) và phân phối bán lẻ thiết bị điện.",
            linkGroups: data.footer?.linkGroups || [
              {
                id: "group-1",
                title: "Danh mục nổi bật",
                links: [
                  { label: "Đèn LED Âm trần", href: "/danh-muc/den-led-am-tran" },
                  { label: "Đèn LED Tube", href: "/danh-muc/den-led-tuyp" },
                  { label: "Đèn LED Panel", href: "/danh-muc/den-led-panel" },
                  { label: "Đèn LED Pha", href: "/danh-muc/den-led-pha" },
                ]
              },
              {
                id: "group-2",
                title: "Hỗ trợ khách hàng",
                links: [
                  { label: "Chính sách bảo hành", href: "/trang/chinh-sach-bao-hanh" },
                  { label: "Chính sách đổi trả", href: "/trang/chinh-sach-doi-tra" },
                  { label: "Hướng dẫn mua hàng", href: "/trang/huong-dan-mua-hang" },
                  { label: "Phương thức thanh toán", href: "/trang/thanh-toan" },
                ]
              }
            ]
          }
        }
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
