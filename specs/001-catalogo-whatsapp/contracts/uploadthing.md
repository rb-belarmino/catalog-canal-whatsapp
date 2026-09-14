# Contract: UploadThing File Uploads

**Module**: `src/app/api/uploadthing/route.ts` & `src/lib/uploadthing.ts`  
**Purpose**: Secure client-to-cloud direct image upload handler.

---

## 1. File Router Definition (`src/lib/uploadthing-server.ts`)

```typescript
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { verifyAdminSessionToken } from '@/modules/admin/auth'
import { cookies } from 'next/headers'

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: '8MB',
      maxFileCount: 1
    }
  })
    .middleware(async () => {
      // Must be authenticated as admin
      const cookieStore = await cookies()
      const token = cookieStore.get('admin_session')?.value
      const isValid = await verifyAdminSessionToken(token)

      if (!isValid) {
        throw new Error('Não autorizado para envio de imagens')
      }

      return { admin: true }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url, key: file.key }
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
```

---

## 2. Next.js App Router Endpoint (`src/app/api/uploadthing/route.ts`)

- **Method**: `GET`, `POST`
- **Handler**: `createRouteHandler({ router: ourFileRouter })`
- **Security**: UploadThing SDK handles token signing; `middleware` blocks unauthenticated uploads before allocating storage.

---

## 3. Client Component Interface (`src/lib/uploadthing-client.ts`)

- Exposes `<UploadButton>` and `<UploadDropzone>` generated from `generateUploadButton<OurFileRouter>()` and `generateUploadDropzone<OurFileRouter>()`.
- **Validation**:
  - File format: JPEG, PNG, WEBP.
  - Max size: 8MB. Client pre-checks prevent oversized uploads and show friendly Portuguese error: `"A imagem excede o tamanho máximo de 8MB"`.
