import { useState, useEffect } from 'react';
import PageLayout from '../../layout/PageLayout/PageLayout';
import styles from './Home.module.css';
import { useQuery } from '@tanstack/react-query';
import { getImages } from '../../features/images/api/GetImages/GetImages';

const Home = () => {
    const [search, setSearch] = useState('');
    const [sortedImages, setSortedImages] = useState([]); // Состояние для отсортированных изображений
    const [sortType, setSortType] = useState('likes'); // Текущий тип сортировки

    const handleInput = (e) => {
        setSearch(e.target.value);
    };

    const { data: imagesData, isLoading, isError } = useQuery({
        queryKey: ['images'],
        queryFn: getImages,
    });

    useEffect(() => {
        if (imagesData) {
            setSortedImages([...imagesData].sort((a, b) => b[sortType] - a[sortType]));
        }
    }, [imagesData, sortType]); 

    const handleSort = (type) => {
        if (!sortedImages.length) return;
        if (sortType === type) {
            setSortedImages([...sortedImages].reverse());
        } else {
            const sorted = [...sortedImages].sort((a, b) => b[type] - a[type]);
            setSortedImages(sorted);
        }

        setSortType(type);
    };

    if (isLoading) {
        return "Loading...";
    }

    if (isError) {
        return "Error loading images";
    }

    return (
        <PageLayout>
            <div className={styles.wrapper}>
                {sortedImages.length > 0 &&
                    <div className={styles.filters}>
                        <button className={styles.filter__btn} onClick={() => handleSort("likes")}>
                            Likes
                        </button>
                        <button className={styles.filter__btn} onClick={() => handleSort("comments")}>
                            Comments
                        </button>
                        <button className={styles.filter__btn} onClick={() => handleSort("views")}>
                            Views
                        </button>
                    </div>
                }
                {sortedImages.length > 0 &&
                    <div className={styles.gallery}>
                        {sortedImages.map(item => (
                           <div className={styles.card} key={item.id}>
                                <img
                                    className={styles.gallery__image}
                                    src={item.largeImageURL}
                                    alt={`${item.id}-${search}`}
                                />
                                <div className={styles.stats} >
                                    <span>likes:{item.likes}</span>
                                    <span>comments:{item.comments}</span>
                                    <span>views:{item.views}</span>
                                </div>
                           </div> 
                        ))}
                    </div>
                }
                <div className={styles.search}>
                    <input
                        type="text"
                        className={styles.search__input}
                        placeholder='Search images'
                        value={search}
                        onChange={handleInput}
                    />
                    <button className={styles.search__btn}>Search</button>
                </div>
            </div>
        </PageLayout>
    )
}

export default Home;
