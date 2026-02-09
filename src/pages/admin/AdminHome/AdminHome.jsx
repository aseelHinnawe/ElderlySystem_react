import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { ElderlyWoman, People, LocalHospital, MonetizationOn, Event } from '@mui/icons-material';

export default function AdminHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==== فنكشن لجلب البيانات من API ====
  const fetchStats = async () => {
    const token = localStorage.getItem('token'); // توكن من التخزين
    if (!token) return; // ممكن تضيف إعادة توجيه للـ login هنا

    try {
      const res = await axios.get('https://localhost:7160/api/Identity/Account/homeStats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Stats response:', res.data); // طباعة للـ debugging
      setStats(res.data.data); // حسب شكل الـ API عندك
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">فشل في تحميل الإحصائيات</Typography>
      </Box>
    );
  }

  // ==== كومبوننت للكارد الواحد ====
  const StatCard = ({ icon, label, value, color }) => (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ fontSize: 40, color }}>{icon}</Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{value}</Typography>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>لوحة التحكم</Typography>

      <Grid container spacing={3}>
        <Grid size={{xs:12 , sm:6 ,md:4}}>
          <StatCard 
            icon={<ElderlyWoman />} 
            label="عدد المسنين" 
            value={stats.elderlyCount} 
            color="#6a6a57" 
          />
        </Grid>

        <Grid size={{xs:12 , sm:6 ,md:4}}>
          <StatCard 
            icon={<People />} 
            label="عدد الكفلاء" 
            value={stats.sponsorsCount} 
            color="#FF6F00" 
          />
        </Grid>

        <Grid size={{xs:12 , sm:6 ,md:4}}>
          <StatCard 
            icon={<LocalHospital />} 
            label="عدد الممرضين" 
            value={stats.nursesCount} 
            color="#2979FF" 
          />
        </Grid>

        <Grid size={{xs:12 , sm:6 ,md:4}}>
          <StatCard 
            icon={<MonetizationOn />} 
            label="التبرعات حتى الآن" 
            value={stats.donationsCountToDate} 
            color="#4CAF50" 
          />
        </Grid>

        <Grid size={{xs:12 , sm:6 ,md:4}}>
          <StatCard 
            icon={<Event />} 
            label="عدد الفعاليات حتى الان" 
            value={stats.eventsCountToDate} 
            color="#FF4081" 
          />
        </Grid>
      </Grid>
    </Box>
  );
}
