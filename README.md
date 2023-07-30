# Solar Flow Diverter

## Introduction

The Solar Flow Diverter is an innovative energy management system that seamlessly integrates with SolisCloud, Mixergy Smart Hot Water Tank, and MetOffice Weather Data to optimize solar energy consumption. The primary goal of the system is to intelligently redirect surplus solar energy away from exporting to the National Grid, effectively utilizing it to power the Mixergy Smart Hot Water Tank and other home appliances. This smart redirection enables users to have greater control over their energy consumption, reducing their reliance on traditional grid-based electricity and promoting sustainable energy practices.

## Features

- **Real-Time Solar Energy Monitoring**: The system continuously monitors solar energy production in real-time, providing valuable insights into energy generation.

- **Mixergy Smart Hot Water Tank Control**: The Solar Flow Diverter efficiently diverts excess solar energy to heat the Mixergy Smart Hot Water Tank, ensuring efficient utilization of surplus power.

- **Weather-Based Energy Optimization**: By leveraging MetOffice Weather Data, the system forecasts weather conditions to optimize energy consumption based on available sunlight.

- **Battery Management**: When the battery is fully charged, the Solar Flow Diverter automatically redirects surplus energy to power other household devices or the Mixergy Smart Hot Water Tank.

- **User-Defined Energy Scheduling**: Users can create personalized energy usage schedules, enabling them to prioritize specific appliances during preferred time slots.

## Optimization Process

1. **Battery Full**: When the battery reaches full capacity, the Solar Flow Diverter automatically shifts surplus solar energy away from the battery to avoid overcharging. The excess energy is redirected to power other household appliances or the Mixergy Smart Hot Water Tank, ensuring no energy goes to waste.

2. **Customized Redirection**: Users have the option to create personalized energy redirection rules using the user-defined energy scheduling feature. For instance, users can set up specific times when excess solar energy should be primarily used to heat the Mixergy Smart Hot Water Tank, maximizing energy efficiency.

3. **Intelligent Energy Redistribution**: The Solar Flow Diverter continuously monitors solar energy production and consumption patterns, ensuring a seamless transition between battery storage, household consumption, and hot water tank heating, all while minimizing reliance on grid-based electricity.

## Getting Started

1. **Prerequisites**: Before using the Solar Flow Diverter, ensure that you have installed solar panels, the Mixergy Smart Hot Water Tank, and a compatible energy storage system.

2. **Installation**: Install the necessary dependencies by running `npm install` or `yarn install`.

3. **Configuration**: Update the API URLs for SolisCloud, Mixergy, and MetOffice Weather Data in the `config.js` file, tailoring the system to your setup.

4. **Run the Application**: Start the application with `npm start` or `yarn start`.

## Usage

1. The Solar Flow Diverter continuously fetches and analyzes real-time solar energy production data from SolisCloud.

2. During periods of excess solar energy, the system smartly diverts the surplus to heat the Mixergy Smart Hot Water Tank and other designated devices.

3. Users can create customized energy usage schedules to prioritize energy consumption according to their preferences and requirements.

4. MetOffice Weather Data assists the system in predicting weather patterns, ensuring optimal energy distribution based on available sunlight.

## Contributing

Contributions to the Solar Flow Diverter project are highly appreciated. Whether you want to suggest improvements, fix bugs, or add new features, please feel free to submit a pull request. For significant changes, kindly open an issue first to discuss the proposed modifications.

## License

The Solar Flow Diverter is open-source software licensed under the MIT License. You can find more details in the [LICENSE](LICENSE) file.

## Acknowledgments

The Solar Flow Diverter project owes its success to the integration of APIs from SolisCloud, Mixergy, and MetOffice Weather Data. We extend our gratitude to these platforms for their contributions to renewable energy and sustainable living.
