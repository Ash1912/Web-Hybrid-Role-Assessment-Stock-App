import React , { useEffect, useState} from 'react';
import axios from 'axios';

const DataDisplay = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://fakestoreapi.com/products");
                setData(response.data);
            } catch (error) {
                setError("Failed to fetch data");
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    if (loading) return <p>loading......</p>;
    if(error) return <p>{error}</p>;

    return (
        <div>
            <h1>Product Data</h1>
                {data.map((item, index) => (
                    <div key={index}>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                    </div>
                ))}
        </div>
    );
    };

export default DataDisplay;