import React, { useEffect, useState } from 'react';
import { 
  Box, Card, Typography, Divider, CircularProgress, Avatar, Grid 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AccountCircle,LocationCity,Wc, Fingerprint, Email, Phone } from '@mui/icons-material';

export default function AdminProfile() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

    // ==== فنكشن مستقلة لجلب البيانات ====
  const fetchAdminData = async () => {
    const token = localStorage.getItem('token'); // جلب التوكن

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    try {
      const res = await axios.get('https://localhost:7160/api/Identity/Account/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // طباعة الـ response
      console.log('Full response:', res);
      console.log('Data only:', res.data);

      setAdminData(res.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);

      if (err.response && err.response.status === 401) {
        navigate('/login', { replace: true }); // إعادة توجيه إذا 401
      }
    } finally {
      setLoading(false); // دائمًا نوقف الـ loading
    }
  };

  // ==== useEffect ينادي الفنكشن فقط ====
  useEffect(() => {
    fetchAdminData();
  }, []); // لا داعي لأي dependencies

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!adminData) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">
          فشل في تحميل بيانات الحساب
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 9 }}>
      <Card sx={{ width: '100%', maxWidth: 800, p: 3, borderRadius: 4, boxShadow: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: '#6a6a57', mb: 2 }}>
            <AccountCircle sx={{ fontSize: 60 }} />
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {adminData.fullName}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            الحساب الشخصي
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
         
          <Grid size={{xs:12 , sm:6}}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email sx={{ color: '#6a6a57', fontSize: 24}}/>
              <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
  <strong>البريد الإلكتروني:</strong>
  <span>{adminData.data.email}</span>
</Typography>
            </Box>
          </Grid>

          <Grid size={{xs:12 , sm:6}}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ color: '#6a6a57', fontSize: 24 }}/>
              <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
        <strong>رقم الهاتف:</strong>
        <span>{adminData.data.phoneNumber}</span>
      </Typography>
            </Box>
          </Grid>

          <Grid size={{xs:12 , sm:6}}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountCircle sx={{ color: '#6a6a57', fontSize: 24 }} />
              <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
        <strong>الاسم الكامل:</strong>
        <span>{adminData.data.fullName}</span>
      </Typography>
            </Box>
          </Grid>
          <Grid size={{xs:12 , sm:6}}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <LocationCity sx={{ color: '#6a6a57', fontSize: 24 }} />
      <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
        <strong>المدينة:</strong>
        <span>{adminData.data.city}</span>
      </Typography>
    </Box>
  </Grid>

  {/* الرقم الوطني */}
  <Grid size={{xs:12 , sm:6}}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Fingerprint sx={{ color: '#6a6a57', fontSize: 24 }} />
      <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
        <strong>رقم الهوية :</strong>
        <span>{adminData.data.nationalId}</span>
      </Typography>
    </Box>
  </Grid>

  {/* الجنس */}
  <Grid size={{xs:12 , sm:6}}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Wc sx={{ color: '#6a6a57', fontSize: 24 }} />
      <Typography variant="body1" sx={{ display: 'flex', gap: 1 }}>
        <strong>الجنس:</strong>
        <span>{adminData.data.genderValue}</span>
      </Typography>
    </Box>
  </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
