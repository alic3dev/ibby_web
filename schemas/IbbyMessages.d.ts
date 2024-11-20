import type { ColumnType, Generated } from 'kysely'

interface Message {
  chat_id: string
  candidate_id: string
  raw_content: string
  create_time: string
}

declare global {
  namespace Database.Table {
    interface IbbyMessages {
      id: ColumnType<Generated<number>, never, never>
      chat_id: string
      candidate_id: string
      raw_content: string
      create_time: Date
      submitted_timestamp: ColumnType<Date, never, never>
    }
  }
}

export {}

// CREATE TABLE ibby_messages (
//    id serial PRIMARY KEY,
//    chat_id varchar(255) NOT NULL,
//    candidate_id varchar(255) NOT NULL,
//    raw_content text NOT NULL,
//    create_time: timestamp NOT NULL,
//    submitted_timestamp timestamp default current_timestamp
// );
