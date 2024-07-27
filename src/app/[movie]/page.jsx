"use client";
import { useEffect, useState } from 'react';

export default function Movie({ params }) {
  
  const { movie } = params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-black mt-20">
      <h1 className="flex text-white text-3xl font-boldv">{movie}</h1>
      <h1 className=" flex text-white text-3xl font-bold">Movie Details Page</h1>
      {/* Display other movie details here (poster, description, etc.) */}
    </main>
  );

}