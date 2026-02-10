import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import {
  ElderlyWoman,
  People,
  LocalHospital,
  MonetizationOn,
  Event,
  TrendingUp,
} from "@mui/icons-material";

export default function AdminHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://localhost:7160/api/Admin/dashboard/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Stats response:", res.data);
      setStats(res.data.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          فشل في تحميل الإحصائيات
        </Typography>
      </Box>
    );
  }

  // ==== كومبوننت للكارد الواحد ====
  const StatCard = ({ Icon, label, value, color }) => (
  <Card 
  sx={{
    borderRadius: 3,
    boxShadow: 3,
    background: `linear-gradient(135deg, ${color}20, ${color}50)`,
    transition: "transform 0.3s, box-shadow 0.3s",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
    },
  }}>
    <CardContent sx={{ display: "flex", alignItems: "center", gap: 3 }}>
      
      <Box
  sx={{
    width: 60,
    height: 60,
    borderRadius: "50%",
    bgcolor: `${color}33`, // لون نصف شفاف من لون الأيقونة
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <Icon sx={{ fontSize: 40, color }} />
</Box>


      <Box>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {value}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);


  return (
    <Box sx={{ p: 3 }}>
      {/* بطاقة الترحيب */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 5,
          background:
            "linear-gradient(135deg,rgb(106,106,87),rgb(160,160,120))",
          color: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box >
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              لوحة التحكم
            </Typography>
            <Typography sx={{ opacity: 0.9, mt: 1 }}>
              أهلاً بك 👋 — نظرة شاملة على إحصائيات دار المسنين
            </Typography>
          </Box>
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TrendingUp sx={{ fontSize: 40, color: "#fff" }} />
          </Box>
        </CardContent>
      </Card>

      {/* Grid للكروت */}
      <Grid container spacing={3}>
        <Grid size={{xs:12 , sm:6}}>
          <StatCard
  Icon={ElderlyWoman}
  label="عدد المسنين"
  value={stats.elderlyCount}
  color="#999963"
/>
        </Grid>

 <Grid size={{ xs: 12, sm: 6 }}>
    <StatCard
      Icon={People}
      label="عدد الكفلاء"
      value={stats.sponsorsCount}
      color="#f29a56"
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6 }}>
    <StatCard
      Icon={LocalHospital}
      label="عدد الممرضين"
      value={stats.nursesCount}
      color="#6b9ff8"
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6 }}>
    <StatCard
      Icon={MonetizationOn}
      label="عدد التبرعات"
      value={stats.donationsCountToDate}
      color="#7ac17d"
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6 }}>
    <StatCard
      Icon={Event}
      label="عدد الفعاليات"
      value={stats.eventsCountToDate}
      color="#e388a7"
    />
  </Grid>       
      </Grid>
    </Box>
  );
}
