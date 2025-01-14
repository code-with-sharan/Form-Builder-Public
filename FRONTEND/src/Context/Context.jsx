import { createContext, useState, useEffect } from "react";
const BackendURL = "http://localhost:9000" // Backend URL
// const BackendURL = "https://form-builder-xz3s.onrender.com" // for deployment

const FrontendURL = "http://localhost:5173"
// const FrontendURL = "https://form-builder-eta-seven.vercel.app" // for deployment

const StoreContext = createContext(null); // creating context with null value. It is a way to indicate that there is no value provided by default.

const StoreContextProvider = (props) => {
  const [token, setToken] = useState(""); // state for storing token

  // stay logged in:
  useEffect(() => {
    async function loadData() {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    }
    loadData();
  }, []); // Run only once. jabb bhi component mount (render) krega, loadData() function chalega.

  const contextValue = {
    // we can access the elements of "contextValue" in any component using the context.
    BackendURL,
    FrontendURL,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export { StoreContext };
export default StoreContextProvider;