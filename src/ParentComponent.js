import React, { useState, useEffect } from 'react';
import BarChartRace from './BarChartRace';

const sortDataByValue = (data) => {
    return data.map((weekData) => {
        return weekData.slice().sort((a, b) => b.value - a.value);
    });
};


const ParentComponent = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch data from your backend or API and set the data state
        // For this example, we'll use a static dataset

        const fetchData = async () => {
            try {
              const response = await fetch('http://localhost:8080/raw/fpl/premierleague.com/league/37606/score_history');

              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }

              const data = await response.json();
              const sortedData = sortDataByValue(data['data']);
              setData(sortedData);

            } catch (error) {
              console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="w-full h-full">
            <BarChartRace data={data} speed={1000} />
        </div>
    );
};

export default ParentComponent;
