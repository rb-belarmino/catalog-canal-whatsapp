import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL?.replace(
  /([?&])sslmode=require(?=&|$)/g,
  '$1sslmode=verify-full'
)

const pool = new Pool({
  connectionString
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

import fs from 'node:fs'
import path from 'node:path'

interface CatalogPiece {
  name: string
  price: number
  priceInCents: number
  formattedPrice: string
  colors?: string[]
}

interface CatalogLook {
  id: string
  index: number
  imageFile: string
  imageUrl: string
  rawText: string
  title: string
  pieces: CatalogPiece[]
  composition?: string | null
  details?: string[]
  totalPriceInCents: number
  formattedTotalPrice: string
}

interface CatalogData {
  metadata: {
    date: string
    source: string
    totalLooks: number
    totalIndividualPieces: number
  }
  looks: CatalogLook[]
}

async function main() {
  console.log('🌱 Iniciando o seed do catálogo oficial Canal Concept...')

  const catalogFilePath = path.join(
    process.cwd(),
    'src/public/catalog-2026-09-14.json'
  )
  const catalogRaw = fs.readFileSync(catalogFilePath, 'utf-8')
  const catalogData: CatalogData = JSON.parse(catalogRaw)

  console.log(
    `📁 Catálogo carregado: ${catalogData.looks.length} looks encontrados.`
  )

  // Configuração padrão da loja
  console.log('⚙️  Configurando informações da loja (ShopConfig)...')
  await prisma.shopConfig.upsert({
    where: { id: 'default' },
    update: {
      storeName: 'Canal Concept',
      whatsappNumber: '5511999998888',
      topAnnouncement: 'PARCELE EM ATÉ 10X SEM JUROS | 5% OFF NO PIX'
    },
    create: {
      id: 'default',
      storeName: 'Canal Concept',
      whatsappNumber: '5511999998888',
      topAnnouncement: 'PARCELE EM ATÉ 10X SEM JUROS | 5% OFF NO PIX'
    }
  })

  // Limpeza de produtos anteriores para garantir estado limpo e reproduzível
  console.log('🗑️  Removendo produtos antigos do mock...')
  await prisma.product.deleteMany({})

  // Inserção dos 41 looks com suas peças
  console.log(
    `🚀 Inserindo ${catalogData.looks.length} looks com suas respectivas peças...`
  )
  let totalPiecesCount = 0

  for (const look of catalogData.looks) {
    const piecesWithId = look.pieces.map((piece, pIdx) => ({
      id: `${look.id}-p${pIdx + 1}`,
      name: piece.name,
      priceInCents: piece.priceInCents,
      formattedPrice: piece.formattedPrice,
      colors: piece.colors || [],
      composition: look.composition || undefined,
      details: look.details || []
    }))

    totalPiecesCount += piecesWithId.length

    const primaryPiece = piecesWithId[0]
    const created = await prisma.product.create({
      data: {
        id: look.id,
        name: look.title,
        priceInCents: primaryPiece.priceInCents,
        imageUrl: look.imageUrl,
        pieces: piecesWithId,
        active: true,
        sortOrder: look.index
      }
    })

    console.log(
      `  ✓ [Look ${String(created.sortOrder).padStart(2, '0')}] ${created.name} (${piecesWithId.length} ${piecesWithId.length > 1 ? 'peças' : 'peça'}) - Img: ${created.imageUrl}`
    )
  }

  console.log(
    `🎉 Seed concluído com sucesso! ${catalogData.looks.length} looks e ${totalPiecesCount} peças registradas.`
  )
}

main()
  .catch(e => {
    console.error('❌ Erro ao executar o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
