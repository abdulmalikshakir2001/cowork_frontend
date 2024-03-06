import React, { useState, useEffect } from 'react';
import moment from 'moment';

const AgoTime: React.FC<any> = ({ date }) => {
  const [formattedTime, setFormattedTime] = useState<string>('');

  useEffect(() => {
    const updateFormattedTime = () => {
      const then = moment(date);
      const now = moment();

      const duration = moment.duration(now.diff(then));
      const minutes = Math.abs(duration.asMinutes());

      let newFormattedTime: string;
      if (minutes < 1) {
        newFormattedTime = 'Just now';
      } else if (minutes < 60) {
        newFormattedTime = `${Math.floor(minutes)} min ago`;
      } else {
        const hours = Math.floor(minutes / 60);
        newFormattedTime = `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
      }
      setFormattedTime(newFormattedTime);
    };

    updateFormattedTime(); // Initial update

    // Update formatted time every minute
    const intervalId = setInterval(updateFormattedTime, 60000);

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [date]);
  return <span>{formattedTime}</span>;
};
export default AgoTime;
