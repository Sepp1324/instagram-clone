import { useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import LoggedInUserContext from '../context/logged-in-user';
import usePhotos from '../hooks/use-photos';
import Post from './post';

export default function Timeline() {
  const { user } = useContext(LoggedInUserContext);

  // get users photos from user logged in (hook)
  const { photos } = usePhotos(user);

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
        photos.map(content => <Post key={content.docId} content={content} />)
      ) : (
        <p className='text-center text-2xl'>Follow people to see their posts!</p>
      )}
    </div>
  );
}
