import { Recycle } from "lucide-react";
import React, { useState, useEffect } from "react";

const API_URL = "https://dummyjson.com/quotes";

const QuoteApp = () => {
  const [quotes, setQuotes] = useState([]);
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuotes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch quotes");
      const data = await response.json();
      setQuotes(data.quotes);
    } catch (err) {
      setError("Unable to fetch quotes. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRandomQuote = () => {
    if (quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    if (quotes.length > 0) fetchRandomQuote();
  }, [quotes]);

  return (
    <div className="max-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <main className="container max-w-4xl p-24 hover:scale-125 transition-all duration-300">
        {/* Display Daily Quote */}
        <div className="p-6 bg-customMint rounded-lg shadow-md mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-3xl font-bold text-customTeal font-technor-black">Quote of the Day</h3>
            <button
              onClick={fetchRandomQuote}
              className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition"
              title="Get new quote"
            >
              <Recycle className="h-6 w-6 text-customOrange" />
            </button>
          </div>
          {quote ? (
            <>
              <blockquote className="text-4xl font-medium font-technor-bold mb-4 italic">
                "{quote.quote}"
              </blockquote>
              <p className="text-right text-gray-600 font-medium font-technor-semibold">
                - {quote.author}
              </p>
            </>
          ) : (
            <p className="text-gray-500 italic">Loading quote...</p>
          )}
        </div>

      </main>
    </div>
  );
};

export default QuoteApp;
