import { useState, SyntheticEvent } from "react";
import { TextField, Button, Grid, Box, Typography, InputLabel, Select, MenuItem, SelectChangeEvent, FormControl, OutlinedInput, Chip } from "@mui/material";
import { NewEntry, HealthCheckRating, Diagnosis } from "../../types";

interface Props {
  onCancel: () => void;
  onSubmit: (values: NewEntry) => void;
  error?: string;
  diagnoses: Diagnosis[];
}

const AddEntryForm = ({ onCancel, onSubmit, error, diagnoses }: Props) => {
  const [entryType, setEntryType] = useState<"HealthCheck" | "Hospital" | "OccupationalHealthcare">("HealthCheck");
  
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  // HealthCheck specific
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);

  // Hospital specific
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  // OccupationalHealthcare specific
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState("");
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState("");

  const onRatingChange = (event: SelectChangeEvent<number>) => {
    event.preventDefault();
    const value = event.target.value;
    if (typeof value === "number") {
      setHealthCheckRating(value as HealthCheckRating);
    }
  };

  const handleDiagnosisCodesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setDiagnosisCodes(typeof value === 'string' ? value.split(',') : value);
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    const baseFields = {
      description,
      date,
      specialist,
      ...(diagnosisCodes.length > 0 ? { diagnosisCodes } : {})
    };

    let entryPayload: NewEntry;

    switch (entryType) {
      case "HealthCheck":
        entryPayload = {
          ...baseFields,
          type: "HealthCheck",
          healthCheckRating
        };
        break;
      case "Hospital":
        entryPayload = {
          ...baseFields,
          type: "Hospital",
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria
          }
        };
        break;
      case "OccupationalHealthcare":
        entryPayload = {
          ...baseFields,
          type: "OccupationalHealthcare",
          employerName,
          ...(sickLeaveStartDate && sickLeaveEndDate ? {
            sickLeave: {
              startDate: sickLeaveStartDate,
              endDate: sickLeaveEndDate
            }
          } : {})
        };
        break;
      default:
        return;
    }

    onSubmit(entryPayload);
  };

  return (
    <Box sx={{ border: "2px dashed #ccc", padding: 2, borderRadius: 2, marginBottom: 3 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 2 }}>
        New entry
      </Typography>

      {error && (
        <Typography color="error" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}

      <form onSubmit={addEntry}>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="entry-type-label">Entry type</InputLabel>
          <Select
            labelId="entry-type-label"
            id="entry-type"
            value={entryType}
            label="Entry type"
            onChange={({ target }) => setEntryType(target.value as "HealthCheck" | "Hospital" | "OccupationalHealthcare")}
          >
            <MenuItem value="HealthCheck">Health Check</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
            <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Date"
          type="date"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
          sx={{ marginBottom: 2 }}
        />

        {entryType === "HealthCheck" && (
          <>
            <InputLabel sx={{ marginTop: 1 }}>Healthcheck rating</InputLabel>
            <Select
              label="Healthcheck rating"
              fullWidth
              value={healthCheckRating}
              onChange={onRatingChange}
              sx={{ marginBottom: 2 }}
            >
              <MenuItem value={HealthCheckRating.Healthy}>Healthy</MenuItem>
              <MenuItem value={HealthCheckRating.LowRisk}>LowRisk</MenuItem>
              <MenuItem value={HealthCheckRating.HighRisk}>HighRisk</MenuItem>
              <MenuItem value={HealthCheckRating.CriticalRisk}>CriticalRisk</MenuItem>
            </Select>
          </>
        )}

        {entryType === "Hospital" && (
          <>
            <TextField
              label="Discharge Date"
              type="date"
              fullWidth
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Discharge Criteria"
              fullWidth
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
              sx={{ marginBottom: 2 }}
            />
          </>
        )}

        {entryType === "OccupationalHealthcare" && (
          <>
            <TextField
              label="Employer Name"
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Sick Leave Start Date"
              type="date"
              fullWidth
              value={sickLeaveStartDate}
              onChange={({ target }) => setSickLeaveStartDate(target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Sick Leave End Date"
              type="date"
              fullWidth
              value={sickLeaveEndDate}
              onChange={({ target }) => setSickLeaveEndDate(target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: 2 }}
            />
          </>
        )}

        <FormControl fullWidth sx={{ marginBottom: 3 }}>
          <InputLabel id="diagnosis-codes-label">Diagnosis codes</InputLabel>
          <Select
            labelId="diagnosis-codes-label"
            id="diagnosis-codes"
            multiple
            value={diagnosisCodes}
            onChange={handleDiagnosisCodesChange}
            input={<OutlinedInput label="Diagnosis codes" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {diagnoses.map((d) => (
              <MenuItem key={d.code} value={d.code}>
                {d.code} - {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Grid container justifyContent="space-between">
          <Grid>
            <Button
              color="error"
              variant="contained"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddEntryForm;
