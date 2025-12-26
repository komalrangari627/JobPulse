import { useState, createContext, useContext } from "react";

const messageContext = createContext();

const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState({
    status: "",
    content: "",
    open: false,
  });

  const triggerMessage = (status, content) => {
    setMessage({ status, content, open: true });

    setTimeout(() => {
      setMessage({
        status: "",
        content: "",
        open: false,
      });
    }, 5000);
  };

  return (
    <messageContext.Provider value={{ message, triggerMessage }}>
      {children}
    </messageContext.Provider>
  );
};

const useMessage = () => useContext(messageContext);

export { MessageProvider, useMessage };
