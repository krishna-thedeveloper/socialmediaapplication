import { useState, useEffect } from 'react';

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const BASE_URL = "http://localhost:3000";  // Assuming this is the base URL

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);  // Set loading to true at the start of the fetch
      setIsError(false);  // Reset error state before making a new request

      try {
        const response = await fetch(BASE_URL + url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',  // Ensure you're sending and receiving JSON
            ...options.headers,
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setData(result);  // Set the fetched data to state
      } catch (err) {
        setIsError(true);  // Set error state if the fetch fails
        setError(err);  // Store the error
      } finally {
        setIsLoading(false);  // Set loading to false when the fetch is complete
      }
    };

    fetchData();  // Trigger fetch when the URL or options change
  }, [url]);  // Only run the effect when the `url` or `options` change

  return { data, isLoading, isError, error };
};

export default useFetch;
