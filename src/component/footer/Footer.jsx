import { Box, Container, IconButton, Typography } from "@mui/material";
import React from "react";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import style from "./Footer.module.css";

export default function Footer() {
  return (
    <>
      <Box component="footer" className={`${style.footer}`}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr 1fr" },
              gap: 5,
            }}
          >
            
            <Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
                sx={{ letterSpacing: 1 }}
              >
                دار المحبة والوئام
              </Typography>
              <Typography className={`${style.footerDescription}`}>
                نقدم الرعاية والاهتمام الكامل لكبار السن في بيئة إنسانية، آمنة
                ومريحة تشعرهم بالطمأنينة.
              </Typography>
            </Box>

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
                    className={`${style.footerLink}`}
                  >
                    <ChevronLeftIcon fontSize="small" />
                    {item.label}
                  </Box>
                ))}
              </Box>
            </Box>

            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                mb={2}
                sx={{ letterSpacing: 0.5 }}
              >
                تواصل معنا
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <PhoneIcon sx={{ opacity: 0.9 }} />
                <Typography>09-2330220</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnIcon sx={{ opacity: 0.9 }} />
                <Typography>نابلس – رفيديا – شارع المريج</Typography>
              </Box>
            </Box>
          </Box>

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
  );
}
