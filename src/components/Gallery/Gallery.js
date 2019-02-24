import React from "react";
import styles from "./Gallery.module.css";

import CImage from "../Image/Image";

// import { Container } from './styles';

const Gallery = props => (
  <div className={styles.container}>
    {props.images.map(image => (
      <CImage
        key={image._id}
        id={image._id}
        url={image.url}
        name={image.name}
        size={image.size}
        progress={image.progress}
        preview={image.preview}
        uploaded={image.uploaded}
        error={image.error}
        onDelete={props.onDelete}
      />
    ))}
  </div>
);

export default Gallery;
