import React, { useState, useEffect } from "react";
import { Flex, Button, Grid, GridItem } from "@chakra-ui/react";
import { Pokeball } from "../components";
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";

const POKEMON_LIMIT = 20;

const ACTIONS = {
  INCREMENT: "increment",
  DECREMENT: "decrement",
}

const Home = () => {
  
  const { p = 1 } = useParams();
  const page = (typeof p === "undefined") ? 1 : parseInt(p);
  const query = `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_LIMIT}&offset=${(page-1)*POKEMON_LIMIT}`;
  
  const navigate = useNavigate();
  const [next, setNext] = useState("");
  const [previous, setPrevious] = useState("");
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(query, {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((allPokemon) => {
        setPokemons(allPokemon.results);
        setNext(allPokemon.next);
        setPrevious(allPokemon.previous);

        return () => controller.abort();
      });
  }, [query]);

  function pagination(action) {
    switch(action) {
      case ACTIONS.INCREMENT:
        if(!next) break;
        navigate(`/${page+1}`);
        break;
      case ACTIONS.DECREMENT:
        if(!previous) break;
        if(page-1===1) navigate("/");
        else navigate(`/${page-1}`);
        break;
      default:
        break;
    }
  }

  return (
    <>
      <Flex justify="space-between">
        <Button
          onClick={() => pagination(ACTIONS.DECREMENT)}
          colorScheme="yellow"
          isDisabled={!previous}
          leftIcon={<ArrowBackIcon />}
        >
          Previous
        </Button>
        <Button
          onClick={() => pagination(ACTIONS.INCREMENT)}
          colorScheme="yellow"
          isDisabled={!next}
          rightIcon={<ArrowForwardIcon />}
        >
          Next
        </Button>
      </Flex>

      <Grid
        templateColumns={{base: "repeat(4, auto)", lg:"repeat(5, auto)"}}
        justifyContent="space-between"
        rowGap={{base: 7, lg: 5}}
      >
        {pokemons.map((pokemon) => (
          <GridItem key={pokemon.name}>
            <Pokeball name={pokemon.name} />
          </GridItem>
        ))}
      </Grid>
      </>
  );
};

export default Home;
