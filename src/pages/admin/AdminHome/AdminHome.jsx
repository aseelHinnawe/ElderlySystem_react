import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import {
  PeopleAltOutlined,
  VolunteerActivism,
  CalendarMonthOutlined,
  PaidOutlined,
  GroupsOutlined,
  HomeOutlined,
} from "@mui/icons-material";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import AxiosUserInstance from "../../../api/AxiosUserInstance";


// مهام المدير - حالياً ثابتة
const tasks = [
  {
    title: "مراجعة سجل التبرعات",
    desc: "تأكد من تحديث التبرعات النقدية والعينية.",
    iconText: "📝",
    color: "#f4ede2",
  },
  {
    title: "تأكيد الأنشطة القادمة",
    desc: "راجع الأنشطة القادمة وجدول المشاركين.",
    iconText: "📅",
    color: "#E8F5E9",
  },
  {
    title: "إرسال إشعارات للكفلاء",
    desc: "تواصل مع الكفلاء حول آخر المستجدات.",
    iconText: "✉️",
    color: "#E3F2FD",
  },
  {
    title: "متابعة الموظفين",
    desc: "تأكد من حضور الممرضين والمشرفين.",
    iconText: "✅",
    color: "#FCE4EC",
  },
];


export default function AdminHome() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [donationsOverTime, setDonationsOverTime] = useState([]);


  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);


        const res = await AxiosUserInstance.get("/Admin/dashboard");
        const data = res?.data?.data;


        const statsData = data?.stats || {};


        setStats([
          {
            label: "عدد المسنين",
            value: statsData.elderliesCount ?? 0,
            icon: <PeopleAltOutlined fontSize="large" />,
            color: "#f86437",
            progress: 60,
          },
          {
            label: "عدد الممرضين",
            value: statsData.nursesCount ?? 0,
            icon: <VolunteerActivism fontSize="large" />,
            color: "#29b6f6",
            progress: 30,
          },
          {
            label: "عدد الأنشطة",
            value: statsData.activitiesCount ?? 0,
            icon: <CalendarMonthOutlined fontSize="large" />,
            color: "#66bb6a",
            progress: 45,
          },
          {
            label: "عدد التبرعات",
            value: statsData.donationsCount ?? 0,
            icon: <PaidOutlined fontSize="large" />,
            color: "#b541c9",
            progress: 70,
          },
          {
            label: "عدد الغرف",
            value: statsData.roomsCount ?? 0,
            icon: <HomeOutlined fontSize="large" />,
            color: "#ffa726",
            progress: 50,
          },
          {
            label: "عدد الكفلاء",
            value: statsData.sponsorsCount ?? 0,
            icon: <GroupsOutlined fontSize="large" />,
            color: "#f56bc7",
            progress: 50,
          },
        ]);


        setDonationsOverTime(data?.donationsOverTime || []);
      } catch (error) {
        console.error("Dashboard API Error:", error);
        setStats([]);
        setDonationsOverTime([]);
      } finally {
        setLoading(false);
      }
    };


    fetchDashboard();
  }, []);


  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#f9f9f4",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }


  return (
    <Box sx={{ p: 3, minHeight: "100vh", background: "#f9f9f4" }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: 900, color: "#6a6a57" }}
      >
        لوحة التحكم الرئيسية
      </Typography>


      {/* ====== كروت الإحصائيات ====== */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {stats.map((s, idx) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={idx}>
            <Card
              sx={{
                display: "flex",
                p: 2,
                alignItems: "center",
                gap: 2,
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  backgroundColor: s.color + "33",
                  p: 1.5,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {s.icon}
              </Box>


              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 700 }}>{s.label}</Typography>
                <Typography sx={{ fontSize: 22, fontWeight: 900 }}>
                  {s.value}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={s.progress}
                  sx={{ mt: 1, height: 8, borderRadius: 5 }}
                />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>


      {/* ====== الرسم البياني + المهام ====== */}
      <Grid container spacing={4} alignItems="stretch">
        {/* الرسم البياني */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 2, height: "100%" }}>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>
              التبرعات الشهرية
            </Typography>


            <Box sx={{ width: "100%", height: 400 }}>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart
                  margin={{ right: 10, left: -35 }}
                  data={donationsOverTime}
                >
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="month" angle={-40} textAnchor="end" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="donations"
                    fill="#bdddae"
                    radius={[5, 5, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="donations"
                    stroke="#3e9132"
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>


        {/* قائمة المهام */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ p: 2, height: "100%" }}>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>مهام المدير</Typography>


            <List>
              {tasks.map((task, idx) => (
                <Box key={idx} sx={{ mb: idx < tasks.length - 1 ? 2 : 0 }}>
                  <ListItem
                    sx={{
                      background: task.color,
                      borderRadius: 2,
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: 28,
                        ml: 2,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {task.iconText}
                    </Box>


                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#333",
                            textAlign: "right",
                          }}
                        >
                          {task.title}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{
                            color: "#666",
                            textAlign: "right",
                          }}
                        >
                          {task.desc}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}



