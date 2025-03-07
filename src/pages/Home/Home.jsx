import { useState, useEffect, useRef } from 'react';
import PageLayout from '../../layout/PageLayout/PageLayout';
import styles from './Home.module.css';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { getImages } from '../../features/images/api/GetImages/GetImages';
import { downloadImage } from '../../features/images/api/downloadImage/downloadImage';

const Home = () => {
    const [search, setSearch] = useState('');
    const [sortedImages, setSortedImages] = useState([]); 
    const [sortType, setSortType] = useState('likes'); 

    const [hoveredImage, setHoveredImage] = useState(null);

    const observerRef = useRef(null);

    const handleInput = (e) => {
        setSearch(e.target.value);
    };

    // const {mutate: getImagesMutate , data: imagesData} = useMutation({
    //     mutationKey: ["images"],
    //     mutationFn : getImages
    // });

    const {
        data: imagesData, 
        fetchNextPage, 
        hasNextPage, 
        isLoading,
        isFetchingNextPage,
        refetch
    } = useInfiniteQuery({
        queryKey : ["images"],
        queryFn : ({pageParam = 1})=> getImages(search, pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages)=>{
            // если есть данные то подгружаем дальше
            return lastPage.length > 0 ? allPages.length + 1 : undefined;
        },
        enabled: false,
    });

    useEffect(()=>{
        if (!observerRef.current || !hasNextPage) return;

        const observer = new IntersectionObserver( 
            (entries)=>{
                if (entries[0].isIntersecting) {
                    fetchNextPage();
                    
                }
            },
            {
                //params
                threshold: 1,  // чтобы весь элемент был виден

            }

        );
        observer.observe(observerRef.current);
        return ()=>{
            observer.disconnect();
        }
    }, [fetchNextPage, hasNextPage])


    useEffect(() => {
        if (imagesData) {
            setSortedImages([...imagesData.pages.flat()].sort((a, b) => b[sortType] - a[sortType]));
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
    
    const handleSearch = ()=>{
        refetch()
    }


    return (
        <PageLayout>
            <div className={styles.wrapper}>
                <div className={styles.search}>
                    <input
                        type="text"
                        className={styles.search__input}
                        placeholder='Search images'
                        value={search}
                        onChange={handleInput}
                    />
                    <button className={styles.search__btn} onClick={handleSearch}>Search</button>
                </div>
                {sortedImages&& sortedImages.length > 0 &&
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
                {sortedImages&& sortedImages.length > 0 &&
                    <div className={styles.gallery}>
                        {imagesData.pages
                        .flat()
                        .filter((item, index, arr) => arr.findIndex((x) => x.id === item.id) === index)
                        .map(item => (
                           <div className={styles.card} 
                                key={item.id}
                                onMouseEnter={() => setHoveredImage(item.id)}
                                onMouseLeave={() => setHoveredImage(null)}
                                style={{ position: "relative" }} //
                           >
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
                                {hoveredImage === item.id && (
                                    <button 
                                        className={styles.downloadButton} 
                                        onClick={() => downloadImage(item.largeImageURL, `${search}.jpg`)}
                                    >
                                        ⬇ 
                                    </button>
                                )}
                           </div> 
                        ))}
                    </div>
                }
                <div ref={observerRef}></div>
                {isLoading && <span>loading...</span>}
                {isFetchingNextPage && <span>Loading more...</span>}
                
            </div>
        </PageLayout>
    )
}

export default Home;
