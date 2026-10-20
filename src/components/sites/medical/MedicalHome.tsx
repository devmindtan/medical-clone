"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronUp, Search, Menu, X, MapPin, Mail, Phone } from "lucide-react";
import content from "./content.json";

const origin = "";
const assets = "/sites/medical/";
const productSlugs = ["he-thong-khi-y-te", "he-thong-khi-sach", "he-thong-bao-goi-y-ta", "he-thong-chuyen-mau-benh-pham", "he-thong-noi-that-phong-mo-cao-cap", "cac-san-pham-dung-cho-benh-vien", "thiet-bi-phong-mo", "thiet-bi-hoi-suc-cap-cuu", "san-pham-khu-khuan-tiet-trung"];
const navigation = [
  ["Trang chủ", "/"], ["Giới thiệu", "/gioi-thieu/"], ["Sản phẩm", "/category/san-pham/"],
  ["Dự án", "/category/du-an/"], ["Tin tức", "/category/tin-tuc/"], ["Tuyển dụng", "/category/tuyen-dung/"], ["Liên hệ", "/lien-he/"],
];
const about = "MEDICAL là công ty cung cấp các giải pháp kỹ thuật hiện đại, hoàn chỉnh, chuyên sâu trong lĩnh vực y tế. Với mục tiêu an toàn và chất lượng, chúng tôi tự hào là một trong các công ty dẫn đầu cung cấp các giải pháp Hệ thống thiết bị y tế, Hệ thống cơ điện hoàn chỉnh cao cấp trong lĩnh vực y tế cho các dự án đầu tư xây dựng mới hay cải tạo Bệnh viện đạt các tiêu chuẩn quốc gia và tiêu chuẩn quốc tế. Hãy tham gia cùng chúng tôi hôm nay để góp phần nâng cao chất lượng cuộc sống và bảo vệ sức khỏe cộng đồng.";
const reasons = [
  ["mbws-img13-1.png", "DỊCH VỤ CHUYÊN NGHIỆP TẬN TÂM"], ["mbws-img14-1.png", "SẢN PHẨM AN TOÀN CHẤT LƯỢNG"],
  ["mbws-img15-2.png", "ÁP DỤNG CÔNG NGHỆ TIÊN TIẾN HIỆN ĐẠI NHẤT"], ["mbws-img16-1.png", "ĐỘI NGŨ NHÂN SỰ CHUYÊN MÔN CAO"],
  ["mbws-img17-1.png", "NĂNG LỰC VÀ KINH NGHIỆM TRIỂN KHAI CHO NHIỀU DỰ ÁN LỚN"], ["mbws-img18-1.png", "ĐẠT NHIỀU GIẢI THƯỞNG UY TÍN"],
];
const benefits = [
  ["mbws-img34-1.png", "MÔI TRƯỜNG LÀM VIỆC", "CHUYÊN NGHIỆP"], ["mbws-img35-1.png", "CƠ HỘI ĐƯỢC THAM GIA", "KHÓA HỌC CHUYÊN MÔN"],
  ["mbws-img36-1.png", "CƠ HỘI THĂNG TIẾN", "THEO NĂNG LỰC"], ["mbws-img37.png", "ĐỒNG NGHIỆP", "THÂN THIỆN, HÒA ĐỒNG"],
];

function ButtonLink({ href, children, white = false, outline = false }: { href: string; children: React.ReactNode; white?: boolean; outline?: boolean }) {
  return <a className={`button${white ? " white" : ""}${outline ? " outline" : ""}`} href={href}>{children}{!outline && <ChevronRight size={16} aria-hidden="true" />}</a>;
}

