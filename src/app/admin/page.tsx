import { redirect } from "next/navigation";
import { isAuthenticatedAdmin } from "@/modules/admin/auth";
import { prisma } from "@/shared/db";
import { SortableProductList } from "@/modules/admin/components/sortable-product-list";
import { StoreSettingsForm } from "@/modules/admin/components/store-settings-form";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    redirect("/admin/login");
  }

  let products: Array<{
    id: string;
    name: string;
    priceInCents: number;
    imageUrl: string;
    active: boolean;
  }> = [];
  let config: { storeName: string; whatsappNumber: string; topAnnouncement?: string } | null = null;
  let dbError = false;

  try {
    const [fetchedProducts, fetchedConfig] = await Promise.all([
      prisma.product.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        select: {
          id: true,
          name: true,
          priceInCents: true,
          imageUrl: true,
          active: true,
        },
      }),
      prisma.shopConfig.findUnique({
        where: { id: "default" },
      }),
    ]);
    products = fetchedProducts;
    config = fetchedConfig;
  } catch {
    dbError = true;
  }

  return (
    <div className="space-y-8">
      {dbError && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-sm flex flex-col gap-1">
          <p className="font-semibold flex items-center gap-1.5">
            ⚠️ Banco de Dados Não Conectado
          </p>
          <p className="text-xs text-amber-800 leading-relaxed">
            Não foi possível alcançar o servidor de banco de dados. Configure sua string de conexão do <strong>Neon PostgreSQL</strong> no arquivo <code className="bg-amber-100 px-1 py-0.5 rounded">.env</code> na variável <code className="bg-amber-100 px-1 py-0.5 rounded">DATABASE_URL</code> e execute <code className="bg-amber-100 px-1 py-0.5 rounded">npx prisma db push</code>.
          </p>
        </div>
      )}

      {/* Store Settings Section */}
      <section>
        <StoreSettingsForm
          initialStoreName={config?.storeName ?? "Canal Concept"}
          initialWhatsappNumber={config?.whatsappNumber ?? ""}
          initialTopAnnouncement={config?.topAnnouncement}
        />
      </section>

      {/* Product Management Section */}
      <section>
        <SortableProductList initialProducts={products} />
      </section>
    </div>
  );
}
