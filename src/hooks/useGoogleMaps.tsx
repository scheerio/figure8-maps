import { useEffect } from "react";

const useGoogleMaps = (apiKey: string | undefined) => {
  if (!apiKey){
    console.log('Missing Google API key.')
  }
  useEffect(() => {
    if (
      !document.querySelector(
        `script[src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places"]`
      )
    ) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, [apiKey]);
};

export default useGoogleMaps;
