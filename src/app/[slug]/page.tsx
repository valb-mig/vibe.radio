import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { step } from "@/core/dial"
import { catalog } from "@/infra/catalog"
import { Dial } from "@/ui/station/dial"
import { Hero } from "@/ui/station/hero"
import { Skeleton } from "@/ui/station/skeleton"
import { Tracklist } from "@/ui/station/tracklist"

type Params = PageProps<"/[slug]">["params"]

export function generateStaticParams() {
  return catalog.all().map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const s = catalog.get((await params).slug)
  return s ? { title: `${s.name} · vibe.radio`, description: s.blurb } : {}
}

async function Content({ params }: { params: Params }) {
  const s = catalog.get((await params).slug)
  if (!s) notFound()
  const all = catalog.all()

  return (
    <>
      <Hero station={s} />
      <Tracklist station={s} />
      <Dial prev={step(all, s.slug, -1)!} next={step(all, s.slug, 1)!} />
    </>
  )
}

export default function Page({ params }: PageProps<"/[slug]">) {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6">
      <Suspense fallback={<Skeleton />}>
        <Content params={params} />
      </Suspense>
    </main>
  )
}
