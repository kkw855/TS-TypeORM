/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { PhotoMetadata } from './PhotoMetadata';
import { Author } from './Author';
import { Album } from './Album';

@Entity('photo')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    length: 100,
  })
  name!: string;

  @Column('text')
  description!: string;

  @Column()
  filename!: string;

  @Column('double precision')
  views!: number;

  @Column()
  isPublished?: boolean;

  @OneToOne((type) => PhotoMetadata, (photoMetadata) => photoMetadata.photo, {
    cascade: true,
  })
  metadata!: PhotoMetadata;

  @ManyToOne((type) => Author, (author) => author.photos)
  author!: Author;

  @ManyToMany((type) => Album, (album) => album.photos)
  albums!: Album[];
}
