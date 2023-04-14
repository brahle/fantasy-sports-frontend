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
            const sampleData = [
                [
                    { name: 'Team A', value: 0 },
                    { name: 'Team B', value: 0 },
                    { name: 'Team C', value: 0 },
                    { name: 'Team D', value: 0 },
                ],
                [
                    { name: 'Team A', value: 10 },
                    { name: 'Team B', value: 20 },
                    { name: 'Team C', value: 30 },
                    { name: 'Team D', value: 40 },
                ],
                [
                    { name: 'Team A', value: 70 },
                    { name: 'Team B', value: 60 },
                    { name: 'Team C', value: 50 },
                    { name: 'Team D', value: 40 },
                ],
                [
                    { name: 'Team A', value: 70 },
                    { name: 'Team B', value: 60 },
                    { name: 'Team C', value: 50 },
                    { name: 'Team D', value: 40 },
                ],
            ];
            const sortedData = sortDataByValue(sampleData);
            setData(sortedData);
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
