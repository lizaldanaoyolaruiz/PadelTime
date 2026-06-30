import { useEffect, useState } from "react";

const Counter = ({ end = 0, duration = 2000, suffix = "+" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (end === 0) return;

    let start = 0;
    const stepTime = Math.max(10, duration / end);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
};

export default Counter;
