import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react'
import PageLayout from '../../layout/PageLayout/PageLayout';
import { getImages } from '../../features/images/api/GetImages/GetImages';
import styles from './Video.module.css'

import {Navigation, Pagination} from 'swiper/modules'
import {Swiper, SwiperSlide } from 'swiper/react'


import 'swiper/css'
import 'swiper/css/pagination';
import 'swiper/css/scrollbar'
import 'swiper/css/navigation'

const Video = () => {

    const [search, setSearch] = useState('');
    const [sortedVideo, setSortedVideo] = useState([]); 
    const [sortType, setSortType] = useState('likes'); 

    const observerRef = useRef(null);

    const handleInput = (e) => {
        setSearch(e.target.value);
    };

    const {
        data: VideoData, 
        fetchNextPage, 
        hasNextPage, 
        isLoading,
        isFetchingNextPage,
        refetch
    } = useInfiniteQuery({
        queryKey : ["images"],
        queryFn : ({pageParam = 1})=> getImages(search, pageParam, 'videos'),
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
                threshold: 1,  // чтобы весь элемент был виден
            }

        );
        observer.observe(observerRef.current);
        return ()=>{
            observer.disconnect();
        }
    }, [fetchNextPage, hasNextPage])


    useEffect(() => {
        if (VideoData) {
            setSortedVideo([...VideoData.pages.flat()].sort((a, b) => b[sortType] - a[sortType]));
        }
    }, [VideoData, sortType]); 

    const handleSort = (type) => {
        if (!sortedVideo.length) return;
        if (sortType === type) {
            setSortedVideo([...sortedVideo].reverse());
        } else {
            const sorted = [...sortedVideo].sort((a, b) => b[type] - a[type]);
            setSortedVideo(sorted);
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
                placeholder='Search videos'
                value={search}
                onChange={handleInput}
            />
            <button className={styles.search__btn} onClick={handleSearch}>Search</button>
        </div>
        {sortedVideo&& sortedVideo.length > 0 &&
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
        {sortedVideo&& sortedVideo.length > 0 &&
           <Swiper
                className={styles.swiper}   
                navigation = {true}
                modules = {[Pagination, Navigation] }
                slidesPerView  = {1}
                spaceBetween = {10}
                pagination = {{
                    clickable: true,
                    type: 'fraction'
                }}
           >
                {
                    VideoData.pages
                    .flat()
                    .filter((item, index, arr) => arr.findIndex((x) => x.id === item.id) === index)
                    .map(item => (
                        <SwiperSlide
                            className={styles.slide}
                            key={item.id}
                        >
                            <div>
                                <video controls className={styles.video}>
                                    <source src={item.videos.medium.url} type='video/mp4'/>
                                </video>
                        
                            </div>
                        </SwiperSlide>
                    ))
                }
                <div ref={observerRef}></div>
           </Swiper>
        }
        
        {isLoading && <span>loading...</span>}
        {isFetchingNextPage && <span>Loading more...</span>}
        
    </div>
</PageLayout>
  )
}

export default Video
