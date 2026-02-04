import { Box, Button, Card, CardContent, Container, Grid, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import mainImg from "../../assets/mainImg.jpg";
import aboutImg from "../../assets/aboutImg.jpg";
import contactImg from "../../assets/contactImg.jpg";
import MovingIcon from "@mui/icons-material/Moving";

import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import AccessibleOutlinedIcon from "@mui/icons-material/AccessibleOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";



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
            backgroundImage: `url(${mainImg})`,
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
          mt: 4,
          backgroundColor: "#6a6a57",
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
        src={aboutImg}
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

  <Box
      id="contact"
      sx={{
        py: 10,
        backgroundColor: "#deded6",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 6,
            alignItems: "stretch", // نفس الطول
          }}
        >
          {/* الفورم */}
          <Box
            sx={{
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 4,
    p: 3, // قللت الـ padding شوي من 4 → 3
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
  }}
          >
            <Typography
              component="h2"
              sx={{
                fontFamily: "Cairo",
                fontSize: "30px",
                fontWeight: 600,
                color: "#8a8a6a",
                letterSpacing: "2px",
                mb: 3.5,
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
              تواصل معنا
            </Typography>

            <Typography color="text.secondary" mb={3}>
              نحن هنا للإجابة عن جميع استفساراتكم
            </Typography>

            <Box
            component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            flexGrow: 1,
            backgroundImage: `url('${contactImg}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderRadius: 4,
            p: 1.5,
            position: "relative",

            // ⭐ الطبقة الشفافة
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(255, 255, 255, 0.79)", // غيري النسبة حسب اللي بناسبك
              borderRadius: 4,
              zIndex: 0,
            },

            "& > *": {
              position: "relative",
              zIndex: 1,
            },
          }}
            >
              <TextField label="الاسم" fullWidth sx={{
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#333", // أسود غامق
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "20px", // كل ما زادت القيمة صارت أكثر دائرة
    },
  }}/>
              <TextField label="البريد الإلكتروني" fullWidth sx={{
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#333", // أسود غامق 
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "20px", // كل ما زادت القيمة صارت أكثر دائرة
    },

  }}/>
              <TextField label="الموضوع" fullWidth sx={{
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#333", // أسود غامق
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "20px", // كل ما زادت القيمة صارت أكثر دائرة
    },
  }}/>
              <TextField label="الرسالة" multiline rows={4} fullWidth sx={{
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#333", // أسود غامق
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "20px", // كل ما زادت القيمة صارت أكثر دائرة
    },
  }}/>

              <Button
                variant="contained"
                sx={{
                  mt: "auto", // ⭐ الزر لتحت
                  background:
                    "linear-gradient(135deg, #6a6a57, #8a8a6a)",
                  textTransform: "none",
                  fontSize: 16,
                  py: 1.2,
                  borderRadius: 5,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #7a7a65, #9a9a82)",
                  },
                }}
              >
                إرسال
              </Button>
            </Box>
          </Box>

          {/* معلومات التواصل */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              معلومات التواصل
            </Typography>

            <Card sx={{ borderRadius: 5, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <PhoneIcon sx={{ fontSize: 42, color: "#6a6a57" }} />
                <Typography fontWeight="bold" mt={1}>
                  رقم الهاتف
                </Typography>
                <Typography color="text.secondary">
                  09-2330220
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 5, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <LocationOnIcon sx={{ fontSize: 42, color: "#6a6a57" }} />
                <Typography fontWeight="bold" mt={1}>
                  موقعنا
                </Typography>
                <Typography color="text.secondary">
                 فلسطين –  نابلس -رفيديا - شارع المريج
                </Typography>
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: 5,
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                background:
                  "linear-gradient(135deg, #6a6a57, #8a8a6a)",
                color: "#fff",
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <AccessTimeIcon sx={{ fontSize: 48, mb: 1 }} />
                <Typography sx={{ fontSize: 20, fontWeight: 600, mb: 1 }}>
                  نحن هنا لخدمتكم
                </Typography>
                <Typography sx={{ opacity: 0.9 }}>
                  متواجدون على مدار الأسبوع
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
        <Box
  sx={{
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    mt: 5,
  }}
>
  <iframe
    title="موقع دار المحبة والوئام"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3375.1660390466554!2d35.25004052456395!3d32.226695473898495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ce1ad3d017fe5%3A0x27bf8f4fae5a0a7d!2z2K_Yp9ixINin2YTZhdit2KjYqSDZiCDYp9mE2YjYptin2YUg2YTZhNmF2LPZhtmK2YY!5e0!3m2!1sar!2s!4v1770230431124!5m2!1sar!2s"
    width="100%"
    height="280"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  />
</Box>
      </Container>
    </Box>
    </>
  );
}
