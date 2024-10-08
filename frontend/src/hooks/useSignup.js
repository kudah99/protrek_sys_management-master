import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { dispatch } = useAuthContext();

  const signup = async (name,email, password) => {
    setLoading(true);
    setError(null);

    const res = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/user/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          admin: true
        },),
      }
    );

    const json = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(json.error);
    }

    if (res.ok) {
      //  update the auth context
      dispatch({ type: "LOGIN", payload: json });

      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));

      setLoading(false);
    }
  };

  return { signup, error, loading };
};
