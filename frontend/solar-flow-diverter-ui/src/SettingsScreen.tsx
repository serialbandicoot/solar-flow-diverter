import React from 'react';

interface Props {}

const SettingsScreen: React.FC<Props> = () => {
  // You can access the settings within the component

  const settingsData = {
    key_id: 'your-key-id',
    secret_key: 'your-secret-key',
    plant_id: 'your-plant-id',
    station_id: 'your-station-id',
    serial_number: 'your-serial-number',
    portal_domain: 'your-portal-domain',
    portal_username: 'your-portal-username',
    met_office_api_key: 'your-met-office-api-key',
    lat: 123.45,
    long: -67.89,
  };

  const { key_id, secret_key, plant_id, station_id, serial_number, portal_domain, portal_username, met_office_api_key, lat, long } = settingsData;

  // Use the settings as needed in your component
  return (
    <div>
      <h2>Settings</h2>
      <p>KEY_ID: {key_id}</p>
      <p>SECRET_KEY: {secret_key}</p>
      <p>PLANT_ID: {plant_id}</p>
      <p>STATION_ID: {station_id}</p>
      <p>SERIAL_NUMBER: {serial_number}</p>
      <p>PORTAL_DOMAIN: {portal_domain}</p>
      <p>PORTAL_USERNAME: {portal_username}</p>
      <p>MET_OFFICE_API_KEY: {met_office_api_key}</p>
      <p>Latitude: {lat}</p>
      <p>Longitude: {long}</p>
    </div>
  );
};

export default SettingsScreen;
