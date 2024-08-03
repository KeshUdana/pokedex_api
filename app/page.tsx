"use client";

import { useState } from 'react';
import Image from 'next/image';

interface PokemonData {
  name: string;
  img: string;
  types: string;
  abilities: string;
}

export default function Home() {
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [error, setError] = useState<string>('');

  async function fetchData() {
    const pnameInput = document.getElementById("pname") as HTMLInputElement | null;
    if (!pnameInput) return;

    const pname = pnameInput.value.toLowerCase();

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pname}`);

      if (!response.ok) {
        throw new Error("Pokemon doesn't exist");
      }

      const data = await response.json();
      setPokemonData({
        name: data.name,
        img: data.sprites.front_default,
        types: data.types.map((typeInfo: { type: { name: string } }) => typeInfo.type.name).join(", "),
        abilities: data.abilities.map((abilityInfo: { ability: { name: string } }) => abilityInfo.ability.name).join(", ")
      });
      setError('');
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setError("Error: " + error.message);
      } else {
        setError("An unexpected error occurred");
      }
      setPokemonData(null);
    }
  }

  return (
    <main className="relative min-h-screen">
      <Image src="/1351278.png" alt="" layout="fill" className="object-cover z-0" />
      <div className="absolute top-10 left-10 z-40">
        <h1 className="text-8xl">Welcome to the Pokedex</h1>
        <p>
          Enter the name of your favorite Pokemon to get started and search away,
          <span className="text-3xl">
            Gotta Catch &apos;Em All!
          </span>
        </p>
      </div>
      <div className="relative flex flex-col items-center justify-center min-h-screen z-30 py-10">
        <div className="w-96 max-w-md p-8 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-rose-600 rounded-lg flex flex-col items-center justify-center">
          <input type="text" id="pname" placeholder="Enter Pokemon name" className="mb-4 p-2 rounded" />
          <button onClick={fetchData} className="p-2 bg-purple-500 rounded text-white">Get Pokemon</button>
          {pokemonData && (
            <>
              <Image src={pokemonData.img} alt="Pokemon Image" width={96} height={96} />
              <p id="pokeInfo">
                Name: {pokemonData.name}<br />
                Type: {pokemonData.types}<br />
                Abilities: {pokemonData.abilities}<br />
              </p>
            </>
          )}
          {error && <p id="pokeInfo" className="text-red-500">{error}</p>}
        </div>
      </div>
    </main>
  );
}