export function SectionTitle({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <h2 className={`section-title${light ? " light" : ""}`}>{children}</h2>;
}

export function Header({ section }: { section?: string } = {}) {
  const currentPath = usePathname();
  const pathname = section || currentPath;
  const activeIndex = pathname.startsWith("/category/san-pham") ? 2 : pathname.startsWith("/category/du-an") ? 3 : pathname.startsWith("/category/tin-tuc") ? 4 : pathname.startsWith("/category/tuyen-dung") ? 5 : navigation.findIndex(([, href]) => href === pathname || href === pathname + "/");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenuOpen(false); setSearchOpen(false); } };
    document.addEventListener("keydown", close);
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.removeEventListener("keydown", close); document.body.style.overflow = ""; };
  }, [menuOpen]);
  return <>
    <header className="site-header"><div className="header-inner container">
      <Link className="logo" href="/" aria-label="MEDICAL - Trang chủ"><img src={assets + "medical.png"} width={180} height={34} alt="MEDICAL" /></Link>
      <nav className="desktop-nav" aria-label="Điều hướng chính">{navigation.map(([label, href], i) => <a className={i === activeIndex ? "active" : ""} key={label} href={i === 0 ? "/" : origin + href}>{label}</a>)}</nav>
      <div className="search-holder"><button className="icon-button search-toggle" aria-label="Tìm kiếm" aria-expanded={searchOpen} onClick={() => setSearchOpen(!searchOpen)}><Search size={24} /></button>
        {searchOpen && <form className="search-popover" action={origin + "/"} role="search"><input autoFocus name="s" type="search" placeholder="Tìm kiếm..." aria-label="Từ khóa tìm kiếm" required /><button aria-label="Tìm kiếm"><Search size={19} /></button></form>}
      </div>
      <button className="icon-button mobile-toggle" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={25} /></button>
    </div></header>
    {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}><aside className="mobile-panel" aria-label="Menu" onClick={e => e.stopPropagation()}><button className="icon-button close-menu" aria-label="Đóng menu" onClick={() => setMenuOpen(false)}><X /></button><form className="mobile-search" action={origin + "/"}><input name="s" type="search" placeholder="Tìm kiếm..." aria-label="Tìm kiếm" /><button aria-label="Tìm kiếm"><Search size={20} /></button></form><nav>{navigation.map(([label, href], i) => <a key={label} href={i === 0 ? "/" : origin + href}>{label}</a>)}</nav></aside></div>}
  </>;
}

function Hero() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef(0);
  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setSlide(s => (s + 1) % 2), 6000);
    return () => window.clearInterval(timer);
  }, [paused]);
  return <section className="hero" aria-label="Giải pháp y tế" aria-roledescription="carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={e => { touchStart.current = e.touches[0].clientX; }} onTouchEnd={e => { if (Math.abs(e.changedTouches[0].clientX - touchStart.current) > 40) setSlide(s => 1 - s); }}>
    {["mbws-img2-6.jpg", "mbws-img3-4.jpg"].map((file, i) => <div className={`hero-slide${slide === i ? " selected" : ""}`} key={file} aria-hidden={slide !== i}><img className="hero-image" src={assets + file} alt={i === 0 ? "Hệ thống thiết bị phòng mổ hiện đại" : "Giải pháp chẩn đoán hình ảnh X-RAY"} /><div className="hero-container container"><div className="hero-box"><div className="hero-copy"><h1>{i === 0 ? <>Đánh giá <b>ADN</b> để cải thiện sức khỏe</> : <>Phân tích <b>X-RAY</b> để đánh giá tình trạng sức khỏe</>}</h1><ButtonLink href={origin + "/category/san-pham/"}>Xem thêm</ButtonLink></div></div></div></div>)}
    <button className="hero-arrow previous" aria-label="Slide trước" onClick={() => setSlide(s => 1 - s)}><ChevronLeft size={38} /></button><button className="hero-arrow next" aria-label="Slide tiếp theo" onClick={() => setSlide(s => 1 - s)}><ChevronRight size={38} /></button>
    <div className="hero-dots">{[0, 1].map(i => <button key={i} aria-label={`Chuyển đến slide ${i + 1}`} aria-current={slide === i} onClick={() => setSlide(i)} />)}</div>
  </section>;
}

function Projects() {
  const [tab, setTab] = useState(0);
  const tabs = ["Tất cả", "Bệnh viện nhà nước", "Bệnh viện tư nhân", "Khác"];
  // The source repeats the same three projects in each category.
  return <section className="projects"><SectionTitle light>DỰ ÁN</SectionTitle><div className="project-tabs" role="tablist" aria-label="Loại dự án">{tabs.map((label, i) => <button key={label} role="tab" id={`project-tab-${i}`} aria-controls="project-panel" aria-selected={tab === i} onClick={() => setTab(i)}>{label}</button>)}</div><div className="project-grid" id="project-panel" role="tabpanel" aria-labelledby={`project-tab-${tab}`}>{content.projects.slice(tab * 3, tab * 3 + 3).map(project => <a className="project-card" key={project.href} href={project.href}><img src={project.image} alt={project.title} loading="lazy" /><h3>{project.title}</h3></a>)}</div><ButtonLink href={origin + "/category/du-an/"} white>Xem tất cả</ButtonLink></section>;
}

