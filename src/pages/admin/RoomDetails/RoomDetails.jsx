import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Button,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AxiosUserInstance from "../../../api/AxiosUserInstance";


export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();


  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);


  // ===== Edit Images =====
  const [openEditImages, setOpenEditImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]); // File[]
  const [deletedPublicIds, setDeletedPublicIds] = useState([]); // string[]
  const [savingImages, setSavingImages] = useState(false);
  // ===== Preview Image =====
  const [openPreview, setOpenPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);


  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  // ===== Delete Room =====
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);


  const closeSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };


  const fetchRoom = async () => {
    setLoading(true);
    try {
      const res = await AxiosUserInstance.get(`/Admin/Room/${id}`);
      console.log(res);
      setRoom(res.data?.rooms || res.data?.room || res.data);
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "فشل جلب تفاصيل الغرفة",
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchRoom();
  }, [id]);


  // previews
  const previews = useMemo(() => {
    if (!selectedImages.length) return [];
    return selectedImages.map((file, idx) => ({
      key: `${file.name}-${file.size}-${idx}`,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    }));
  }, [selectedImages]);


  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [previews]);


  const handleUpdateImages = async () => {
    const hasNew = selectedImages.length > 0;
    const hasDeletes = deletedPublicIds.length > 0;


    if (!hasNew && !hasDeletes) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "ما في تغييرات للحفظ",
      });
      return;
    }


    setSavingImages(true);
    try {
      const formData = new FormData();


      // Files (optional)
      selectedImages.forEach((file) => formData.append("Images", file));


      // DeletedPublicIds (optional)
      deletedPublicIds.forEach((pid) =>
        formData.append("DeletedPublicIds", pid),
      );


      await AxiosUserInstance.patch(
        `/Admin/Room/Change-imageRoom/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );


      setSnackbar({
        open: true,
        severity: "success",
        message: "تم تحديث الصور بنجاح",
      });


      setOpenEditImages(false);
      setSelectedImages([]);
      setDeletedPublicIds([]);
      await fetchRoom();
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "فشل تحديث الصور",
      });
    } finally {
      setSavingImages(false);
    }
  };


  const handleDeleteRoom = async () => {
    if (!id) return;


    setDeleting(true);
    try {
      await AxiosUserInstance.delete(`/Admin/Room/${id}`);


      setSnackbar({
        open: true,
        severity: "success",
        message: "تم حذف الغرفة بنجاح",
      });


      setOpenDelete(false);
      navigate("/Admin/rooms");
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "فشل حذف الغرفة",
      });
    } finally {
      setDeleting(false);
    }
  };


  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );


  if (!room) return null;


  // room.images: [{url, publicId}]
  const heroImage =
    room?.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2";


  return (
    <Box sx={{ p: 2.5 }}>
      {/* ================= HERO ================= */}
      <Grid container spacing={2.5}>
        {/* ===== Image ===== */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              height: 360,
              borderRadius: 6,
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
            }}
          >
            <Box
              component="img"
              src={heroImage}
              alt="room-hero"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
              }}
            />


            {/* Overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,.7), transparent)",
                display: "flex",
                alignItems: "flex-end",
                p: 3,
              }}
            >
              <Typography
                sx={{ color: "#fff", fontSize: 26, fontWeight: 1000 }}
              >
                الغرفة رقم {room.roomNumber}
              </Typography>
            </Box>
          </Box>
        </Grid>


        {/* ===== Info Panel ===== */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              height: "100%",
              p: 4,
              borderRadius: 6,
              background: "linear-gradient(145deg,#ffffff,#f2f2e9)",
              boxShadow: "0 18px 45px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 1000, fontSize: 22, mb: 2 }}>
                معلومات الغرفة
              </Typography>


              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  fontSize: 16,
                }}
              >
                <Typography>
                  النوع: <strong>{room.roomTypeName}</strong>
                </Typography>
                <Typography>
                  السعة الكلية: <strong>{room.capacity}</strong>
                </Typography>
                <Typography>
                  السعر: <strong>{room.price}</strong>
                </Typography>


                <Typography
                  component="div"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  الحالة:
                  <Chip
                    label={room.statusName}
                    color="success"
                    size="small"
                    sx={{ fontWeight: 900 }}
                  />
                </Typography>
              </Box>
            </Box>


            <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setOpenDelete(true)}
                sx={{
                  borderRadius: 3,
                  "& .MuiButton-startIcon": { marginLeft: 0 },
                }}
              >
                حذف الغرفة
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>


      {/* ================= STATS BAR ================= */}
      <Paper
        sx={{
          mt: 2.5,
          p: 2,
          borderRadius: 6,
          display: "flex",
          justifyContent: "space-around",
          background: "linear-gradient(90deg,#6a6a57,#8b8b6f)",
          color: "#fff",
          boxShadow: "0 12px 35px rgba(0,0,0,0.25)",
        }}
      >
        <Box textAlign="center">
          <Typography fontWeight={1000}>السعة</Typography>
          <Typography>{room.capacity}</Typography>
        </Box>


        <Box textAlign="center">
          <Typography fontWeight={1000}>السعة الحالية</Typography>
          <Typography>{room.currentCapacity}</Typography>
        </Box>


        <Box textAlign="center">
          <Typography fontWeight={1000}>السعر</Typography>
          <Typography>{room.price}</Typography>
        </Box>
      </Paper>


      {/* ================= DESCRIPTION ================= */}
      <Paper
        sx={{
          mt: 2.5,
          p: 2.5,
          borderRadius: 6,
          background: "#fff",
        }}
      >
        <Typography fontWeight={1000}>الوصف</Typography>
        <Typography sx={{ mt: 1 }}>
          {room.description || "لا يوجد وصف"}
        </Typography>
      </Paper>
    {Array.isArray(room.currentElderlies) && room.currentElderlies.length > 0 && (
  <Paper
    sx={{
      mt: 2.5,
      p: 3,
      borderRadius: 6,
      background: "#fff",
      boxShadow: "0 8px 25px rgba(0,0,0,.05)",
    }}
  >
    {/* Header */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Typography sx={{ fontWeight: 1000, fontSize: 18 }}>
        المسنين المقيمين حالياً
      </Typography>
    </Box>


    {/* List */}
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
      {room.currentElderlies.map((e) => (
        <Box
          key={e.id}
          sx={{
            p: 1.6,
            borderRadius: 4,
            border: "1px solid rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            transition: "0.2s",
            background: "linear-gradient(145deg,#ffffff,#fafaf7)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
              borderColor: "rgba(106,106,87,0.35)",
            },
          }}
        >
          {/* Left: Avatar + Name */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.4, minWidth: 0 }}>
           
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 1000,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {e.name}
              </Typography>
            </Box>
          </Box>


          {/* Right: Action */}
          <Button
            variant="outlined"
            onClick={() => navigate(`/Admin/Elderly/${e.id}`)}
            sx={{
              color: "#6a6a57",
              borderRadius: 999,
              borderColor: "#6a6a57",
              fontWeight: 900,
              textTransform: "none",
              px: 2,
              whiteSpace: "nowrap",
              "&:hover": {
                borderColor: "#4b4b3f",
                backgroundColor: "rgba(106,106,87,0.08)",
              },
            }}
          >
            تفاصيل المسن
          </Button>
        </Box>
      ))}
    </Box>
  </Paper>
)}
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          background: "#fff",
          boxShadow: "0 8px 25px rgba(0,0,0,.05)",
          mt: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography sx={{ fontWeight: 1000 }}>الصور</Typography>


          <Button
            size="medium"
            variant="outlined"
            onClick={() => setOpenEditImages(true)}
            sx={{
              color: "#6a6a57",
              borderRadius: 3,
              borderColor: "#6a6a57",
              "&:hover": {
                borderColor: "#4b4b3f",
                backgroundColor: "rgba(106,106,87,0.08)",
              },
            }}
          >
            تعديل الصور
          </Button>
        </Box>


        {Array.isArray(room.images) && room.images.length > 0 ? (
          <Grid container spacing={2}>
            {room.images.map((img, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={img.publicId || index}>
                <Box
                  component="img"
                  src={img.url}
                  alt="room"
                  onClick={() => {
                    setPreviewImage(img.url);
                    setOpenPreview(true);
                  }}
                  sx={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderRadius: 3,
                    transition: ".2s",
                    cursor: "pointer",
                    "&:hover": { transform: "scale(1.03)" },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              border: "1px dashed #ccc",
              borderRadius: 3,
              background: "#FAFAFA",
            }}
          >
            لا توجد صور حالياً
          </Box>
        )}
      </Paper>


      {/* ================= Dialog: Edit Images ================= */}
      <Dialog
        open={openEditImages}
        onClose={() => setOpenEditImages(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ fontWeight: 900 }}>تعديل صور الغرفة</DialogTitle>


        <DialogContent sx={{ pt: 2 }}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{
              py: 1.2,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 900,
            }}
          >
            اختر صور جديدة (يمكن اختيار أكثر من صورة)
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                const newFiles = Array.from(e.target.files || []);
                setSelectedImages((prev) => {
                  const merged = [...prev, ...newFiles];
                  return merged.filter(
                    (file, idx, arr) =>
                      idx ===
                      arr.findIndex(
                        (f) => f.name === file.name && f.size === file.size,
                      ),
                  );
                });
                e.target.value = "";
              }}
            />
          </Button>


          {previews.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontWeight: 900, mb: 1 }}>
                الصور المختارة:
              </Typography>


              <Grid container spacing={2}>
                {previews.map((p) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={p.key}>
                    <Box
                      sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        border: "1px solid rgba(0,0,0,0.12)",
                        background: "#fff",
                      }}
                    >
                      <Box
                        component="img"
                        src={p.url}
                        alt={p.name}
                        sx={{ width: "100%", height: 120, objectFit: "cover" }}
                      />
                      <Box
                        sx={{
                          p: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 900,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                          }}
                          title={p.name}
                        >
                          {p.name}
                        </Typography>


                        <Button
                          size="small"
                          color="error"
                          onClick={() =>
                            setSelectedImages((prev) =>
                              prev.filter(
                                (f) =>
                                  !(f.name === p.name && f.size === p.size),
                              ),
                            )
                          }
                          sx={{
                            fontWeight: 900,
                            textTransform: "none",
                            minWidth: "auto",
                            px: 1,
                          }}
                        >
                          إزالة
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}


          <Divider sx={{ my: 2 }} />


          <Typography sx={{ fontWeight: 900, mb: 1 }}>
            الصور الحالية:
          </Typography>
          {Array.isArray(room.images) && room.images.length > 0 ? (
            <Grid container spacing={2}>
              {room.images.map((img, idx) => {
                const marked = deletedPublicIds.includes(img.publicId);
                return (
                  <Grid
                    size={{ xs: 12, sm: 6, md: 3 }}
                    key={img.publicId || idx}
                  >
                    <Box
                      sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        border: "1px solid rgba(0,0,0,0.12)",
                        position: "relative",
                        background: "#fff",
                        opacity: marked ? 0.55 : 1,
                        filter: marked ? "grayscale(1)" : "none",
                      }}
                    >
                      <Box
                        component="img"
                        src={img.url}
                        alt={`current-${idx}`}
                        sx={{
                          width: "100%",
                          height: 120,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />


                      <Button
                        size="small"
                        variant="contained"
                        color={marked ? "inherit" : "error"}
                        onClick={() =>
                          setDeletedPublicIds((prev) =>
                            prev.includes(img.publicId)
                              ? prev.filter((x) => x !== img.publicId)
                              : [...prev, img.publicId],
                          )
                        }
                        sx={{
                          position: "absolute",
                          bottom: 8,
                          left: 8,
                          borderRadius: 2,
                          fontWeight: 900,
                          textTransform: "none",
                          px: 1.2,
                          minHeight: 30,
                        }}
                      >
                        {marked ? "إلغاء الحذف" : "حذف"}
                      </Button>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Typography sx={{ fontWeight: 800, color: "#777" }}>
              لا يوجد صور حالياً.
            </Typography>
          )}
        </DialogContent>


        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setOpenEditImages(false)}
            sx={{
              borderRadius: 999,
              fontWeight: 900,
              textTransform: "none",
            }}
          >
            إلغاء
          </Button>


          <Button
            variant="contained"
            onClick={handleUpdateImages}
            disabled={
              savingImages ||
              (selectedImages.length === 0 && deletedPublicIds.length === 0)
            }
            sx={{
              borderRadius: 999,
              fontWeight: 900,
              textTransform: "none",
            }}
          >
            {savingImages ? "جارٍ الحفظ..." : "حفظ"}
          </Button>
        </DialogActions>
      </Dialog>


      {/* ================= Image Preview Dialog ================= */}
      <Dialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#000",
            borderRadius: 4,
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "80vh", // 👈 ارتفاع ثابت
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={previewImage}
            alt="preview"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain", // يحافظ على الصورة كاملة
            }}
          />
        </Box>
      </Dialog>
      {/* ================= Delete Confirm Dialog ================= */}
      <Dialog
        open={openDelete}
        onClose={() => !deleting && setOpenDelete(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 900 }}>تأكيد الحذف</DialogTitle>


        <DialogContent sx={{ pt: 1 }}>
          <Typography sx={{ fontWeight: 700 }}>
            هل أنت متأكد أنك تريد حذف الغرفة رقم{" "}
            <strong>{room?.roomNumber}</strong>؟
          </Typography>
          <Typography sx={{ mt: 1, color: "#777", fontSize: 13 }}>
            لا يمكن التراجع عن هذه العملية.
          </Typography>
        </DialogContent>


        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setOpenDelete(false)}
            color="inherit"
            disabled={deleting}
            sx={{ borderRadius: 999, fontWeight: 900, textTransform: "none" }}
          >
            إلغاء
          </Button>


          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteRoom}
            disabled={deleting}
            sx={{ borderRadius: 999, fontWeight: 900, textTransform: "none" }}
          >
            {deleting ? "جارٍ الحذف..." : "تأكيد الحذف"}
          </Button>
        </DialogActions>
      </Dialog>


      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%", fontWeight: 900 }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}



