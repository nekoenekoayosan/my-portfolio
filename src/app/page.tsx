import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-8 px-6 md:gap-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-center">粕谷葵 Portfolio</h1>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
        {/* Notion API の接続確認ページへ */}
        <Link
          href="/api-test"
          className="px-8 py-3 border border-white/40 rounded-full text-center hover:bg-white hover:text-black transition-colors"
        >
          API 接続テスト
        </Link>

        {/* ポートフォリオページへ */}
        <Link
          href="/portfolio"
          className="px-8 py-3 bg-white text-black rounded-full text-center hover:bg-white/80 transition-colors"
        >
          ポートフォリオを見る
        </Link>
      </div>
    </main>
  );
}