function Partners() {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  useEffect(() => { const close = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); }; window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close); }, []);
  return <section className="partners"><SectionTitle>ĐỐI TÁC CỦA CHÚNG TÔI</SectionTitle><div className="partner-carousel container"><button className="partner-arrow previous" aria-label="Đối tác trước" onClick={() => setIndex(i => (i - 1 + content.partners.length) % content.partners.length)}><ChevronLeft /></button><div className="partner-track">{Array.from({ length: 5 }, (_, offset) => content.partners[(index + offset) % content.partners.length]).map((src, i) => <button className="partner-logo" key={src + i} onClick={() => setLightbox(src)} aria-label={`Xem logo đối tác ${index + i + 1}`}><img src={src} alt={`Đối tác MEDICAL ${index + i + 1}`} loading="lazy" /></button>)}</div><button className="partner-arrow next" aria-label="Đối tác tiếp theo" onClick={() => setIndex(i => (i + 1) % content.partners.length)}><ChevronRight /></button></div>{lightbox && <div className="lightbox" onClick={() => setLightbox(null)} role="dialog" aria-modal="true" aria-label="Logo đối tác"><button aria-label="Đóng" className="lightbox-close"><X size={30} /></button><img src={lightbox.replace("-300x225", "")} alt="Logo đối tác" /></div>}</section>;
}

export function ContactForm() {
  const [saved, setSaved] = useState(false);
  return <section className="registration" id="tu-van"><div className="container"><div className="registration-content"><SectionTitle>ĐĂNG KÝ</SectionTitle><p className="contact-intro">Hãy liên hệ với chúng tôi</p><form className="contact-form" onSubmit={e => { e.preventDefault(); const values = Object.fromEntries(new FormData(e.currentTarget)); localStorage.setItem("medical-contact-request", JSON.stringify(values)); setSaved(true); }}>
    <label>Họ tên *<input name="name" autoComplete="name" required maxLength={400} /></label><label>Địa chỉ *<input name="address" autoComplete="street-address" required maxLength={400} /></label><label>Email *<input name="email" type="email" autoComplete="email" required maxLength={400} /></label><label>Số điện thoại *<input name="phone" type="tel" autoComplete="tel" required maxLength={30} /></label><label className="full-field">Nội dung<textarea name="message" rows={6} maxLength={2000} /></label><div className="full-field"><button className="button" type="submit">Gửi</button></div>{saved && <p className="form-status full-field" role="status">Thông tin đã được lưu trên thiết bị này. Vui lòng gửi yêu cầu đến <a href="mailto:sales@matbao.ws">sales@matbao.ws</a> hoặc gọi <a href="tel:02877777999">(028) 7777 7999</a> để được tư vấn.</p>}
  </form></div></div></section>;
}

export function ContactMap() {
  return <section className="contact-map"><iframe title="Bản đồ địa chỉ MEDICAL" src={content.map} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" /><div className="map-contact"><SectionTitle light>THÔNG TIN LIÊN HỆ</SectionTitle><p><MapPin /><span>54 Đường C1, P.13, Q. Tân Bình, TP. HCM</span></p><p><Mail /><a href="mailto:sales@matbao.ws">sales@matbao.ws</a></p><p><Phone /><a href="tel:02877777999">(028) 7777 7999</a></p></div></section>;
}

