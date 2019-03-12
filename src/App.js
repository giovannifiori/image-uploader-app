import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { API_URL } from "./config/constants";

import api from "./services/api";

import filesize from "filesize";

import PageHeader from "./components/PageHeader/PageHeader";
import Upload from "./components/Upload/Upload";
import Gallery from "./components/Gallery/Gallery";

class App extends Component {
  state = {
    uploadedImages: []
  };

  componentDidMount() {
    const socket = socketIOClient(API_URL);
    socket.on("newImage", this.handleImageFromSocket);
    api
      .get("posts")
      .then(posts => {
        let uploadedImages = posts.data.map(p => {
          return {
            ...p,
            uploaded: true,
            error: false,
            size: filesize(p.size)
          };
        });
        this.setState({
          uploadedImages
        });
      })
      .catch(error => console.log(error));
  }

  componentWillUnmount() {
    this.state.uploadedImages.forEach(img => {
      if (img.preview) URL.revokeObjectURL(img.preview);
    });
  }

  handleImageFromSocket = image => {
    if (this.state.uploadedImages.find(e => e._id === image._id)) {
      return;
    }
    image = {
      ...image,
      uploaded: true
    };
    this.setState(prevState => {
      return {
        uploadedImages: [image, ...prevState.uploadedImages]
      };
    });
  };

  mergeImageData(id, dataToMerge) {
    this.setState(prevState => {
      return {
        uploadedImages: prevState.uploadedImages.map(img =>
          img._id === id ? { ...img, ...dataToMerge } : img
        )
      };
    });
  }

  handleUpload = images => {
    const uploadedImages = images.map(image => ({
      image,
      _id: Date.now(),
      name: image.name,
      size: filesize(image.size),
      preview: URL.createObjectURL(image),
      progress: 0,
      uploaded: false,
      error: false,
      url: null
    }));

    this.setState(prevState => {
      return {
        uploadedImages: prevState.uploadedImages.concat(uploadedImages)
      };
    });

    uploadedImages.forEach(this.startUpload);
  };

  startUpload = img => {
    const data = new FormData();
    data.append("file", img.image, img.name);
    api
      .post("posts", data, {
        onUploadProgress: event => {
          const progress = parseInt(
            Math.round((event.loaded * 100) / event.total)
          );
          this.mergeImageData(img._id, {
            progress
          });
        }
      })
      .then(imgUploaded => {
        this.mergeImageData(img._id, {
          uploaded: true,
          _id: imgUploaded.data._id,
          url: imgUploaded.data.url
        });
      })
      .catch(error => {
        this.mergeImageData(img._id, {
          error: true
        });
      });
  };

  handleDelete = async id => {
    console.log("delete");
    await api.delete(`posts/${id}`);

    this.setState(prevState => {
      return {
        uploadedImages: prevState.uploadedImages.filter(img => img._id !== id)
      };
    });
  };

  render() {
    return (
      <div className="App">
        <PageHeader
          title="Image Uploader"
          subtitle="Share your images with your friends!"
        />
        <Upload onDrop={this.handleUpload} />
        {this.state.uploadedImages.length > 0 && (
          <Gallery
            onDelete={this.handleDelete}
            images={this.state.uploadedImages}
          />
        )}
      </div>
    );
  }
}

export default App;
