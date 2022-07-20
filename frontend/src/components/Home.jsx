import { useEffect, useState } from "react";

export const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/users", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((d) => setData(d.data));
  }, []);

  return (
    <div>
      {data.map((el) => (
        <div>
          <img src={el.picture} />
          <p>{el.first_name}</p>
        </div>
      ))}
    </div>
  );
};
