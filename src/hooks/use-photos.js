import { useState, useEffect } from 'react';
import { getPhotos } from '../services/firebase';

export default function usePhotos(user) {
  const [photos, setPhotos] = useState(null);

  useEffect(() => {
    async function getTimelinePhotos() {
      let followedUserPhotos = [];

      // does user actually follow people?
      if (user?.following.length > 0) {
        followedUserPhotos = await getPhotos(user.userId, user.following);

        followedUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated); // newest photos on top of feed
        setPhotos(followedUserPhotos);
      }
    }
    if (user.userId) {
      getTimelinePhotos();
    }
  }, [user?.userId]);

  return { photos };
}
