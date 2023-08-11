import React, { FC } from 'react';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: FC<SectionHeaderProps> = ({ title }) => {
  return (
    <div style={{marginTop: '20px', padding: '20px', background: '#F7AD40', }}>
    <h2 style={{ width: '100%', margin: '0', color: 'white' }}>
      {title}
    </h2>
  </div>
  );
};

export default SectionHeader;
