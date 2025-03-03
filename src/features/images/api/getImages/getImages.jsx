import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

export const getImages = async () => {
    const { data } = await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${"car"}&image_type=photo`);
    return data.hits;
}