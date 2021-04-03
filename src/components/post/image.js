import PropTypes from 'prop-types';
import { DEFAULT_IMAGE_PATH } from '../../constants/paths';

export default function Image({ src, caption }) {
  return (
    <img
      src={src}
      alt={caption}
      onError={event => {
        event.target.src = DEFAULT_IMAGE_PATH;
      }}
    />
  );
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired
};
