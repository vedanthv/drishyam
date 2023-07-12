import React, { useState, useEffect } from 'react'
import { Loader, Card, FormField } from '../components';

const apiUrl = import.meta.env.VITE_API_URL;

const RenderCard = ({ data, title }) => {
    if (data.length > 0) {
        return data.map((post => <Card key={post._id} {...post} />))
    }
    return (
        <h2 className='mt-5 font-bold text-[#6449ff] text-xl uppercase'>{title}</h2>
    )
}

const Home = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [allPosts, setAllPosts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedPosts, setSearchedPosts] = useState([]);
    const [searchTimeOut, setSearchTimeOut] = useState(null);

    const fetchPosts = async()=>{
        try {
            setIsLoading(true);
            const res = await fetch(apiUrl+"/api/v1/post");
            const posts = await res.json();

            if(res.ok){
                setAllPosts(posts.data.reverse());
            }
        } catch (error) {
            alert(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSearchChange = (e)=>{
        setSearchText(e.target.value);

        clearTimeout(searchTimeOut);
        const timerId = setTimeout(()=>{
            const searchResults = allPosts.filter((item)=> 
                    item.name.toLowerCase().includes(searchText.toLowerCase()) || 
                    item.prompt.toLowerCase().includes(searchText.toLowerCase()) 
                )
            setSearchedPosts(searchResults);
        }, 600)
        setSearchTimeOut(timerId)
    }

    useEffect(()=>{
        fetchPosts()
    }, [])

    return (
        <section className='max-w-7xl mx-auto'>
            <div>
                <h1 className='font-extrabold text-[#222328] text-[32px]'>AI Image Generated Showcase</h1>
                <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px]'>
                    Browse through a collection of imaginative and visually stunning images generated by AI
                </p>
            </div>
            <div className='mt-16'>
                <FormField
                    labelName='Search posts'
                    type='text'
                    name={'text'}
                    placeholder='Search posts'
                    value={searchText}
                    handleChange = {handleSearchChange}
                />
            </div>
            <div className='mt-10'>
                {isLoading ? (
                    <div className='flex justify-center items-center'>
                        <Loader />
                    </div>
                ) : (
                    <>
                        {searchText && (
                            <h2 className='font-medium text-[#666e75] text-xl mb-3'>
                                Showing Resuls for <span className='text-[#222328]'>{searchText}</span>
                            </h2>
                        )}
                        <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
                            {searchText ? (
                                <RenderCard
                                    data={searchedPosts}
                                    title='No Search Results Found'
                                />
                            ) : (
                                <RenderCard
                                    data={allPosts}
                                    title='No Posts Found'
                                />
                            )
                            }
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}

export default Home