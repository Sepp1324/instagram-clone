import Skeleton from 'react-loading-skeleton';
import usePhotos from '../hooks/use-photos';

export default function Timeline() {
  // get users photos from user logged in (hook)
  const { photos } = usePhotos();

  console.log(`photos`, photos);
  // on loading the photos, need react skeleton
  // if we have photos -> render them (create a post component)
  // if user has no photos, tell them to create photos

  return (
    <div className='container col-span-2'>
      {!photos ? (
        <>
          <Skeleton count={4} width={640} height={500} className='mb-5' />)
        </>
      ) : photos.length > 0 ? (
        photos.map(content => <p key={content.docId}>{content.imageSrc}</p>)
      ) : (
        <p className='text-center text-2xl'>
          Follow people to see their posts!
        </p>
      )}
    </div>
  );
}
