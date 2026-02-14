import React from 'react';
import {
  Box,
  Card,
  Typography,
  CircularProgress,
  Avatar,
  Grid,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  AccountCircle,
  LocationCity,
  Wc,
  Fingerprint,
  Email,
  Phone
} from '@mui/icons-material';
import AxiosUserInstance from '../../../api/AxiosUserInstance';
import style from './AdminProfile.module.css';
const avatarStyles = {
  width: 100,
  height: 100,
  bgcolor: '#fff',
  color: '#6a6a57',
  mx: 'auto',
  mb: 2,
};

// كومبوننت InfoItem زي ما عندك
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
  const navigate = useNavigate();

  // ==== Fetch البيانات باستخدام AxiosUserInstance ====
  const fetchAdminData = async () => {
    const res = await AxiosUserInstance.get('/Identity/Account/me');
    return res.data.data;
  };

  const { data: adminData, isLoading, isError } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: fetchAdminData,
    staleTime: 1000 * 60 * 5, // cache لمدة 5 دقائق
    retry: 1, // إعادة محاولة واحدة فقط عند الفشل
    onError: (err) => {
      if (err.response?.status === 401) {
        navigate('/login', { replace: true });
      }
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !adminData) {
    return (
      <Typography color="error" align="center" mt={4}>
        فشل في تحميل بيانات الحساب
      </Typography>
    );
  }

  return (
    <Box className={style.cardWrapper}>
      <Card
        sx={{borderRadius: 5}} className={style.card} 
      >
        {/* Header */}
        <Box
          className={style.header}
        >
          <Avatar
            sx={avatarStyles}
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
            <Grid size={{xs:12 , sm:4}} >
              <InfoItem icon={<Email />} label="البريد الإلكتروني" value={adminData.email} />
            </Grid>

            <Grid size={{xs:12 , sm:4}}>
              <InfoItem icon={<Phone />} label="رقم الهاتف" value={adminData.phoneNumber} />
            </Grid>

            <Grid size={{xs:12 , sm:4}}>
              <InfoItem icon={<LocationCity />} label="المدينة" value={adminData.city} />
            </Grid>

            <Grid size={{xs:12 , sm:4}}>
              <InfoItem icon={<Fingerprint />} label="رقم الهوية" value={adminData.nationalId} />
            </Grid>

            <Grid size={{xs:12 , sm:4}}>
              <InfoItem icon={<Wc />} label="الجنس" value={adminData.genderValue} />
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
}
