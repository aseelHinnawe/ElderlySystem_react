import { Box, Container, IconButton, Typography } from '@mui/material'
import React from 'react'
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";


export default function Footer() {
  return (
   <> 
  <Box
  component="footer"
  sx={{
    py: 6,
    background: "linear-gradient(135deg, #6a6a57, #4f4f40)",
    color: "#fff",
  }}
>
  <Container maxWidth="lg">
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr 1fr" },
        gap: 5,
      }}
    >
      {/* اسم الدار */}
      <Box>
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
          sx={{ letterSpacing: 1 }}
        >
          دار المحبة والوئام
        </Typography>
        <Typography sx={{ maxWidth: 300, opacity: 0.9, lineHeight: 1.7 }}>
          نقدم الرعاية والاهتمام الكامل لكبار السن في بيئة إنسانية، آمنة
          ومريحة تشعرهم بالطمأنينة.
        </Typography>
      </Box>

      {/* روابط سريعة */}
    <Box>
        <Typography
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          روابط سريعة
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
          {[
            { label: "الرئيسية", link: "#home" },
            { label: "من نحن", link: "#about" },
            { label: "خدماتنا", link: "#services" },
            { label: "تواصل معنا", link: "#contact" },
          ].map((item) => (
            <Box
              key={item.label}
              component="a"
              href={item.link}
              sx={{
                color: "#fff",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 1,
                opacity: 0.9,
                transition: "0.3s",
                "&:hover": {
                  opacity: 1,
                  transform: "translateX(-4px)",
                },
              }}
            >
              <ChevronLeftIcon fontSize="small" />
              {item.label}
            </Box>
          ))}
        </Box>
      </Box>

      {/* معلومات التواصل */}
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          mb={2}
          sx={{ letterSpacing: 0.5 }}
        >
          تواصل معنا
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <PhoneIcon sx={{ opacity: 0.9 }} />
          <Typography>09-2330220</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocationOnIcon sx={{ opacity: 0.9 }} />
          <Typography>
            نابلس – رفيديا – شارع المريج
          </Typography>
        </Box>
      </Box>
    </Box>

    {/* خط فاصل */}
    <Box
      sx={{
        mt: 6,
        borderTop: "1px solid rgba(255,255,255,0.25)",
        pt: 3,
        textAlign: "center",
      }}
    >
      <Typography sx={{ fontSize: 14, opacity: 0.8 }}>
        © 2026 دار المحبة والوئام — صُنع بمحبة
        <FavoriteIcon sx={{ fontSize: 16, mx: 0.5, color: "#ffb4b4" }} />
      </Typography>
    </Box>
  </Container>
</Box>



   </>
  )
}
