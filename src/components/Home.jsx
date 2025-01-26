import React from 'react';
import logo from "../assets/logo.png";
import { useAuth } from '../context/AuthContext';
import DecryptedStyledText from './DecryptedStyledText';


const Home = () => {

    
  const { user } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
    <img
      src={logo}
      alt="Migration Logo"
      className="size-48 mb-6 animate-pulse"
    />
    <h1 className="text-4xl font-technor-black mb-4">
        <DecryptedStyledText
          text={`Welcome to Migration, ${user?.displayName || 'Guest'}!`}
          delay={50}
          fontSize="2rem"
          fontWeight="bold"
          color="#FF5733"
        /> </h1>
    <p className="text-xl mb-8 max-w-3xl font-technor-bold text-customMint drop-shadow-xl">
      Start your journey by creating a new topic. Choose from
      different types like modal notes, checklists, or list cards to
      organize your thoughts and tasks.
    </p>
  </div>
  )
}

export default Home