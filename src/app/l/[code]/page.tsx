import { redirect } from 'next/navigation'
import { getSharedWishlistProductIds } from '@/modules/wishlist/actions'

interface ShortWishlistPageProps {
  params: Promise<{ code: string }>
}

export default async function ShortWishlistPage({ params }: ShortWishlistPageProps) {
  const { code } = await params
  if (!code) {
    redirect('/lista')
  }

  const productIds = await getSharedWishlistProductIds(code)
  if (!productIds || productIds.length === 0) {
    redirect('/lista')
  }

  redirect(`/lista?ids=${encodeURIComponent(productIds.join(','))}`)
}
