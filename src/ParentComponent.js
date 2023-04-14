import React, { useState, useEffect } from 'react';
import BarChartRace from './BarChartRace';

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
                    { name: 'Team A', value: 100 },
                    { name: 'Team B', value: 200 },
                    { name: 'Team C', value: 300 },
                    { name: 'Team D', value: 400 },
                ],
                [
                    { name: 'Team A', value: 150 },
                    { name: 'Team B', value: 250 },
                    { name: 'Team C', value: 350 },
                    { name: 'Team D', value: 500 },
                ],
                [
                    { name: 'Team A', value: 180 },
                    { name: 'Team B', value: 300 },
                    { name: 'Team D', value: 550 },
                    { name: 'Team C', value: 800 },
                ],
                [
                    { name: 'Team A', value: 250 },
                    { name: 'Team B', value: 400 },
                    { name: 'Team D', value: 900 },
                    { name: 'Team C', value: 1000 },
                ],
            ];
            setData(sampleData);
        };

        fetchData();
    }, []);

    return (
        <div className="w-full h-full">
            <BarChartRace data={data} speed={3000} />
        </div>
    );
};

export default ParentComponent;
