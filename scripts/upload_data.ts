// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import 'server-only'

import { createKysely } from '@vercel/postgres-kysely'

import fs from 'node:fs/promises'
import path from 'node:path'

const directoryPaths: { data: string } = {
  data: path.join(__dirname, '../data'),
}

const filePaths: {
  data: {
    character: string
    message: string
    user: string
    uploaded_cache: string
  }
} = {
  data: {
    character: path.join(directoryPaths.data, 'character.json'),
    message: path.join(directoryPaths.data, 'message.json'),
    uploaded_cache: path.join(directoryPaths.data, 'uploaded_cache.json'),
    user: path.join(directoryPaths.data, 'user.json'),
  },
}

interface Message {
  chat_id: string
  candidate_id: string
  raw_content: string
  create_time: string
  tti_image_rel_path: object // No message have this but it exists as a prop
}

async function main(): Promise<void> {
  const messages: Message[] = JSON.parse(
    await fs.readFile(filePaths.data.message, {
      encoding: 'utf8',
    }),
  )

  const lastUploaded: number = JSON.parse(
    await fs.readFile(filePaths.data.uploaded_cache, { encoding: 'utf8' }),
  )

  const db = createKysely<Database.Alic3Dev>()

  for (let i: number = lastUploaded + 1; i < messages.length; i++) {
    const message: Message = messages[i]

    console.log(`Uploading Message [${i}]: ${message.candidate_id}`)

    try {
      await db
        .insertInto('ibby_messages')
        .values({
          candidate_id: message.candidate_id,
          chat_id: message.chat_id,
          create_time: new Date(message.create_time),
          raw_content: message.raw_content,
        })
        .executeTakeFirstOrThrow()
    } catch {
      console.error('Failed to write message to database:')
      console.error(JSON.stringify(message))

      db.destroy()
    }

    await fs.writeFile(filePaths.data.uploaded_cache, JSON.stringify(i), {
      encoding: 'utf8',
    })
  }

  db.destroy()
}

main()