export function Footer({ includeMap = true }: { includeMap?: boolean }) {
  return <>{includeMap && <ContactMap />}<footer><div className="container footer-grid"><div className="footer-about"><img src={assets + "medical-trang.png"} alt="MEDICAL" width={250} height={49} /><p>MEDICAL được biết đến như một doanh nghiệp dẫn đầu tại Việt Nam chuyên cung cấp các giải pháp kỹ thuật hiện đại, chuyên sâu, hoàn chỉnh và trọn gói trong các lĩnh vực sau: Hệ thống khí y tế trung tâm, Nội thất phòng mổ, thiết bị phòng mổ, ICU, hệ thống khí sạch áp lực dương, hệ thống báo gọi y tá… cho các dự án đầu tư xây dựng mới hay cải tạo Bệnh viện đạt các tiêu chuẩn quốc gia và tiêu chuẩn quốc tế.</p><div className="social-icons"><a href="https://www.facebook.com/" aria-label="Facebook"><span aria-hidden="true">f</span></a><a href="https://www.instagram.com/" aria-label="Instagram"><span aria-hidden="true">◎</span></a><a href="https://www.tiktok.com/" aria-label="TikTok">♪</a><a href="https://x.com/" aria-label="X">𝕏</a><a href="https://www.youtube.com/" aria-label="YouTube"><span aria-hidden="true">▶</span></a></div></div><div><h3>THÔNG TIN</h3><ul className="footer-links">{navigation.filter((_, i) => i !== 0 && i !== 3).map(([label, href]) => <li key={label}><a href={origin + href}>{label}</a></li>)}</ul></div><div><h3>TIN MỚI</h3><div className="footer-news">{content.news.slice(0, 4).map(item => <a href={item.href} key={item.href}>{item.title}</a>)}</div></div><div><h3>LIÊN HỆ</h3><strong>CÔNG TY CỔ PHẦN KỸ THUẬT VÀ THIẾT BỊ MEDICAL</strong><p>Địa chỉ: 54 đường C1, Phường 13, Quận Tân Bình, Hồ Chí Minh</p><p>Tel: <a href="tel:02877777999">(028) 7777 7999</a><br />Fax: (028) 7777 7999<br />Email: <a href="mailto:sales@matbao.ws">sales@matbao.ws</a></p></div></div><div className="container copyright">Copyright 2026 © Thiết kế website bởi <a href="https://matbao.ws/">Mắt Bão WS</a></div></footer></>;
}

export function MedicalHome() {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => { const handleScroll = () => setShowTop(window.scrollY > 500); window.addEventListener("scroll", handleScroll, { passive: true }); return () => window.removeEventListener("scroll", handleScroll); }, []);
  return <><a className="skip-link" href="#main">Chuyển đến nội dung</a><Header /><main id="main"><Hero /><section className="about"><div className="about-content"><SectionTitle>GIỚI THIỆU</SectionTitle><p>{about}</p><ButtonLink href={origin + "/gioi-thieu/"}>Xem chi tiết</ButtonLink></div></section><section className="products"><div className="container"><SectionTitle>GIẢI PHÁP VÀ SẢN PHẨM</SectionTitle><div className="product-grid">{content.products.map((product, i) => <a className={`product-card product-${i}`} href={"/" + productSlugs[i] + "/"} key={product.title}><img src={product.image} alt={product.title} loading="lazy" /><h3>{product.title}</h3></a>)}</div><div className="center"><ButtonLink href={origin + "/category/san-pham/"}>Xem thêm</ButtonLink></div></div></section>
    {content.services.map((service, i) => <section className={`service service-${i}`} key={service.image}><div className={`service-row container${i % 2 ? " reversed" : ""}`}><div className="service-copy"><p className="eyebrow">{service.eyebrow}</p><h2>{service.title}</h2><ul>{service.items.map(item => <li key={item}>{item}</li>)}</ul><ButtonLink href="#tu-van">Tư vấn ngay</ButtonLink></div><img className="service-image" src={service.image} alt={service.title} loading="lazy" /></div></section>)}
    <section className="why-choose"><div className="container"><div className="why-content"><SectionTitle>TẠI SAO NÊN CHỌN CHÚNG TÔI ?</SectionTitle><div className="reasons">{reasons.map(([src, text]) => <div className="reason" key={text}><img src={assets + src} alt="" loading="lazy" /><h3>{text}</h3></div>)}</div><ButtonLink href="#tu-van">Tư vấn ngay</ButtonLink></div></div></section><Projects /><section className="news"><div className="container"><SectionTitle>TIN TỨC</SectionTitle><div className="news-grid">{content.news.map(item => <article className="news-card" key={item.href}><a href={item.href}><img src={item.image} alt={item.title} loading="lazy" /></a><div className="news-copy"><h3><a href={item.href}>{item.title}</a></h3><time dateTime="2019-05-22">22/05/2019</time><p>{item.excerpt}</p><ButtonLink outline href={item.href}>Xem thêm</ButtonLink></div></article>)}</div></div></section><section className="careers"><div className="container"><SectionTitle>HÃY GIA NHẬP CHÚNG TÔI</SectionTitle><div className="benefit-grid">{benefits.map(([src, text, bold]) => <a href={origin + "/category/tuyen-dung/"} className="benefit" key={src}><img src={assets + src} alt="" loading="lazy" /><h3>{text}<br /><strong>{bold}</strong></h3></a>)}</div><ButtonLink href={origin + "/category/tuyen-dung/"}>Xem tất cả</ButtonLink></div></section><Partners /><ContactForm /></main><Footer />{showTop && <button className="back-to-top" aria-label="Về đầu trang" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><ChevronUp /></button>}</>;
}


