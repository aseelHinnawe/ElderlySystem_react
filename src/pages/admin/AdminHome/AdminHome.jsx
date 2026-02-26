import React from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
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

// بيانات الكروت
const stats = [
  { label: "عدد المسنين", value: 12, icon: <PeopleAltOutlined fontSize="large" />, color: "#f86437", progress: 60 },
  { label: "عدد الممرضين", value: 4, icon: <VolunteerActivism fontSize="large" />, color: "#29b6f6", progress: 30 },
  { label: "عدد الانشظة", value: 8, icon: <CalendarMonthOutlined fontSize="large" />, color: "#66bb6a", progress: 45 },
  { label: "عدد التبرعات", value: 7, icon: <PaidOutlined fontSize="large" />, color: "#b541c9", progress: 70 },
  { label: "عدد الغرف", value: 5, icon: <HomeOutlined fontSize="large" />, color: "#ffa726", progress: 50 },
  { label: "عدد الكفلاء", value: 5, icon: <GroupsOutlined fontSize="large" />, color: "#f56bc7", progress: 50 },
];

// بيانات التبرعات لكل أشهر السنة
const donationsOverTime = [
  { month: "يناير", donations: 2 },
  { month: "فبراير", donations: 3 },
  { month: "مارس", donations: 4 },
  { month: "أبريل", donations: 6 },
  { month: "مايو", donations: 7 },
  { month: "يونيو", donations: 4 },
  { month: "يوليو", donations: 4 },
  { month: "أغسطس", donations: 2 },
  { month: "سبتمبر", donations: 3 },
  { month: "أكتوبر", donations: 2 },
  { month: "نوفمبر", donations: 5 },
  { month: "ديسمبر", donations: 1 },
];

// مهام المدير
const tasks = [
  { 
    title: "مراجعة سجل التبرعات", 
    desc: "تأكد من تحديث التبرعات النقدية والعينية.", 
    iconText: "📝", // قلم 
    color: "#f4ede2" // بيج هادئ
  },
  { 
    title: "تأكيد الأنشطة القادمة", 
    desc: "راجع الأنشطة القادمة وجدول المشاركين.", 
    iconText: "📅", // تقويم
    color: "#E8F5E9" // أخضر فاتح هادئ
  },
  { 
    title: "إرسال إشعارات للكفلاء", 
    desc: "تواصل مع الكفلاء حول آخر المستجدات.", 
    iconText: "✉️", // رسالة 
    color: "#E3F2FD" // أزرق فاتح هادئ
  },
  { 
    title: "متابعة الموظفين", 
    desc: "تأكد من حضور الممرضين والمشرفين.", 
    iconText: "✅", // علامة صح
    color: "#FCE4EC" // وردي فاتح هادئ
  },
];

export default function AdminHome() {
  return (
    <Box sx={{ p: 3, minHeight: "100vh", background: "#f9f9f4" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 900 ,color:"#6a6a57"}}>
        لوحة التحكم الرئيسية
      </Typography>

      {/* ====== كروت الإحصائيات ====== */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {stats.map((s, idx) => (
          <Grid size={{xs:12,sm:6,lg:4}} key={idx}>
            <Card sx={{ display: "flex", p: 2, alignItems: "center", gap: 2, borderRadius: 3 }}>
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
                <Typography sx={{ fontSize: 22, fontWeight: 900 }}>{s.value}</Typography>
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
        <Grid size={{xs:12,lg:7}}>
          <Card sx={{ p: 2, height: "100%" }}>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>التبرعات الشهرية</Typography>
     <Box sx={{ width: "100%", height: 400 }}> 
  <ResponsiveContainer width="100%" height={400}>
    <ComposedChart margin={{ right: 10, left: -35 }} data={donationsOverTime}>
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="month" angle={-40} textAnchor="end" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="donations" fill="#bdddae" radius={[5,5,0,0]} />
      <Line type="monotone" dataKey="donations" stroke="#3e9132" strokeWidth={2} />
    </ComposedChart>
  </ResponsiveContainer>
</Box>
          </Card>
        </Grid>

        {/* قائمة المهام */}
        <Grid  size={{xs:12,lg:5}}>
          <Card sx={{ p: 2, height: "100%" }}>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>مهام المدير</Typography>
        <List>
  {tasks.map((task, idx) => (
    <Box key={idx} sx={{ mb: idx < tasks.length - 1 ? 2 : 0 }}>
      <ListItem sx={{ background: task.color, borderRadius: 2, alignItems: "center" }}>
        {/* أيقونة على اليسار */}
        <Box sx={{ fontSize: 28, ml: 2, display: "flex", alignItems: "center" }}>
          {task.iconText}
        </Box>
        {/* النصوص على اليمين */}
        <ListItemText
          primary={
            <Typography sx={{ fontWeight: 700, color: "#333", textAlign: "right" }}>
              {task.title}
            </Typography>
          }
          secondary={
            <Typography sx={{ color: "#666", textAlign: "right" }}>
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