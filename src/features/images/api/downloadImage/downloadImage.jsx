import axios from "axios";

export const downloadImage = async (url, filename = "image.jpg") => {
  try {
    const response = await axios.get(url, { responseType: "blob" });

    const blob = new Blob([response.data], { type: response.headers["content-type"] });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Ошибка скачивания изображения:", error);
  }
};
