import { Box, Button, Card, CardContent, Container, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import heroImage from "../../assets/mainImg.jpg";
import Image from "../../assets/img.jpg";
import MovingIcon from "@mui/icons-material/Moving";

import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import AccessibleOutlinedIcon from "@mui/icons-material/AccessibleOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

const services = [
  { title: 'الرعاية الصحية اليومية', icon: <LocalHospitalOutlinedIcon  sx={{ fontSize: 50, color: '#f0f0ea' }} />, description: 'متابعة طبية منتظمة، إشراف تمريضي على مدار الساعة، والالتزام بالأدوية والخطط العلاجية.' },
  { title: 'التغذية الصحية المتوازنة', icon: <RestaurantMenuOutlinedIcon  sx={{ fontSize: 50, color: '#f0f0ea' }} />, description: 'وجبات يومية مدروسة بعناية، تناسب احتياجات كبار السن الصحية وتُحضّر بأجواء منزلية.' },
  { title: 'الإقامة المريحة والآمنة', icon: <AccessibleOutlinedIcon  sx={{ fontSize: 50, color: '#f0f0ea' }} />, description: 'غرف نظيفة ومريحة، مجهزة بكل ما يلزم لضمان الراحة والخصوصية والأمان.' },
  { title: 'الدعم النفسي والاجتماعي', icon: <PsychologyOutlinedIcon  sx={{ fontSize: 50, color: '#f0f0ea' }} />, description: 'جلسات ترفيهية، أنشطة جماعية، ودعم نفسي يخفف الشعور بالوحدة ويعزز الروح الإيجابية.' },
  { title: 'المرافقة والاهتمام الشخصي', icon: <FavoriteBorderOutlinedIcon  sx={{ fontSize: 50, color: '#f0f0ea' }} />, description: 'مرافقة دائمة في التنقل، المساعدة في الأنشطة اليومية، والاهتمام بكل التفاصيل الصغيرة.' },
  { title: 'أنشطة ترفيهية وتنشيطية', icon: <SportsEsportsIcon  sx={{ fontSize: 50, color: '#f0f0ea' }} />, description: 'أنشطة فنية، حركية، وثقافية تُساعد على تنشيط الذاكرة وتحسين جودة الحياة.' },
];


export default function Home() {
  return (
    <>
      <Box id="home">
        {/* Hero Section */}
        <Box
          sx={{
            height: { xs: "50vh", md: "80vh" }, // أصغر ارتفاع على الموبايل
            backgroundImage: `url(${heroImage})`,
            backgroundSize: { xs: "cover", md: "cover" }, // تغطية كاملة
            backgroundPosition: { xs: "center top", md: "center" }, // تحكم أفضل على الموبايل
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            px: { xs: 3, md: 10 },
            color: "#fff",
            textAlign: "right",
          }}
        ></Box>
      </Box>

     <Box
  id="about"
  sx={{
    backgroundColor: "#deded6",
    py: { xs: 5, md: 10 },
  }}
>
  <Container
    maxWidth="lg"
    sx={{
      display: "flex",
      flexDirection: { xs: "column-reverse", md: "row" },
      alignItems: "center",
      justifyContent: "space-between",
      gap: 4,
    }}
  >
    {/* النصوص */}
    <Box sx={{ flex: 1, textAlign: { xs: "center", md: "right" } }}>
      <Typography
        component="h2"
        sx={{
          fontFamily: "Cairo",
          fontSize: "30px",
          fontWeight: 600,
          color: "#8a8a6a",
          letterSpacing: "2px",
          mb: 1,
          mt: { xs: -2, md: -4 },
          position: "relative",
          display: "inline-block",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-6px",
            right: 0,
            width: "40px",
            height: "3px",
            backgroundColor: "#545442",
            borderRadius: "2px",
          },
        }}
      >
        من نحن
      </Typography>

      <Typography
        variant="h3"
        sx={{ fontFamily: "Tajawal", fontWeight: "bold", color: "#545442" }}
      >
        مرحبًا بكم في دار المحبة والوئام للمسنين
      </Typography>

      <Typography
        variant="h6"
        sx={{ fontFamily: "Cairo", color: "#545442", mt: 2 }}
      >
        مؤسسة إنسانية تُعنى برعاية كبار السن وتوفير بيئة آمنة وداعمة تضمن
        لهم حياة كريمة يسودها الاحترام والمحبة. تقدم الدار خدمات إقامة
        ورعاية صحية ومتابعة يومية بإشراف طاقم مؤهل، مع الحرص على تلبية
        الاحتياجات الجسدية والنفسية للمسنين في أجواء أسرية مليئة بالاهتمام.
      </Typography>

      <Button
        variant="contained"
        sx={{
          mt: 3,
          backgroundColor: "#545442",
          color: "#fff",
          borderRadius: "20px",
          fontFamily: "Cairo",
          "&:hover": { backgroundColor: "#a5a590" },
        }}
      >
        تواصل معنا
      </Button>
    </Box>

    {/* الصورة */}
    <Box
      sx={{
        flex: 1,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MovingIcon
        sx={{
          position: "absolute",
          top: "30%",
          right: { md: "-35px" },
          transform: "translateY(-20%)",
          fontSize: 70,
          color: "#545442",
          display: { xs: "none", md: "block" },
        }}
      />

      <Box
        component="img"
        src={Image}
        alt="Hero"
        sx={{
          width: { xs: "280px", md: "380px" },
          height: { xs: "280px", md: "380px" },
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.3)",
          border: "5px solid none",
          transition: "transform 0.3s ease",
          "&:hover": { transform: "scale(1.05)" },
        }}
      />
    </Box>
  </Container>
    </Box>

    <Box
  id="services"
  sx={{
    py: { xs: 5, md: 10 },
    backgroundColor: "#f0f0ea",
  }}
>
  <Container maxWidth="lg">
    {/* عنوان السكشن */}
    <Typography
      component="h2"
      sx={{
        fontFamily: "Cairo",
        fontSize: "30px",
        fontWeight: 600,
        color: "#8a8a6a",
        letterSpacing: "2px",
        mb: 5,
        textAlign: "center",
        position: "relative",
        display: "inline-block",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60px",
          height: "3px",
          backgroundColor: "#545442",
          borderRadius: "2px",
        },
      }}
    >
      خدماتنا
    </Typography>

    {/* Grid للـ Cards */}
    <Grid container spacing={4} justifyContent="center">
      {services.map((service, index) => (
        <Grid  size={{ xs: 12, sm: 6, md: 4}} key={index}>
          <Card
            sx={{
              textAlign: "center",
              py: 5,
              px: 3,
              borderRadius: "20px",
              backgroundColor: "#6a6a57", // بني غامق
              color: "#fff", // نص أبيض
              boxShadow: "0px 8px 25px rgba(0,0,0,0.25)", // ظل لطيف
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-10px) scale(1.02)",
                boxShadow: "0px 15px 35px rgba(0,0,0,0.4)",
              },
            }}
          >
            <Box sx={{ mb: 3 }}>{service.icon}</Box>
            <Typography
              variant="h5"
              sx={{ fontFamily: "Tajawal", fontWeight: "bold", mb: 2 }}
            >
              {service.title}
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "Cairo" }}>
              {service.description}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
</Box>




    </>
  );
}
