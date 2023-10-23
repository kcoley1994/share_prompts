"use client";

import { useEffect, useState } from "react";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 " > 
    
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [posts, setPosts] = useState([]);


  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchResults, setSearchResults] = useState([]);


  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();
    
    setPosts(data);
  };


  useEffect(() => {
    
    fetchPosts();
  }, []);

  const filterPrompts = (textSearch) => {
    const regex = new RegExp(textSearch, 'i');
    return posts.filter(
      (item) =>
      regex.test(item.creator.username) ||
      regex.test(item.tag) ||
      regex.test(item.prompt)
    );
  };
  
  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value)

    setSearchTimeout(
      setTimeout(() => {
        const result = filterPrompts(e.target.value);
        setSearchResults(result)
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const result = filterPrompts(tagName);
    setSearchResults(result);
  };


  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search For A Tag or Username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      { searchText ? (
        <PromptCardList data={searchResults} handleTagClick={handleTagClick} />
      ) : (
      <PromptCardList data={posts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
