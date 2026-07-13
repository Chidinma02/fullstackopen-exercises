import { isNotNumber } from "./utils.ts";

export interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (dailyExercises: number[], target: number): Result => {
  const periodLength = dailyExercises.length;
  const trainingDays = dailyExercises.filter(hours => hours > 0).length;
  const totalHours = dailyExercises.reduce((sum, hours) => sum + hours, 0);
  const average = periodLength > 0 ? totalHours / periodLength : 0;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = 'great job, target reached!';
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'you need to work much harder to meet your target';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

interface ExerciseArguments {
  target: number;
  dailyExercises: number[];
}

const parseExerciseArguments = (args: string[]): ExerciseArguments => {
  if (args.length < 4) {
    throw new Error('Not enough arguments. Usage: npm run calculateExercises <target> <hours1> <hours2> <hours3> ...');
  }

  const target = Number(args[2]);
  if (isNotNumber(target)) {
    throw new Error('Target must be a number');
  }

  const dailyExercises: number[] = [];
  for (let i = 3; i < args.length; i++) {
    const val = Number(args[i]);
    if (isNotNumber(val)) {
      throw new Error('Daily exercise hours must be numbers');
    }
    dailyExercises.push(val);
  }

  return {
    target,
    dailyExercises
  };
};

if (process.argv[1] === import.meta.filename) {
  try {
    if (process.argv.length === 2) {
      // Fallback to default values for Exercise 9.2 if run directly without arguments
      console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
    } else {
      const { target, dailyExercises } = parseExerciseArguments(process.argv);
      console.log(calculateExercises(dailyExercises, target));
    }
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}
