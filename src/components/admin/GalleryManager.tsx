"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/i18n/config";

export default function GalleryManager({ locale }: { locale: Locale }) {
  const supabase = createClient();
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  async function load() {
    const { data } = await supabase.from("gallery_images").select("*").order("display_order");
    setImages(data ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${crypto.randomUUID()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("gallery").upload(path, file);
    if (!error) {
      const { data: publicUrl } = supabase.storage.from("gallery").getPublicUrl(path);
      await supabase.from("gallery_images").insert({
        image_url: publicUrl.publicUrl,
        display_order: images.length,
      });
      load();
    }
    setUploading(false);
    e.target.value = "";
  }

  async function updateField(id: string, patch: Record<string, any>) {
    await supabase.from("gallery_images").update(patch).eq("id", id);
  }

  async function remove(id: string, imageUrl: string) {
    await supabase.from("gallery_images").delete().eq("id", id);
    const path = imageUrl.split("/gallery/")[1];
    if (path) await supabase.storage.from("gallery").remove([path]);
    load();
  }

  return (
    <div className="mt-6">
      <label className="mb-4 inline-block cursor-pointer rounded-full bg-royal px-5 py-2 text-sm font-semibold text-white shadow-soft hover:bg-royal-dark">
        {uploading ? "…" : locale === "en" ? "+ Upload image" : "+ Ajouter une image"}
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </label>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="overflow-hidden rounded-xl2 bg-white shadow-card ring-1 ring-lavender-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.image_url} alt="" className="aspect-square w-full object-cover" />
            <div className="space-y-2 p-3">
              <input
                defaultValue={img.style_name_en ?? ""}
                onBlur={(e) => updateField(img.id, { style_name_en: e.target.value })}
                placeholder={locale === "en" ? "Style name (EN)" : "Nom du style (EN)"}
                className="w-full rounded border border-lavender px-2 py-1 text-xs"
              />
              <input
                defaultValue={img.style_name_fr ?? ""}
                onBlur={(e) => updateField(img.id, { style_name_fr: e.target.value })}
                placeholder={locale === "en" ? "Style name (FR)" : "Nom du style (FR)"}
                className="w-full rounded border border-lavender px-2 py-1 text-xs"
              />
              <button onClick={() => remove(img.id, img.image_url)} className="text-xs text-red-600 hover:underline">
                {locale === "en" ? "Remove" : "Retirer"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
