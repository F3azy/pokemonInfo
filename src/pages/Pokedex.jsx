import React, { useState, useEffect } from "react";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import {
  PokeImg,
  PokeBasicInfo,
  PokeMoreInfo,
  Loading,
  NotFound,
} from "../components";

const Pokedex = () => {
  let { state } = useLocation();

  const [query, setQuery] = useState(() => {return "https://pokeapi.co/api/v2/pokemon/" + state.PokemonName;});
  const [Pokemon, setPokemon] = useState(() => {return null;});
  const [loading, setLoading] = useState(() => {return true;});
  const [notFound, setNotFound] = useState(() => {return false;});

  useEffect(() => {
    setQuery("https://pokeapi.co/api/v2/pokemon/" + state.PokemonName);
  }, [state.PokemonName]);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetch(query)
      .then((response) => response.json())
      .then((pokemon) => {
        let timer = setTimeout(() => {
          setLoading(false);
        }, 1000);
        // setLoading(false);
        setPokemon(pokemon);
        return () => clearTimeout(timer);
      })
      .catch((error) => {
        setNotFound(true);
        console.log("Pokemon not Found", error);
      });
  }, [query]);

  if (notFound) return <NotFound />;
  if (loading) return <Loading />;

  return (
    <VStack gap={{ base: "12px", lg: "24px" }}>
      <Flex 
      w="100%"
      direction={{ base: "column", xl: "row" }} 
      justify="center"
      align={{xl: "center"}}
      gap={{ base: "12px", lg: "24px" }}
      >
        <PokeImg url={Pokemon.sprites} />
        <PokeBasicInfo
          name={Pokemon.name}
          id={Pokemon.id}
          height={Pokemon.height}
          weight={Pokemon.weight}
          types={Pokemon.types}
          stats={Pokemon.stats}
        />
      </Flex>
      <PokeMoreInfo moves={Pokemon.moves} />
    </VStack>
  );
};

export default Pokedex;
