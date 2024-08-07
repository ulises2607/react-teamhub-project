import React, { useEffect, useState } from "react";

const HomePage = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const response = await fetch(
      "https://sandbox.academiadevelopers.com/users/profiles",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token 992becb2dc2dd16870a4b4a8ddfb1c0682cf2f31",
        },
      }
    );
    const result = await response.json();
    return result;
  };

  useEffect(() => {
    const getData = async () => {
      const usuarios = await fetchData();
      setData(usuarios);
      console.log("La data de los usuarios: ", usuarios);
    };
    getData();
  }, []);

  return <div>Pagina Principal</div>;
};

export default HomePage;
