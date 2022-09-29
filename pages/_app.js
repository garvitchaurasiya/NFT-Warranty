import '../styles/globals.css'
import 'semantic-ui-css/semantic.min.css'
import LoadingBar from 'react-top-loading-bar'
import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';

function MyApp({ Component, pageProps }) {
  const [progress, setProgress] = useState();
  const router = useRouter();

  useEffect(() => {
    
    router.events.on('routeChangeStart', ()=>{
      setProgress(40);
    })
    router.events.on('routeChangeComplete', ()=>{
      setProgress(100);
    });

  }, [])
  
  return <>
    <LoadingBar
      color='#f11946'
      progress={progress}
      onLoaderFinished={() => setProgress(0)}
    />
    <Component {...pageProps} />
  </>
}

export default MyApp
