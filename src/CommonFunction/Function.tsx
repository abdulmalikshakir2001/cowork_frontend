import imgExtension from "../Assets/Images/icon/feature-image.png";
import fileExtension from "../Assets/Images/icon/feature-file.png";
import videoExtension from "../Assets/Images/icon/feature-video.png";
import unknownExtension from "../Assets/Images/icon/feature-unknown.png";

export function convertBytesToSize(bytes:any) {
  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;
  const gigabyte = megabyte * 1024;

  if (bytes < kilobyte) {
      return bytes + ' Byte';
  } else if (bytes < megabyte) {
      return Math.round(bytes / kilobyte) + ' KB';
  } else if (bytes < gigabyte) {
      return Math.round(bytes / megabyte) + ' MB';
  } else {
      return Math.round(bytes / gigabyte) + ' GB';
  }
}

export const getFileType = (extension: string) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const videoExtensions = ['mp4', 'avi', 'mov'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt'];

  if (imageExtensions.includes(extension)) {
    return imgExtension;
  } else if (videoExtensions.includes(extension)) {
    return videoExtension;
  } else if (documentExtensions.includes(extension)) {
    return fileExtension;
  } else {
    return unknownExtension;
  }
};