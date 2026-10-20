"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return visible && <button className="back-to-top" aria-label="Về đầu trang" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><ChevronUp /></button>;
}

export function CommentForm({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    try {
      const remembered = JSON.parse(localStorage.getItem("medical-comment-author") || "null") as Record<string, string> | null;
      if (remembered) for (const name of ["name", "email", "website"]) {
        const input = formRef.current?.elements.namedItem(name);
        if (input instanceof HTMLInputElement) input.value = remembered[name] || "";
      }
    } catch { localStorage.removeItem("medical-comment-author"); }
  }, []);
  return <section className="article-comments" id="respond"><h3>Để lại một bình luận</h3><p>Email của bạn sẽ không được hiển thị công khai. Các trường bắt buộc được đánh dấu *</p><form ref={formRef} onSubmit={event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const comment = Object.fromEntries(form);
    const key = `medical-comment-${slug}`;
    localStorage.setItem(key, JSON.stringify(comment));
    if (form.get("remember")) localStorage.setItem("medical-comment-author", JSON.stringify({ name: form.get("name"), email: form.get("email"), website: form.get("website") }));
    setSaved(true);
  }}>
    <label>Bình luận *<textarea name="comment" rows={5} required maxLength={65525} /></label>
    <div className="comment-fields"><label>Tên *<input name="name" autoComplete="name" required maxLength={245} /></label><label>Email *<input name="email" type="email" autoComplete="email" required maxLength={100} /></label><label>Trang web<input name="website" type="url" autoComplete="url" /></label></div>
    <label className="comment-remember"><input name="remember" type="checkbox" />Lưu tên của tôi, email, và trang web trong trình duyệt này cho lần bình luận kế tiếp của tôi.</label>
    <button className="button" type="submit">GỬI BÌNH LUẬN</button>
    {saved && <p className="comment-status" role="status">Bình luận đã được lưu trên thiết bị này, chưa được gửi lên máy chủ.</p>}
  </form></section>;
}
