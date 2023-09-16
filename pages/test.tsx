import React, { useEffect, useState, useMemo } from 'react';

export interface Item {
  FNM: string;
  SNM: string;
  PH: string;
  ID: number;
}

export default function Test() {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    // Fetch data from the server-side API route
    fetch('/api/testApi')
      .then((response) => response.json())
      .then((res) => {
        setData(res);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const memoizedListItems = useMemo(() => {
    // Map the data to JSX list items
    return data.map((item: Item) => (
      <li key={item.ID}>{item.FNM}</li>
    ));
  }, [data]); // Memoize based on the 'data' dependency
  console.log(data)
  return (
    <div>
      <h1>MySQL Data</h1>
      <ul>{memoizedListItems}</ul>
    </div>
  );
}
