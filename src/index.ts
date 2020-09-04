import 'reflect-metadata';
import { getConnectionOptions, createConnection, getRepository } from 'typeorm';
import { Photo } from './entity/Photo';
import { PhotoMetadata } from './entity/PhotoMetadata';
import { Author } from './entity/Author';
import { Album } from './entity/Album';

console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`process.env.MESSAGE: ${process.env.MESSAGE}`);
console.log(`process.env.NUMBER: ${process.env.NUMBER}`);

async function bootstrap() {
  const connectionOptions = await getConnectionOptions();

  const options =
    process.env.NODE_ENV === 'development'
      ? { ...connectionOptions, dropSchema: true, synchronize: true }
      : connectionOptions;

  createConnection(options)
    .then(async (connection) => {
      console.log(`connection.isConnected: ${connection.isConnected}`);

      const authorRepository = getRepository(Author);
      const albumRepository = getRepository(Album);
      const photoRepository = getRepository(Photo);

      // Create a Author
      const author = new Author();
      author.name = 'John';

      // create a few albums
      const album1 = new Album();
      album1.name = 'Bears';
      await albumRepository.save(album1);

      const album2 = new Album();
      album2.name = 'Me';
      await albumRepository.save(album2);

      // create a photo
      const photo = new Photo();
      photo.name = 'Me and Bears';
      photo.description = 'I am near polar bears';
      photo.filename = 'photo-with-bears.jpg';
      photo.views = 1;
      photo.isPublished = true;
      photo.albums = [album1, album2];

      // create a photo metadata
      const metadata = new PhotoMetadata();
      metadata.height = 640;
      metadata.width = 480;
      metadata.compressed = true;
      metadata.comment = 'cybershoot';
      metadata.orientation = 'portrait';

      author.photos = [photo];
      photo.metadata = metadata; // this way we connect them

      // saving a author and a photo also save the metadata
      await authorRepository.save(author);
      console.log(
        'Both author and photo is saved, photo metadata is saved too.',
      );

      const allPhotos = await photoRepository.find({
        relations: ['author', 'metadata', 'albums'],
      });
      console.log('All photos using find* methods: ', allPhotos);
      console.log('albums[0]: ', allPhotos[0].albums[0]);

      const allPhotos2 = await photoRepository
        .createQueryBuilder('photo')
        .innerJoinAndSelect('photo.metadata', 'metadata')
        .getMany();

      console.log('All photos using QueryBuilder: ', allPhotos2);

      const firstPhoto = await photoRepository.findOne(
        'b7b414da-3342-4612-8f57-bcc94c06b5f0',
      );
      console.log('First photo from the db: ', firstPhoto);

      const meAndBearsPhoto = await photoRepository.findOne({
        name: 'Me and Bears',
      });
      console.log('Me and Bears photo from the db: ', meAndBearsPhoto);

      const allViewedPhotos = await photoRepository.find({ views: 1 });
      console.log('All viewed photos: ', allViewedPhotos);

      const allPublishedPhotos = await photoRepository.find({
        isPublished: true,
      });
      console.log('All published photos: ', allPublishedPhotos);

      const [allPhotos3, photosCount] = await photoRepository.findAndCount({
        relations: ['author', 'metadata', 'albums'],
      });
      console.log('All photos: ', allPhotos3);
      console.log('Photos count: ', photosCount);

      const photoToUpdate = await photoRepository.findOne(1);
      if (photoToUpdate !== undefined) {
        photoToUpdate.name = 'Me, my friends and polar bears';
        await photoRepository.save(photoToUpdate);
        console.log('Photo with id = 1 have been updated');
      } else {
        console.log('Photo with id = 1 have not been updated');
      }

      // noinspection SqlNoDataSourceInspection
      const rawData = await connection.query(
        'SELECT id, height, width FROM photo_metadata',
      );
      console.log('rawData: ', rawData);

      const photoToRemove = await photoRepository.findOne(1);
      if (photoToRemove !== undefined) {
        await photoRepository.remove(photoToRemove);
        console.log('Photo with id = 1 have been deleted');
      } else {
        console.log('Photo with id = 1 have not been deleted');
      }
    })
    .catch((error) => console.log(error));
}

bootstrap();
