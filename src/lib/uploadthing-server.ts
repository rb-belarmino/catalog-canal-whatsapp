import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { isAuthenticatedAdmin } from '@/modules/admin/auth'
import { logger } from '@/shared/logger'

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: '8MB',
      maxFileCount: 1
    }
  })
    .middleware(async () => {
      const authorized = await isAuthenticatedAdmin()
      if (!authorized) {
        logger.warn('UploadThing', 'Unauthorized upload attempt blocked')
        throw new Error('Não autorizado para upload de fotos')
      }
      return { authorized: true }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      logger.info('UploadThing', 'Upload successfully completed', {
        fileKey: file.key,
        url: file.url
      })
      return { url: file.url, key: file.key }
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
