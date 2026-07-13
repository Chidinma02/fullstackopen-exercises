import { isNotNumber } from "./utils.ts";

export const calculateBmi = (heightCm: number, weightKg: number): string => {
  if (heightCm <= 0 || weightKg <= 0) {
    throw new Error('Height and weight must be positive numbers');
  }
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi < 25.0) {
    return 'Normal (healthy weight)';
  } else if (bmi < 30.0) {
    return 'Overweight';
  } else {
    return 'Obese';
  }
};

interface BmiArguments {
  height: number;
  weight: number;
}

const parseBmiArguments = (args: string[]): BmiArguments => {
  if (args.length < 4) throw new Error('Not enough arguments. Usage: npm run calculateBmi <heightCm> <weightKg>');
  if (args.length > 4) throw new Error('Too many arguments. Usage: npm run calculateBmi <heightCm> <weightKg>');

  if (!isNotNumber(args[2]) && !isNotNumber(args[3])) {
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

if (process.argv[1] === import.meta.filename) {
  try {
    if (process.argv.length === 2) {
      // Fallback to default values for Exercise 9.1 if run directly without arguments
      console.log(calculateBmi(180, 74));
    } else {
      const { height, weight } = parseBmiArguments(process.argv);
      console.log(calculateBmi(height, weight));
    }
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}
