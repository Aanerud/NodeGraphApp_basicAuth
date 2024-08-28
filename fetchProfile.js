const axios = require('axios');

async function fetchProfile(accessToken) {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        const response = await axios.get(`${process.env.GRAPH_ENDPOINT}/v1.0/me`, options);
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function fetchPeopleSearch(accessToken) {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    };

    const body = {
        requests: [
            {
                entityTypes: ["person"],
                query: {
                    queryString: "*"
                },
                from: 0,
                size: 50,
                fields: ["displayName"]
            }
        ]
    };

    try {
        const response = await axios.post(`${process.env.GRAPH_ENDPOINT}/v1.0/search/query`, body, options);
        return response.data.value[0].hitsContainers[0].hits.map(hit => hit.resource); // Extract the person objects from the response
    } catch (error) {
        console.error('Error fetching people using search:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { fetchProfile, fetchPeopleSearch };
