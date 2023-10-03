import React, { useRef } from "react";
import openai from "../utils/openai";
import { API_OPTIONS } from "../utils/constants";
import { json } from "react-router-dom";
import { addGptMovieResult } from "../utils/gptSlice";
import { useDispatch } from "react-redux";

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const searchText = useRef(null);

  const searchMovies = async (movie) => {
    const data = await fetch(
      "https://api.themoviedb.org/3/search/movie?query=" +
        movie +
        "&include_adult=false&language=en-US&page=1",
      API_OPTIONS
    );
    const json = await data.json();
    return json.results;
  };
  const handleGptSearch = async () => {
    const query =
      "Act as a Movie Recommendation system and suggest some movies for the query : " +
      searchText.current.value +
      ". only give me names of 5 movies, comma seperated like the example result given ahead. Example Result: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya";
    const getResults = await openai.chat.completions.create({
      messages: [{ role: "user", content: query }],
      model: "gpt-3.5-turbo",
    });
    // if(!getResults.choices){

    // }

    const gptMovies = getResults.choices?.[0]?.message.content.split(",");
    const promiseArray = gptMovies.map((movie) => searchMovies(movie));
    const tmdbResults = await Promise.all(promiseArray);
    dispatch(
      addGptMovieResult({
        movieNames: gptMovies,
        movieResults: tmdbResults,
      })
    );
  };

  return (
    <div
      className=" pt-[10%] md:pt-[10%] flex justify-center  "
      onSubmit={(e) => e.preventDefault()}
    >
      <form className="  w-6/6 rounded-lg bg-opacity-70 md: w-1/2 bg-black  grid grid-cols-12 ">
        <input
          ref={searchText}
          type="text"
          className=" p-2 md:p-4 m-4 col-span-9 rounded-lg bg-gray-400"
          placeholder="Search Something"
        />
        <button
          className="md:py-2 px-4 bg-red-700 text-white rounded-lg m-4 col-span-3"
          onClick={handleGptSearch}
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default GptSearchBar;
