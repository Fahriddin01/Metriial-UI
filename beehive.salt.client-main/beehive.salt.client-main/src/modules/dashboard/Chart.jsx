import React from 'react';
import { Bar } from 'react-chartjs-2';

export default function Chart({statData, cards}) {
   
    return (
        <>
            <Bar
                data = {{
                    // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Puprle', 'Orange'], // name of incoming data
                    labels: 
                        cards.map((card) => {
                            return card.name
                        })
                    , // name of incoming data
                   
                    datasets: [
                        {
                            label: "Number",
                            // data: [12, 19, 3, 5, 2, 3], // numbers of incoming data
                            data:   statData ? [statData.reportsCount, statData.usersCount, statData.organizationCount, statData.complaintsCount, statData.iodineTotalVolumeIn,statData.totalVolumeIn] : null,

                            backgroundColor: [
                                'rgba(255,99,132, 0.2)',
                                'rgba(54,165,235, 0.2)',
                                'rgba(255,206,86, 0.2)',
                                'rgba(75,192,192, 0.2)',
                                'rgba(153,102,255, 0.2)',
                                'rgba(255,159,64, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255,99,132, 1)',
                                'rgba(54,165,235, 1)',
                                'rgba(255,206,86, 1)',
                                'rgba(75,192,192, 1)',
                                'rgba(153,102,255, 1)',
                                'rgba(255,159,64, 1)',
                            ],
                            borderWidth: 1,
                        }
                    ]
                }}
                options= {{
                    maintainAspectRatio: false,
                }}
                height={400}
                width={600}
            />
        </>
    )
}