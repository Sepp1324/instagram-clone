import { firebase, FieldValue } from '../lib/firebase';

export async function doesUsernameExist(username) {
  const result = await firebase.firestore().collection('users').where('username', '==', username).get();

  return result.docs.map(user => user.data().length > 0);
}

export async function getUserByUsername(username) {
  const result = await firebase.firestore().collection('users').where('username', '==', username).get();

  return result.docs.map(item => ({
    ...item.data(),
    docId: item.id
  }));
}

// get user from the firestore where userId === userId (passed from the auth)
export async function getUserByUserId(userId) {
  const result = await firebase.firestore().collection('users').where('userId', '==', userId).get();
  const user = result.docs.map(item => ({
    ...item.data(),
    docId: item.id
  }));

  return user;
}

export async function getSuggestedProfiles(userId, following) {
  const result = await firebase.firestore().collection('users').limit(10).get();

  return result.docs
    .map(user => ({ ...user.data(), docId: user.id }))
    .filter(profile => profile.userId !== userId && !following.includes(profile.userId));
}

export async function updateLoggedInUserFollowing(
  loggedInUserDocId, // currently logged in user document id (pr1mus' profile)
  profileId, // user that pr1mus requests to follow
  isFollowingProfile // true or false; true if already following
) {
  return firebase
    .firestore()
    .collection('users')
    .doc(loggedInUserDocId)
    .update({
      following: isFollowingProfile ? FieldValue.arrayRemove(profileId) : FieldValue.arrayUnion(profileId)
    });
}

export async function updateFollowedUserFollowers(profileDocId, loggedInUserDocId, isFollowingProfile) {
  return firebase
    .firestore()
    .collection('users')
    .doc(profileDocId)
    .update({
      followers: isFollowingProfile
        ? FieldValue.arrayRemove(loggedInUserDocId)
        : FieldValue.arrayUnion(loggedInUserDocId)
    });
}

export async function getPhotos(userId, following) {
  const result = await firebase.firestore().collection('photos').where('userId', 'in', following).get();

  const userFollowedPhotos = result.docs.map(photo => ({
    ...photo.data(),
    docId: photo.id
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async photo => {
      let userLikedPhoto = false;

      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }

      const user = await getUserByUserId(photo.userId);
      const { username } = user[0];

      return { username, ...photo, userLikedPhoto };
    })
  );
  return photosWithUserDetails;
}

export async function getUserPhotosByUsername(username) {
  const [user] = await getUserByUsername(username);
  const result = await firebase.firestore().collection('photos').where('userId', '==', user.userId).get();

  const photos = result.docs.map(item => ({
    ...item.data(),
    docId: item.id
  }));
  return photos;
}

export async function isUserFollowingProfile(loggedInUsername, profileUserId) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', loggedInUsername)
    .where('following', 'array-contains', profileUserId)
    .get();

  const [response = {}] = result.docs.map(item => ({
    ...item.data(),
    docId: item.id
  }));

  return response.userId;
}

/**
 * Handles the Following und Unfollowing of user-profiles
 * @param {Boolean} isFollowingProfile  true if user is following profile
 * @param {String} activeUserDocId      docId of currently logged in user (e.g pr1mus)
 * @param {String} profileDocId         userId of currently logged in user (e.g pr1mus)
 * @param {String} profileUserId        userId of profile visited (e.g sepp_forcher)
 * @param {String} followingUserId      docId of profile visited (e.g sepp_forcher)
 */
export async function toggleFollow(isFollowingProfile, activeUserDocId, profileDocId, profileUserId, followingUserId) {
  await updateLoggedInUserFollowing(activeUserDocId, profileUserId, isFollowingProfile);
  await updateFollowedUserFollowers(profileDocId, followingUserId, isFollowingProfile);
}
