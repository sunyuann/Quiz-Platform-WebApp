import React from 'react';
import Alert from '@mui/material/Alert';
import { Box } from '@mui/material';

function CatPics () {
  const [catAlert, setCatAlert] = React.useState('');
  const [catImageUrl, setCatImageUrl] = React.useState(null);

  const fetchRandomCatImage = async () => {
    try {
      const response = await fetch('https://api.thecatapi.com/v1/images/search');
      const data = await response.json();
      setCatImageUrl(data[0].url);
    } catch (error) {
      setCatAlert(`Error fetching random cat image: ${error}`);
    }
  };

  React.useEffect(() => {
    fetchRandomCatImage();

    const interval = setInterval(() => {
      fetchRandomCatImage();
    }, 10000); // Fetch new image every 10 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div>
        { catImageUrl
          ? (<Box component='img' src={catImageUrl} alt="Random cat picture" sx={{ width: '100%' }} />)
          : (<p>Loading Cat...</p>)
        }
      </div>
      <div>
        { catAlert && (
          <Alert severity={'error'} onClose={() => setCatAlert('')}>
            {catAlert};
          </Alert>
        )}
      </div>
    </>
  );
}

export default CatPics;
