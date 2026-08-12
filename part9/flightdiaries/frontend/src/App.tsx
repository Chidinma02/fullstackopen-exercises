import { useState, useEffect } from 'react';
import axios from 'axios';
import type { DiaryEntry, Weather, Visibility } from './types';
import { getAllDiaries, createDiary } from './services/diaryService';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('great');
  const [weather, setWeather] = useState<Weather>('sunny');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getAllDiaries()
      .then((data) => {
        setDiaries(data);
      })
      .catch((err) => {
        console.error('Failed to fetch diaries:', err);
      });
  }, []);

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    createDiary({
      date,
      visibility,
      weather,
      comment
    })
      .then((newEntry) => {
        setDiaries(diaries.concat(newEntry));
        setDate('');
        setComment('');
        setError('');
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          if (err.response && typeof err.response.data === 'object') {
            const errorData = err.response.data as { error?: Array<{ message: string }> | string };
            if (errorData.error && Array.isArray(errorData.error)) {
              const msg = errorData.error.map((e) => e.message).join(', ');
              setError(msg);
            } else if (typeof errorData.error === 'string') {
              setError(errorData.error);
            } else {
              setError(err.message);
            }
          } else {
            setError(err.message);
          }
        } else {
          setError('Unknown error occurred');
        }
        // clear error after 5 seconds
        setTimeout(() => {
          setError('');
        }, 5000);
      });
  };

  return (
    <div>
      <h2>Add new entry</h2>
      {error && (
        <p style={{ color: 'red' }}>
          {error.startsWith('Error:') ? error : `Error: ${error}`}
        </p>
      )}
      <form onSubmit={diaryCreation}>
        <div>
          date:{' '}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        
        <div>
          visibility:{' '}
          {(['great', 'good', 'ok', 'poor'] as Visibility[]).map((v) => (
            <label key={v} style={{ marginRight: '10px' }}>
              <input
                type="radio"
                name="visibility"
                checked={visibility === v}
                onChange={() => setVisibility(v)}
              />
              {v}
            </label>
          ))}
        </div>

        <div>
          weather:{' '}
          {(['sunny', 'rainy', 'cloudy', 'stormy', 'windy'] as Weather[]).map((w) => (
            <label key={w} style={{ marginRight: '10px' }}>
              <input
                type="radio"
                name="weather"
                checked={weather === w}
                onChange={() => setWeather(w)}
              />
              {w}
            </label>
          ))}
        </div>

        <div>
          comment:{' '}
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button type="submit">add</button>
      </form>

      <h2>Diary entries</h2>
      {diaries.map((diary) => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <p>
            visibility: {diary.visibility}
            <br />
            weather: {diary.weather}
            {diary.comment && (
              <>
                <br />
                comment: {diary.comment}
              </>
            )}
          </p>
        </div>
      ))}
    </div>
  );
};

export default App;
