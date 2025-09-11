import { useEffect, useRef } from "react";

function useOnceEffect(callback) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      callback();
    }
  }, [callback]);
}

export default useOnceEffect;
