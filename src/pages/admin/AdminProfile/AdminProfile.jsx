import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Divider,
  CircularProgress,
  Avatar,
  Grid,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  AccountCircle,
  LocationCity,
  Wc,
  Fingerprint,
  Email,
  Phone
} from '@mui/icons-material';

const InfoItem = ({ icon, label, value }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      borderRadius: 3,
      border: '1px solid #eee',
      transition: '0.3s',
      '&:hover': {
        boxShadow: 3,
        transform: 'translateY(-2px)',
      },
    }}
  >
    <Avatar sx={{ bgcolor: '#6a6a57', width: 42, height: 42 }}>
      {icon}
    </Avatar>
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="bold">
        {value || '-'}
      </Typography>
    </Box>
  </Paper>
);

export default function AdminProfile() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAdminData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const res = await axios.get(
        'https://localhost:7160/api/Identity/Account/me',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdminData(res.data.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!adminData) {
    return (
      <Typography color="error" align="center" mt={4}>
        فشل في تحميل بيانات الحساب
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center',mt:2 }}>
      <Card
        sx={{
          width: '100%',
          maxWidth: 900,
          borderRadius: 5,
          overflow: 'hidden',
          boxShadow: 6,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background:
            "linear-gradient(135deg,rgb(106,106,87),rgb(160,160,120))",
            color: '#fff',
            p: 4,
            textAlign: 'center',
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: '#fff',
              color: '#6a6a57',
              mx: 'auto',
              mb: 2,
            }}
          >
            <AccountCircle sx={{ fontSize: 70 }} />
          </Avatar>
          <Typography variant="h4" fontWeight="bold">
            {adminData.fullName}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            الحساب الشخصي
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid size={{xs:12 , sm:4}}>
              <InfoItem
                icon={<Email />}
                label="البريد الإلكتروني"
                value={adminData.email}
              />
            </Grid>

            <Grid size={{xs:12 , sm:4}}>
              <InfoItem
                icon={<Phone />}
                label="رقم الهاتف"
                value={adminData.phoneNumber}
              />
            </Grid>

            <Grid size={{xs:12 , sm:4}}>
              <InfoItem
                icon={<LocationCity />}
                label="المدينة"
                value={adminData.city}
              />
            </Grid>

            <Grid size={{xs:12 , sm:4}}>
              <InfoItem
                icon={<Fingerprint />}
                label="رقم الهوية"
                value={adminData.nationalId}
              />
            </Grid>

            <Grid size={{xs:12 , sm:4}}>
              <InfoItem
                icon={<Wc />}
                label="الجنس"
                value={adminData.genderValue}
              />
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
}
