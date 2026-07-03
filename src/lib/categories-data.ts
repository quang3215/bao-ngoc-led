export interface CategoryItem {
  name: string;
  slug: string;
}

export interface MainCategory {
  name: string;
  slug: string;
  subCategories: CategoryItem[];
  iconUrl?: string;
  iconHoverUrl?: string;
  href?: string;
  bannerUrl?: string;
}

export const MEGA_MENU_CATEGORIES: MainCategory[] = [
  {
    name: "Sản phẩm mới",
    slug: "san-pham-moi",
    subCategories: [],
    href: "/tim-kiem?sort=newest",
    iconUrl: "https://api.iconify.design/lucide/star.svg",
    iconHoverUrl: "https://api.iconify.design/lucide/star.svg"
  },
  {
    name: "Đèn LED",
    slug: "san-pham-chieu-sang",
    iconUrl: "https://api.iconify.design/lucide/lightbulb.svg",
    iconHoverUrl: "https://api.iconify.design/lucide/lightbulb.svg",
    subCategories: [
      { name: "Đèn LED Downlight âm trần", slug: "den-led-downlight-am-tran" },
      { name: "Bóng đèn LED Bulb", slug: "bong-den-led-bulb" },
      { name: "Bộ đèn LED tuýp", slug: "bo-den-led-tuyp" },
      { name: "Bóng đèn LED tuýp", slug: "bong-den-led-tuyp" },
      { name: "Đèn LED ốp trần", slug: "den-led-op-tran" },
      { name: "Đèn LED Panel", slug: "den-led-panel" },
      { name: "Đèn LED chiếu pha", slug: "den-led-chieu-pha" },
      { name: "Đèn LED Highbay", slug: "den-led-highbay" },
      { name: "Đèn đường LED", slug: "den-duong-led" },
      { name: "Sản phẩm học đường", slug: "san-pham-hoc-duong" },
      { name: "Đèn LED dây", slug: "den-led-day" },
      { name: "Đèn LED Tracklight", slug: "den-led-tracklight" },
      { name: "Đèn LED gắn tường", slug: "den-led-gan-tuong" },
      { name: "Đèn LED gương", slug: "den-led-guong" },
      { name: "Đèn ray LED", slug: "den-ray-led" },
      { name: "Đèn led Linear", slug: "den-led-linear" },
      { name: "Bộ đèn bán nguyệt", slug: "bo-den-ban-nguyet" },
      { name: "Đèn LED chỉ dẫn", slug: "den-led-chi-dan" },
      { name: "Đèn LED chống ẩm", slug: "den-led-chong-am" },
      { name: "Phụ kiện đèn LED", slug: "phu-kien-den-led" }
    ]
  },
  {
    name: "Nhà thông minh Rallismart",
    slug: "thiet-bi-thong-minh",
    iconUrl: "https://api.iconify.design/lucide/cpu.svg",
    iconHoverUrl: "https://api.iconify.design/lucide/cpu.svg",
    subCategories: [
      { name: "Đèn thông minh", slug: "den-thong-minh" },
      { name: "Công tắc thông minh", slug: "cong-tac-thong-minh" },
      { name: "Ổ cắm thông minh", slug: "o-cam-thong-minh" },
      { name: "Cảm biến thông minh", slug: "cam-bien-thong-minh" },
      { name: "Bảng điều khiển cảnh", slug: "bang-dieu-khien-canh" },
      { name: "Camera thông minh", slug: "camera-thong-minh" },
      { name: "Công tắc chuyển mạch", slug: "cong-tac-chuyen-mach" },
      { name: "Ổ cắm chống giật", slug: "o-cam-chong-giat" },
      { name: "Bộ điều khiển trung tâm", slug: "bo-dieu-khien-trung-tam" },
      { name: "Aptomat thông minh", slug: "aptomat-thong-minh" },
      { name: "Bộ lặp sóng", slug: "bo-lap-song" },
      { name: "Combo Smart", slug: "combo-smart" },
      { name: "Loa thông minh", slug: "loa-thong-minh" }
    ]
  },
  {
    name: "Đèn bàn",
    slug: "den-ban",
    iconUrl: "https://api.iconify.design/lucide/lamp-desk.svg",
    iconHoverUrl: "https://api.iconify.design/lucide/lamp-desk.svg",
    subCategories: [
      { name: "Đèn bàn học bảo vệ thị lực", slug: "den-ban-hoc-bao-ve-thi-luc" },
      { name: "Đèn bàn làm việc", slug: "den-ban-lam-viec" }
    ]
  },
  {
    name: "Bình - Phích nước",
    slug: "phich-nuoc",
    iconUrl: "https://api.iconify.design/lucide/coffee.svg",
    iconHoverUrl: "https://api.iconify.design/lucide/coffee.svg",
    subCategories: [
      { name: "Phích đựng nước", slug: "phich-dung-nuoc" },
      { name: "Bình nước cầm tay", slug: "binh-nuoc-cam-tay" },
      { name: "Phích cầm tay", slug: "phich-cam-tay" },
      { name: "Bình giữ nhiệt", slug: "binh-giu-nhiet" },
      { name: "Bình đựng thức ăn", slug: "binh-dung-thuc-an" },
      { name: "Bình ủ - Bình trà", slug: "binh-u-binh-tra" },
      { name: "Ruột phích", slug: "ruot-phich" },
      { name: "Phích pha trà - Cà phê", slug: "phich-pha-tra-ca-phe" }
    ]
  },
  {
    name: "Thiết Bị Điện",
    slug: "thiet-bi-dien",
    iconUrl: "https://api.iconify.design/lucide/plug.svg",
    iconHoverUrl: "https://api.iconify.design/lucide/plug.svg",
    subCategories: [
      { name: "Aptomat", slug: "aptomat" },
      { name: "Tủ Aptomat", slug: "tu-aptomat" },
      { name: "Vỏ hộp Aptomat", slug: "vo-hop-aptomat" },
      { name: "Đèn pin", slug: "den-pin" },
      { name: "Ổ cắm điện", slug: "o-cam-dien" },
      { name: "Phích cắm điện", slug: "phich-cam-dien" },
      { name: "Hạt công tắc", slug: "hat-cong-tac" },
      { name: "Mặt công tắc", slug: "mat-cong-tac" },
      { name: "Đèn bắt muỗi, côn trùng", slug: "den-bat-muoi-con-trung" },
      { name: "Mặt Aptomat", slug: "mat-aptomat" },
      { name: "Thiết bị cảm biến", slug: "thiet-bi-cam-bien" },
      { name: "Vợt bắt muỗi", slug: "vot-bat-muoi" },
      { name: "Quạt hút", slug: "quat-hut" },
      { name: "Đèn điều hòa phòng tắm", slug: "den-dieu-hoa-phong-tam" },
      { name: "Quạt điều hòa phòng tắm", slug: "quat-dieu-hoa-phong-tam" }
    ]
  },
  {
    name: "Năng lượng mặt trời",
    slug: "nang-luong-mat-troi",
    iconUrl: "https://api.iconify.design/lucide/sun.svg",
    iconHoverUrl: "https://api.iconify.design/lucide/sun.svg",
    subCategories: [
      { name: "Điện mặt trời mái nhà", slug: "dien-mat-troi-mai-nha" },
      { name: "Đèn năng lượng mặt trời", slug: "den-nang-luong-mat-troi" }
    ]
  },
  {
    name: "Dự án",
    slug: "du-an",
    iconUrl: "https://api.iconify.design/lucide/briefcase.svg",
    iconHoverUrl: "https://api.iconify.design/lucide/briefcase.svg",
    subCategories: [
      { name: "Bộ đèn bán nguyệt", slug: "bo-den-ban-nguyet" },
      { name: "Bộ đèn chống ẩm", slug: "bo-den-chong-am" },
      { name: "Bộ đèn LED âm trần", slug: "bo-den-led-am-tran" },
      { name: "Bộ đèn LED Tuýp", slug: "bo-den-led-tuyp" },
      { name: "Bóng đèn LED Bulb", slug: "bong-den-led-bulb" },
      { name: "Bóng đèn LED tuýp", slug: "bong-den-led-tuyp" },
      { name: "Đèn đường LED", slug: "den-duong-led" },
      { name: "Đèn gương", slug: "den-guong" },
      { name: "Đèn LED chỉ dẫn", slug: "den-led-chi-dan" },
      { name: "Đèn LED chống nổ", slug: "den-led-chong-no" },
      { name: "Đèn LED Downlight", slug: "den-led-downlight" },
      { name: "Đèn LED gắn tường", slug: "den-led-gan-tuong" },
      { name: "Đèn LED Highbay", slug: "den-led-highbay" },
      { name: "Đèn LED Lowbay", slug: "den-led-lowbay" },
      { name: "Đèn LED ốp trần", slug: "den-led-op-tran" },
      { name: "Đèn LED Panel", slug: "den-led-panel" },
      { name: "Đèn lớp học", slug: "den-lop-hoc" },
      { name: "Đèn pha LED", slug: "den-pha-led" }
    ]
  },
  {
    name: "Siêu Khuyến Mãi",
    slug: "sieu-khuyen-mai",
    href: "https://rangdongstore.vn/khuyen-mai/",
    subCategories: [],
    iconUrl: "https://api.iconify.design/lucide/tag.svg",
    iconHoverUrl: "https://api.iconify.design/lucide/tag.svg"
  },
  {
    name: "Bộ sưu tập",
    slug: "bo-suu-tap",
    href: "https://rangdongstore.vn/bo-suu-tap",
    subCategories: [],
    iconUrl: "https://api.iconify.design/lucide/layers.svg",
    iconHoverUrl: "https://api.iconify.design/lucide/layers.svg"
  }
];
