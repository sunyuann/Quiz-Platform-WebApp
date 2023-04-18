import React from 'react';
import Alert from '@mui/material/Alert';

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
          ? (<img src={catImageUrl} alt="Random cat picture" style={{ width: '100%', height: 'auto' }} />)
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
