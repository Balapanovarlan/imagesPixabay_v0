import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

export const getImages = async (searchStr, page, type) => {


    const { data } = await axios.get(
        `https://pixabay.com/api/${type}/` ,
        {
            params: {
                key: API_KEY,
                q: searchStr,
                page:1,
                per_page: 10,
            },
        },

    );
    return data.hits;
}