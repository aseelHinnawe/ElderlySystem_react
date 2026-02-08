import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import mainImg from "../../assets/mainImg.jpg";
import aboutImg from "../../assets/aboutImg.jpg";
import contactImg from "../../assets/contactImg.jpg";
import MovingIcon from "@mui/icons-material/Moving";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import AccessibleOutlinedIcon from "@mui/icons-material/AccessibleOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ElderlyWomanIcon from "@mui/icons-material/ElderlyWoman";
import LocalHotelIcon from "@mui/icons-material/LocalHotel";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import MedicationIcon from "@mui/icons-material/Medication";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import style from "./Home.module.css";
const heroSectionStyle = {
  height: { xs: "50vh", md: "80vh" },
  backgroundImage: `url(${mainImg})`,
  backgroundSize: { xs: "cover", md: "cover" },
  backgroundPosition: { xs: "center top", md: "center" },
  px: { xs: 3, md: 10 },
};
const featureItemSx = (index) => ({
  display: { xs: index > 2 ? "none" : "flex", md: "flex" },

  "&::after": {
    content: '""',
    position: "absolute",
    right: -50,
    top: "10%",
    height: "100%",
    width: "1px",
    backgroundColor: "rgba(84, 84, 66, 0.3)",
    display: {
      xs: index === 0 ? "none" : "block",
      md: index === 0 ? "none" : "block",
    },
  },
});
const baseTitleStyle = {
  fontSize: "30px",
  fontWeight: 600,
  color: "#8a8a6a",
  letterSpacing: "2px",
  position: "relative",
  display: "inline-block",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-6px",
    height: "3px",
    backgroundColor: "#545442",
    borderRadius: "2px",
  },
};
const aboutButtonStyle = {
  mt: 4,
  backgroundColor: "#6a6a57",
  color: "#fff",
  borderRadius: "20px",
  fontFamily: "Cairo",
  "&:hover": { backgroundColor: "#a5a590" },
};
const movingIconStyle = {
  position: "absolute",
  top: "30%",
  right: { md: "-35px" },
  transform: "translateY(-20%)",
  fontSize: 70,
  color: "#545442",
  display: { xs: "none", md: "block" },
};
const serviceCardStyle = {
  textAlign: "center",
  py: 5,
  px: 3,
  borderRadius: "20px",
  backgroundColor: "#6a6a57",
  color: "#fff",
  boxShadow: "0px 8px 25px rgba(0,0,0,0.25)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-10px) scale(1.02)",
    boxShadow: "0px 15px 35px rgba(0,0,0,0.4)",
  },
};
const contactFormBoxStyle = {
  backgroundImage: `url('${contactImg}')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(255, 255, 255, 0.79)",
    borderRadius: 4,
    zIndex: 0,
  },
  "& > *": {
    position: "relative",
    zIndex: 1,
  },
};
const contactInputStyle = {
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#333",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "20px",
  },
};
const contactButtonStyle = {
  mt: "auto",
  background: "linear-gradient(135deg, #6a6a57, #8a8a6a)",
  textTransform: "none",
  fontSize: 16,
  py: 1.2,
  borderRadius: 5,
  "&:hover": {
    background: "linear-gradient(135deg, #7a7a65, #9a9a82)",
  },
};

const services = [
  {
    title: "الرعاية الصحية اليومية",
    icon: <LocalHospitalOutlinedIcon sx={{ fontSize: 50, color: "#f0f0ea" }} />,
    description:
      "متابعة طبية منتظمة، إشراف تمريضي على مدار الساعة، والالتزام بالأدوية والخطط العلاجية.",
  },
  {
    title: "التغذية الصحية المتوازنة",
    icon: (
      <RestaurantMenuOutlinedIcon sx={{ fontSize: 50, color: "#f0f0ea" }} />
    ),
    description:
      "وجبات يومية مدروسة بعناية، تناسب احتياجات كبار السن الصحية وتُحضّر بأجواء منزلية.",
  },
  {
    title: "الإقامة المريحة والآمنة",
    icon: <AccessibleOutlinedIcon sx={{ fontSize: 50, color: "#f0f0ea" }} />,
    description:
      "غرف نظيفة ومريحة، مجهزة بكل ما يلزم لضمان الراحة والخصوصية والأمان.",
  },
  {
    title: "الدعم النفسي والاجتماعي",
    icon: <PsychologyOutlinedIcon sx={{ fontSize: 50, color: "#f0f0ea" }} />,
    description:
      "جلسات ترفيهية، أنشطة جماعية، ودعم نفسي يخفف الشعور بالوحدة ويعزز الروح الإيجابية.",
  },
  {
    title: "المرافقة والاهتمام الشخصي",
    icon: (
      <FavoriteBorderOutlinedIcon sx={{ fontSize: 50, color: "#f0f0ea" }} />
    ),
    description:
      "مرافقة دائمة في التنقل، المساعدة في الأنشطة اليومية، والاهتمام بكل التفاصيل الصغيرة.",
  },
  {
    title: "أنشطة ترفيهية وتنشيطية",
    icon: <AccessibilityNewIcon sx={{ fontSize: 50, color: "#f0f0ea" }} />,
    description:
      "أنشطة فنية، حركية، وثقافية تُساعد على تنشيط الذاكرة وتحسين جودة الحياة.",
  },
];
const features = [
  {
    icon: <ElderlyWomanIcon sx={{ fontSize: 50, color: "#6a6a57" }} />,
    text: "رعاية صحية 24/7",
  },
  {
    icon: <MedicationIcon sx={{ fontSize: 50, color: "#6a6a57" }} />,
    text: "بيئة آمنة ومريحة",
  },
  {
    icon: <MapsHomeWorkIcon sx={{ fontSize: 50, color: "#6a6a57" }} />,
    text: "دعم نفسي واجتماعي",
  },
  {
    icon: <VolunteerActivismIcon sx={{ fontSize: 50, color: "#6a6a57" }} />,
    text: "تغذية صحية متوازنة",
  },
  {
    icon: <LocalHotelIcon sx={{ fontSize: 50, color: "#6a6a57" }} />,
    text: "اهتمام شخصي ومرافقة",
  },
];

export default function Home() {
  return (
    <>
      <Box id="home">
        <Box sx={heroSectionStyle}></Box>
      </Box>


      <Box sx={{ py: 5, backgroundColor: "#f0f0ea" }}>
  <Container maxWidth="lg">
    <Box className={style.featuresWrapper}>
      {features.map((feature, index) => (
        <Box
          key={index}
          sx={featureItemSx(index)}
          className={style.featureItem}
        >
          {feature.icon}
        </Box>
      ))}
    </Box>
  </Container>
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
            flexDirection: { xs: "column-reverse", md: "row" },
          }}
          className={`${style.container}`}
        >
          {/* النصوص */}
          <Box sx={{ flex: 1, textAlign: { xs: "center", md: "right" } }}>
            <Typography
              component="h2"
              sx={{
                ...baseTitleStyle,
                fontFamily: "Cairo",
                mb: 1,
                mt: { xs: -2, md: -4 },
                "&::after": {
                  ...baseTitleStyle["&::after"],
                  right: 0,
                  width: "40px",
                },
              }}
            >
              {" "}
              من نحن{" "}
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontFamily: "Tajawal",
                fontWeight: "bold",
                color: "#545442",
              }}
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
              الاحتياجات الجسدية والنفسية للمسنين في أجواء أسرية مليئة
              بالاهتمام.
            </Typography>

            <Button variant="contained" sx={aboutButtonStyle} href="#contact">
              تواصل معنا
            </Button>
          </Box>

          <Box className={`${style.imageWrapper}`}>
            <MovingIcon sx={movingIconStyle} />
            <Box
              component="img"
              src={aboutImg}
              alt="Hero"
              sx={{
                width: { xs: "280px", md: "380px" },
                height: { xs: "280px", md: "380px" },
                "&:hover": { transform: "scale(1.05)" },
              }}
              className={`${style.image}`}
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
          <Typography
            component="h2"
            sx={{
              ...baseTitleStyle,
              mb: 5,
              textAlign: "center",
              "&::after": {
                ...baseTitleStyle["&::after"],
                left: "50%",
                transform: "translateX(-50%)",
                width: "60px",
              },
            }}
          >
            خدماتنا
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {services.map((service, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={serviceCardStyle}>
                  <Box
                    sx={{
                      background: [
                        "linear-gradient(135deg, #c1c190, #838356)",
                        "linear-gradient(135deg, #a5c67a, #8aa96c)",
                        "linear-gradient(135deg, #f4a261, #e76f51)",
                        "linear-gradient(135deg, #2a9d8f, #264653)",
                        "linear-gradient(135deg, #e9c46a, #eab655)",
                        "linear-gradient(135deg, #f28ab2, #d95d39)",
                      ][index % 6],
                      margin: "0 auto",
                    }}
                    className={`${style.iconCircle}`}
                  >
                    {service.icon}
                  </Box>

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
              alignItems: "stretch",
            }}
          >
            {/* الفورم */}
            <Box className={`${style.contactFormWrapper}`}>
              <Typography
                component="h2"
                sx={{
                  ...baseTitleStyle,
                  fontFamily: "Cairo",
                  mb: 3.5,
                  textAlign: "center",
                  "&::after": {
                    ...baseTitleStyle["&::after"],
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "60px",
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
                sx={contactFormBoxStyle}
                className={`${style.contactForm}`}
              >
                <TextField
                  label="الاسم"
                  id="name"
                  name="name"
                  fullWidth
                  sx={contactInputStyle}
                />
                <TextField
                  label="البريد الإلكتروني"
                  id="email"
                  name="email"
                  fullWidth
                  sx={contactInputStyle}
                />
                <TextField
                  label="الموضوع"
                  id="subject"
                  name="subject"
                  fullWidth
                  sx={contactInputStyle}
                />
                <TextField
                  label="الرسالة"
                  id="message"
                  name="message"
                  multiline
                  rows={4}
                  fullWidth
                  sx={contactInputStyle}
                />

                <Button variant="contained" sx={contactButtonStyle}>
                  إرسال
                </Button>
              </Box>
            </Box>

            <Box className={`${style.contactInfo}`}>
              <Typography variant="h5" fontWeight="bold">
                معلومات التواصل
              </Typography>

              <Card
                sx={{
                  borderRadius: 5,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <PhoneIcon sx={{ fontSize: 42, color: "#6a6a57" }} />
                  <Typography fontWeight="bold" mt={1}>
                    رقم الهاتف
                  </Typography>
                  <Typography color="text.secondary">09-2330220</Typography>
                </CardContent>
              </Card>

              <Card
                sx={{
                  borderRadius: 5,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <LocationOnIcon sx={{ fontSize: 42, color: "#6a6a57" }} />
                  <Typography fontWeight="bold" mt={1}>
                    موقعنا
                  </Typography>
                  <Typography color="text.secondary">
                    فلسطين – نابلس -رفيديا - شارع المريج
                  </Typography>
                </CardContent>
              </Card>

              <Card
                sx={{
                  borderRadius: 5,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  background: "linear-gradient(135deg, #6a6a57, #8a8a6a)",
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
          <Box className={`${style.mapBox}`}>
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
