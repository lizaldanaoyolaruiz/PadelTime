import { useEffect, useState } from "react"

const Counter = ({end, durartion = 2000, suffix = '+'}) => {
  const [count,setCount] = useState(0)

  useEffect(() => {
     let start = 0;
    const stepTime = Math.floor(duration / end);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <>{count}{suffix}</>;
};

export default Counter;