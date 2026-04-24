import Image from "next/image";
import Link from "next/link";
import { fetchPageById } from "@/lib/notion";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

function getText(property: PageObjectResponse["properties"][string]): string {
  switch (property.type) {
    case "title":
      return property.title.map((t) => t.plain_text).join("");
    case "rich_text":
      return property.rich_text.map((t) => t.plain_text).join("");
    case "multi_select":
      return property.multi_select.map((s) => s.name).join(" / ");
    case "date":
      return property.date?.start ?? "";
    default:
      return "";
  }
}

function getImageUrl(property: PageObjectResponse["properties"][string]): string | null {
  if (property.type !== "files") return null;
  const file = property.files[0];
  if (!file) return null;
  if (file.type === "file") return file.file.url;
  if (file.type === "external") return file.external.url;
  return null;
}

export default async function WorkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await fetchPageById(id) as PageObjectResponse;
  const props = page.properties;

  const titleProp = props["作品名"] ?? props["Name"] ?? Object.values(props).find(p => p.type === "title");
  const title = titleProp ? getText(titleProp) : "無題";
  const description = props["作品概要"] ? getText(props["作品概要"]) : "";
  const date = props["制作年月日"] ? getText(props["制作年月日"]) : "";
  const tools = props["使用ツール"] ? getText(props["使用ツール"]) : "";
  const imageUrl = props["作品写真"] ? getImageUrl(props["作品写真"]) : null;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ヘッダー */}
      <header className="border-b border-white/10 px-4 py-4 md:px-8 md:py-6">
        <Link
          href="/portfolio"
          className="text-white/40 hover:text-white text-sm transition-colors"
        >
          ← ポートフォリオに戻る
        </Link>
      </header>

      {/* 作品画像（大きく表示） */}
      {imageUrl && (
        <div className="relative w-full h-[40vh] md:h-[60vh] bg-zinc-900">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain"
            unoptimized
            priority
          />
        </div>
      )}

      {/* 作品情報 */}
      <div className="max-w-2xl mx-auto px-4 py-8 md:px-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 leading-tight">{title}</h1>

        {description && (
          <p className="text-white/60 text-sm md:text-base leading-relaxed mb-8 md:mb-10">{description}</p>
        )}

        <div className="border-t border-white/10 pt-6 md:pt-8 space-y-4">
          {date && (
            <div className="flex flex-col sm:flex-row sm:gap-8 gap-1">
              <span className="text-white/30 text-xs sm:text-sm sm:w-24 shrink-0">制作年月日</span>
              <span className="text-white text-sm">{date}</span>
            </div>
          )}
          {tools && (
            <div className="flex flex-col sm:flex-row sm:gap-8 gap-1">
              <span className="text-white/30 text-xs sm:text-sm sm:w-24 shrink-0">使用ツール</span>
              <span className="text-white text-sm">{tools}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
