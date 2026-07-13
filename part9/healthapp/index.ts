import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises } from './exerciseCalculator.ts';
import { isNotNumber } from './utils.ts';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = req.query.height;
  const weight = req.query.weight;

  if (!height || !weight || isNotNumber(height) || isNotNumber(weight)) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  const heightNum = Number(height);
  const weightNum = Number(weight);

  try {
    const bmiResult = calculateBmi(heightNum, weightNum);
    res.json({
      weight: weightNum,
      height: heightNum,
      bmi: bmiResult
    });
  } catch {
    res.status(400).json({ error: 'malformatted parameters' });
  }
});

interface ExerciseRequestBody {
  daily_exercises?: unknown;
  target?: unknown;
}

app.post('/exercises', (req, res) => {
  const { daily_exercises, target } = req.body as ExerciseRequestBody;

  if (daily_exercises === undefined || target === undefined) {
    res.status(400).json({ error: 'parameters missing' });
    return;
  }

  if (
    isNotNumber(target) ||
    !Array.isArray(daily_exercises) ||
    (daily_exercises as unknown[]).some(hours => isNotNumber(hours))
  ) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  const targetNum = Number(target);
  const dailyExercisesNum = (daily_exercises as unknown[]).map(hours => Number(hours));

  const result = calculateExercises(dailyExercisesNum, targetNum);
  res.json(result);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
