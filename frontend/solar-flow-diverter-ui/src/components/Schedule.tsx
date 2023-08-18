import React, { useEffect, useState } from 'react';
import { apiUrl } from '../config';

interface ScheduleItem {
  maintain: { off: number; on: number };
  set: number;
  time: string;
}

interface ScheduleData {
  days: string[];
  items: ScheduleItem[];
}

const Schedule: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);

  useEffect(() => {
    async function fetchScheduleData() {
      try {
        const response = await fetch(`${apiUrl}/tank_schedule`);
        const data = await response.json();
        setScheduleData(data.schedule[0]);
      } catch (error) {
        console.error('Error fetching schedule data:', error);
      }
    }

    fetchScheduleData();
  }, []);

  const containerStyle: React.CSSProperties = {
    paddingRight: '20px',
    marginTop: '20px',
    flex: 1,
  };

  const days: string[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  const tickStyle: React.CSSProperties = {
    color: 'green',
    marginRight: '5px',
  };

  const crossStyle: React.CSSProperties = {
    color: 'red',
    marginRight: '5px',
  };

  function capitalizeWord(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  return (
    <div style={containerStyle}>
      <table>
        <thead>
          <tr>
            {days.map((day) => (
              <th key={day}>{capitalizeWord(day)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {days.map((day) => {
              const hasEntry = scheduleData?.days.includes(day);
              return (
                <td key={day}>
                  {hasEntry ? (
                    <span style={tickStyle}>✅</span>
                  ) : (
                    <span style={crossStyle}>❌</span>
                  )}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Schedule;
