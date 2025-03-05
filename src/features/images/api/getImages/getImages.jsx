import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

export const getImages = async (searchStr, page) => {


    const { data } = await axios.get(
        `https://pixabay.com/api/` ,
        {
            params: {
                key: API_KEY,
                q: searchStr,
                image_type: 'photo',
                page,
                per_page: 10,
            },
        },

    );
    return data.hits;
}