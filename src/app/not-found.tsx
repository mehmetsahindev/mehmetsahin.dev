import { NotFound as PageNotFound } from "@/components/not-found"

export const metadata = {
  title: "Sayfa Bulunamadı",
}

export default function NotFound() {
  return <PageNotFound className="h-screen" />
}
