import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from "axios";

import { Patient, Entry, NewEntry, Diagnosis, Gender, HealthCheckRating } from "../../types";
import patientService from "../../services/patients";
import AddEntryForm from "./AddEntryForm";

interface Props {
  diagnoses: Diagnosis[];
}

const getGenderIcon = (gender: Gender) => {
  switch (gender) {
    case Gender.Male:
      return <MaleIcon color="primary" />;
    case Gender.Female:
      return <FemaleIcon color="error" />;
    case Gender.Other:
      return <TransgenderIcon color="action" />;
    default:
      return null;
  }
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const PatientDetailPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();

  const submitNewEntry = async (values: NewEntry) => {
    if (!id) return;
    try {
      const addedEntry = await patientService.addEntry(id, values);
      if (patient) {
        setPatient({
          ...patient,
          entries: patient.entries.concat(addedEntry)
        });
      }
      setShowForm(false);
      setFormError(undefined);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e.response?.data && typeof e.response.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          setFormError(message);
        } else {
          setFormError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setFormError("Unknown error");
      }
    }
  };

  useEffect(() => {
    if (!id) return;
    patientService.getOne(id)
      .then(data => {
        setPatient(data);
      })
      .catch(err => {
        console.error(err);
        setError("Patient details could not be loaded.");
      });
  }, [id]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  const getDiagnosisName = (code: string): string => {
    const diagnosis = diagnoses.find(d => d.code === code);
    return diagnosis ? diagnosis.name : "";
  };

  const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    const commonFields = (
      <Box sx={{ marginBottom: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          diagnosed by {entry.specialist}
        </Typography>
        {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
          <Box sx={{ marginTop: 1, paddingLeft: 2 }}>
            <ul>
              {entry.diagnosisCodes.map(code => (
                <li key={code}>
                  <Typography variant="body2">
                    {code} {getDiagnosisName(code)}
                  </Typography>
                </li>
              ))}
            </ul>
          </Box>
        )}
      </Box>
    );

    const cardStyle = {
      marginBottom: 2,
      border: "1px solid #ccc",
      borderRadius: 2,
      boxShadow: "none"
    };

    switch (entry.type) {
      case "Hospital":
        return (
          <Card sx={cardStyle}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body1" fontWeight="bold">{entry.date}</Typography>
                <LocalHospitalIcon />
              </Box>
              <Typography sx={{ fontStyle: "italic", marginY: 1 }}>
                {entry.description}
              </Typography>
              {commonFields}
              {entry.discharge && (
                <Typography variant="body2">
                  discharge {entry.discharge.date} {entry.discharge.criteria}
                </Typography>
              )}
            </CardContent>
          </Card>
        );
      case "OccupationalHealthcare":
        return (
          <Card sx={cardStyle}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body1" fontWeight="bold">{entry.date}</Typography>
                <WorkIcon />
                <Typography variant="body1" fontWeight="bold" sx={{ fontStyle: "italic" }}>
                  {entry.employerName}
                </Typography>
              </Box>
              <Typography sx={{ fontStyle: "italic", marginY: 1 }}>
                {entry.description}
              </Typography>
              {commonFields}
              {entry.sickLeave && (
                <Typography variant="body2">
                  sick leave: {entry.sickLeave.startDate} to {entry.sickLeave.endDate}
                </Typography>
              )}
            </CardContent>
          </Card>
        );
      case "HealthCheck":
        const getHeartColor = (rating: HealthCheckRating): string => {
          switch (rating) {
            case HealthCheckRating.Healthy:
              return "green";
            case HealthCheckRating.LowRisk:
              return "yellow";
            case HealthCheckRating.HighRisk:
              return "orange";
            case HealthCheckRating.CriticalRisk:
              return "red";
            default:
              return "grey";
          }
        };

        return (
          <Card sx={cardStyle}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body1" fontWeight="bold">{entry.date}</Typography>
                <MedicalServicesIcon />
              </Box>
              <Typography sx={{ fontStyle: "italic", marginY: 1 }}>
                {entry.description}
              </Typography>
              <FavoriteIcon sx={{ color: getHeartColor(entry.healthCheckRating) }} />
              {commonFields}
            </CardContent>
          </Card>
        );
      default:
        return assertNever(entry);
    }
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 1 }}>
        <Typography variant="h5" fontWeight="bold">{patient.name}</Typography>
        {getGenderIcon(patient.gender)}
      </Box>

      <Typography sx={{ marginY: 0.5 }}>
        ssh: {patient.ssn}
      </Typography>
      <Typography sx={{ marginY: 0.5 }}>
        occupation: {patient.occupation}
      </Typography>

      <Typography variant="h6" fontWeight="bold" sx={{ marginTop: 4, marginBottom: 1 }}>
        entries
      </Typography>

      {showForm && (
        <AddEntryForm
          onSubmit={submitNewEntry}
          onCancel={() => setShowForm(false)}
          error={formError}
          diagnoses={diagnoses}
        />
      )}

      {!showForm && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowForm(true)}
          sx={{ marginBottom: 2 }}
        >
          Add New Entry
        </Button>
      )}

      {patient.entries && patient.entries.length > 0 ? (
        patient.entries.map(entry => (
          <EntryDetails key={entry.id} entry={entry} />
        ))
      ) : (
        <Typography>No entries found.</Typography>
      )}
    </Box>
  );
};

export default PatientDetailPage;
