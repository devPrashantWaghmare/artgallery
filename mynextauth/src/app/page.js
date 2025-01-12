//src/app/page.js

'use client';
import {React, useState } from 'react';

import { SessionProvider } from "next-auth/react"

import HomePage from "../components/Home/HomePage";

export default function Home({session}) {
  return (
    <SessionProvider session={session}> 
<HomePage />  
</SessionProvider> 
  );
}
