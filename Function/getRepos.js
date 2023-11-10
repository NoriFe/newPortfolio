exports.handler = async (event, context) => {
    try {
      const username = 'NoriFe';
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      const data = await response.json();
  
      return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      };
    }
  };