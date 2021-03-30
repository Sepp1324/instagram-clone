import { useRef } from 'react';
import PropTypes from 'prop-types';
import Header from './header';

export default function Post({ content }) {
  // components:
  // -> header, image, actions (like & comment icons), footer, comments

  return (
    <div className='rounded col-span-4 border bg-white border-gray-primary mb-16'>
      <Header username={content.username} />
    </div>
  );
}

Post.propTypes = {
  content: PropTypes.shape({
    username: PropTypes.string.isRequired,
    imageSource: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    docId: PropTypes.string.isRequired,
    userLikedPhoto: PropTypes.bool.isRequired,
    likes: PropTypes.array.isRequired,
    comments: PropTypes.array.isRequired,
    dateCreated: PropTypes.number.isRequired
  })
};
