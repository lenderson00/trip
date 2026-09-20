import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-10">
      <p className="font-hand text-2xl text-caramel">um sistema de papel</p>
      <h1 className="font-display text-5xl text-ink">Viagem</h1>
      <Link
        href="/ui"
        className="font-chunky rounded-full bg-blush px-6 py-3 text-ink shadow-[var(--shadow-lift)]"
      >
        ver os componentes
      </Link>
    </main>
  );
}
