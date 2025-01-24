import React from 'react';
import logo from "../assets/logo.png";
import { useAuth } from '../context/AuthContext';
import { PackagePlus } from 'lucide-react';
import DecryptedStyledText from './DecryptedStyledText';


const Home = () => {

    
  const { user } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 dark:text-customPeach">
    <img
      src={logo}
      alt="Migration Logo"
      className="w-32 h-32 mb-6 animate-bounce"
    />
    <h1 className="text-4xl font-technor-black mb-4">
        <DecryptedStyledText
          text={`Welcome to Migration, ${user?.displayName || 'Guest'}!`}
          delay={50}
          fontSize="2rem"
          fontWeight="bold"
          color="#FF5733"
        /> </h1>
    <p className="text-xl mb-8 max-w-2xl">
      Start your journey by creating a new topic. Choose from
      different types like modal notes, checklists, or list cards to
      organize your thoughts and tasks.
    </p>
    <button
      onClick={() => setIsSelectingType(true)}
      className="flex items-center justify-center px-6 py-3 bg-customTeal text-white rounded-lg hover:bg-customMint font-technor-bold transition-all duration-500 shadow-lg hover:shadow-xl"
    >
      <PackagePlus className="h-6 w-6 mr-2" />
      Create Your First Topic
    </button>
  </div>
  )
}

export default Home