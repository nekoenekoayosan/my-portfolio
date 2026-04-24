import Link from "next/link";
import Image from "next/image";
import { fetchDatabaseItems } from "@/lib/notion";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

// プロパティからテキストを取り出す
function getText(property: PageObjectResponse["properties"][string]): string {
  switch (property.type) {
    case "title":
      return property.title.map((t) => t.plain_text).join("");
    case "rich_text":
      return property.rich_text.map((t) => t.plain_text).join("");
    case "select":
      return property.select?.name ?? "";
    case "multi_select":
      return property.multi_select.map((s) => s.name).join(" / ");
    case "date":
      return property.date?.start ?? "";
    default:
      return "";
  }
}

// ファイルプロパティから画像 URL を取り出す
function getImageUrl(property: PageObjectResponse["properties"][string]): string | null {
  if (property.type !== "files") return null;
  const file = property.files[0];
  if (!file) return null;
  if (file.type === "file") return file.file.url;
  if (file.type === "external") return file.external.url;
  return null;
}

export default async function ApiTestPage() {
  let data: Awaited<ReturnType<typeof fetchDatabaseItems>> | null = null;
  let error: string | null = null;

  try {
    data = await fetchDatabaseItems();
  } catch (e) {
    error = e instanceof Error ? e.message : "不明なエラーが発生しました";
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ヘッダー */}
      <header className="border-b border-white/10 px-8 py-6 flex items-center justify-between">
        <h1 className="text-lg font-bold tracking-widest uppercase">Portfolio</h1>
        <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">
          ← 戻る
        </Link>
      </header>

      <div className="px-8 py-12 max-w-6xl mx-auto">
        {/* エラー表示 */}
        {error && (
          <div className="border border-red-500/60 bg-red-950/40 rounded-lg p-5">
            <p className="text-red-400 font-semibold mb-1">接続失敗</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {data && (
          <>
            {/* 件数 */}
            <p className="text-white/30 text-sm mb-8">{data.results.length} 件の作品</p>

            {/* カードグリッド */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(data.results as PageObjectResponse[]).map((page) => {
                const props = page.properties;
                const titleProp = props["作品名"] ?? props["Name"] ?? Object.values(props).find(p => p.type === "title");
                const title = titleProp ? getText(titleProp) : "";
                const description = props["作品概要"] ? getText(props["作品概要"]) : "";
                const date = props["制作年月日"] ? getText(props["制作年月日"]) : "";
                const tools = props["使用ツール"] ? getText(props["使用ツール"]) : "";
                const imageUrl = props["作品写真"] ? getImageUrl(props["作品写真"]) : null;

                return (
                  <div
                    key={page.id}
                    className="group border border-white/10 rounded-lg overflow-hidden hover:border-white/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(255,255,255,0.06)]"
                  >
                    {/* 画像エリア */}
                    <div className="relative w-full h-52 bg-zinc-900">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/15 text-sm">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* テキストエリア */}
                    <div className="p-5">
                      <h2 className="font-bold text-base mb-2 leading-snug">{title || "—"}</h2>
                      {description && (
                        <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-2">
                          {description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-white/30">
                        <span>{date}</span>
                        <span className="text-right">{tools}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
