import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import AxiosUserInstance from "../../../api/AxiosUserInstance";
export default function HomeSponsore() {
  const [elderlyList, setElderlyList] = useState([]);

  const fetchMyElderly = async () => {
    const res = await AxiosUserInstance.get("/Sponsor/Elderly/mine");
    setElderlyList(res?.data?.data || []);
  };

  useEffect(() => {
    fetchMyElderly();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      {elderlyList.map((elderly) => (
        <Card key={elderly.elderlyId} sx={{ mb: 3 }}>
          <CardContent>

            <Typography variant="h5" sx={{ mb: 2 }}>
              {elderly.elderlyName}
            </Typography>

            <Stack spacing={2}>
              {elderly.sponsors.map((sponsor) => (
                <Box key={sponsor.sponsorId} sx={{ p: 2, border: "1px solid #eee", borderRadius: 2 }}>
                  
                  <Typography sx={{ fontWeight: "bold" }}>
                    {sponsor.sponsorName}
                  </Typography>

                  <Typography>
                    صلة القرابة: {sponsor.kinShip}
                  </Typography>

                  <Typography>
                    درجة الكفالة: {sponsor.degree}
                  </Typography>             

                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
