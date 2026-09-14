import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const PRODUCTS = [
  {
    name: 'Vestido Midi Floral Elegante',
    priceInCents: 18990, // R$ 189,90
    imageUrl:
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    active: true,
    sortOrder: 1
  },
  {
    name: 'Camisa Casual Linho Cru',
    priceInCents: 14990, // R$ 149,90
    imageUrl:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    active: true,
    sortOrder: 2
  },
  {
    name: 'Calça Alfaiataria Pantalona Bege',
    priceInCents: 19990, // R$ 199,90
    imageUrl:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    active: true,
    sortOrder: 3
  },
  {
    name: 'Blazer Slim Fit Terracota',
    priceInCents: 27990, // R$ 279,90
    imageUrl:
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=800&q=80',
    active: true,
    sortOrder: 4
  },
  {
    name: 'Cropped Tricot Canelado Off-White',
    priceInCents: 7990, // R$ 79,90
    imageUrl:
      'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80',
    active: true,
    sortOrder: 5
  },
  {
    name: 'Jaqueta Jeans Oversized Vintage',
    priceInCents: 22990, // R$ 229,90
    imageUrl:
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    active: true,
    sortOrder: 6
  },
  {
    name: 'Conjunto Moletom Minimalista Cinza',
    priceInCents: 24990, // R$ 249,90
    imageUrl:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    active: true,
    sortOrder: 7
  },
  {
    name: 'Saia Midi Plissada Verde Oliva',
    priceInCents: 13990, // R$ 139,90
    imageUrl:
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80',
    active: true,
    sortOrder: 8
  },
  {
    name: 'Cardigan Tricot Alongado Avelã',
    priceInCents: 16990, // R$ 169,90
    imageUrl:
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
    active: true,
    sortOrder: 9
  },
  {
    name: 'Macacão Utilitário Sarja Caqui',
    priceInCents: 21990, // R$ 219,90
    imageUrl:
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80',
    active: true,
    sortOrder: 10
  }
]

async function main() {
  console.log('🌱 Iniciando o seed do catálogo...')

  // Configuração padrão da loja
  console.log('Configurando informações da loja (ShopConfig)...')
  await prisma.shopConfig.upsert({
    where: { id: 'default' },
    update: {
      storeName: 'Aura & Co. Ateliê',
      whatsappNumber: '5511999998888'
    },
    create: {
      id: 'default',
      storeName: 'Aura & Co. Ateliê',
      whatsappNumber: '5511999998888'
    }
  })

  // Limpeza de produtos anteriores para garantir estado limpo e reproduzível
  console.log('Removendo produtos antigos...')
  await prisma.product.deleteMany({})

  // Inserção dos produtos mockados
  console.log(`Inserindo ${PRODUCTS.length} produtos mockados com fotos...`)
  for (const product of PRODUCTS) {
    const created = await prisma.product.create({
      data: product
    })
    console.log(
      `  ✓ [${created.sortOrder}] ${created.name} - R$ ${(created.priceInCents / 100).toFixed(2)}`
    )
  }

  console.log('🎉 Seed concluído com sucesso!')
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
