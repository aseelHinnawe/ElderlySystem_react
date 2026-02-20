import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";


import AxiosUserInstance from "../../../api/AxiosUserInstance";
import { useNavigate, useParams } from "react-router-dom";


import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";


// ================== Styles ==================
const headerCardStyles = {
  mb: 3,
  borderRadius: 5,
  background: "linear-gradient(135deg,rgb(106,106,87),rgb(160,160,120))",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};


const pageWrapperSx = {
  p: { xs: 2, md: 4 },
  minHeight: "100vh",
  background: "#f9f9f4",
};


const paperStyle = {
  p: { xs: 2.2, sm: 3.2, md: 4 },
  width: "100%",
  borderRadius: "22px",
  border: "1px solid rgba(106, 106, 87, 0.15)",
  boxShadow: "0 10px 34px rgba(0,0,0,0.12)",
  background: "#f9f9f4",
};


const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "rgba(255,255,255,0.75)",
  },
};


const toolBtnBase = {
  borderRadius: 3,
  textTransform: "none",
  fontWeight: 900,
  px: { xs: 1.5, sm: 2 },
  py: { xs: 0.8, sm: 1.1 },
  fontSize: { xs: 12, sm: 13, md: 13 },
};


const editBtnSx = {
  ...toolBtnBase,
  background:
    "linear-gradient(135deg, rgba(255,248,225,1), rgba(255,236,179,1))",
  color: "#7A5B4E",
  border: "1px solid rgba(141,110,99,0.25)",
  boxShadow: "0 8px 18px rgba(141,110,99,0.15)",
  "&:hover": {
    filter: "brightness(0.98)",
    boxShadow: "0 10px 22px rgba(141,110,99,0.2)",
  },
  "& .MuiButton-startIcon": { ml: 1.0, mr: 0.2 },
};


const deleteBtnSx = {
  ...toolBtnBase,
  background:
    "linear-gradient(135deg, rgba(255,235,238,1), rgba(255,205,210,1))",
  color: "#B71C1C",
  border: "1px solid rgba(198,40,40,0.25)",
  boxShadow: "0 8px 18px rgba(198,40,40,0.12)",
  "&:hover": {
    filter: "brightness(0.98)",
    boxShadow: "0 10px 22px rgba(198,40,40,0.18)",
  },
  "& .MuiButton-startIcon": { ml: 1.0, mr: 0.2 },
};


const statCardSx = {
  borderRadius: 4,
  border: "1px solid rgba(106,106,87,0.16)",
  background: "rgba(255,255,255,0.72)",
  boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
  overflow: "hidden",
};


const statInnerSx = {
  p: 2.2,
  display: "flex",
  alignItems: "center",
  gap: 1.6,
};


const statLabelSx = {
  fontWeight: 900,
  color: "#6a6a57",
  fontSize: 14,
};


const statValueSx = {
  fontWeight: 600,
  color: "#2f2f27",
  fontSize: { xs: 17, md: 19 },
  mt: 0.4,
};


const statIconWrapSx = {
  width: 52,
  height: 52,
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(106,106,87,0.12)",
  border: "1px solid rgba(106,106,87,0.18)",
};


const sectionTitleSx = {
  fontWeight: 900,
  color: "#6a6a57",
  mt: 3,
  mb: 1.2,
  display: "flex",
  alignItems: "center",
  gap: 1,
};


const goodsTableShellSx = {
  borderRadius: 4,
  overflow: "hidden",
  border: "1px solid rgba(0,0,0,0.06)",
  background: "rgba(255,255,255,0.72)",
  boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
};


const fieldLabelSx = { fontWeight: 900, color: "#6a6a57" };


const formatMoney = (amount) => {
  if (amount === null || amount === undefined || amount === "") return "-";
  const num = Number(amount);
  if (Number.isNaN(num)) return String(amount);
  return new Intl.NumberFormat("ar", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};


export default function DonationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();


  const theme = useTheme();
  const isSmallOrMediumScreen = useMediaQuery(theme.breakpoints.down("md")); // <960
  const isBetween900And1100 = useMediaQuery(
    "(min-width:900px) and (max-width:1100px)",
  );


  const [loading, setLoading] = useState(true);
  const [donation, setDonation] = useState(null);


  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });


  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);


  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);


  const [editForm, setEditForm] = useState({
    monetaryAmount: "",
    currency: "",
    goodId: "",
    nameGood: "",
    quantity: "",
  });


  const isCash = useMemo(
    () => String(donation?.donationType || "").includes("نقد"),
    [donation],
  );


  const goods = useMemo(() => donation?.goods || [], [donation]);


  const showSnack = (severity, message) =>
    setSnackbar({ open: true, severity, message });


  const closeSnack = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };


  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await AxiosUserInstance.get(`/Admin/Donation/${id}`);
      const data = res.data?.data || null;
      setDonation(data);


      const cash = String(data?.donationType || "").includes("نقد");
      if (cash) {
        setEditForm({
          monetaryAmount: data?.monetaryAmount ?? "",
          currency: data?.currency ?? "",
          goodId: "",
          nameGood: "",
          quantity: "",
        });
      } else {
        const first =
          Array.isArray(data?.goods) && data.goods.length
            ? data.goods[0]
            : null;
        setEditForm({
          monetaryAmount: "",
          currency: "",
          goodId: first?.id ?? "",
          nameGood: first?.nameGood ?? "",
          quantity: first?.quantity ?? "",
        });
      }
    } catch (e) {
      showSnack("error", "فشل جلب تفاصيل التبرع");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);


  // ===== Delete =====
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await AxiosUserInstance.delete(`/Admin/Donation/${id}`);
      showSnack("success", "تم حذف التبرع بنجاح");
      setTimeout(() => navigate("/Admin/Donations"), 400);
    } catch (e) {
      showSnack("error", e?.response?.data?.message || "فشل حذف التبرع");
    } finally {
      setDeleting(false);
      setOpenDelete(false);
    }
  };


  // ===== Build payload for PUT =====
  const buildUpdatePayload = () => {
    const payload = {};


    if (isCash) {
      const amtStr = String(editForm.monetaryAmount ?? "").trim();
      const curStr = String(editForm.currency ?? "").trim();


      if (amtStr !== "") {
        const amt = Number(amtStr);
        if (!Number.isNaN(amt)) payload.monetaryAmount = amt;
      }
      if (curStr !== "") payload.currency = curStr;
      return payload;
    }


    // InKind
    const gidStr = String(editForm.goodId ?? "").trim();
    if (gidStr) {
      const gid = Number(gidStr);
      if (!Number.isNaN(gid)) payload.goodId = gid;
    }


    const name = String(editForm.nameGood ?? "").trim();
    if (name !== "") payload.nameGood = name;


    const qtyStr = String(editForm.quantity ?? "").trim();
    if (qtyStr !== "") {
      const qty = Number(qtyStr);
      if (!Number.isNaN(qty)) payload.quantity = qty;
    }


    return payload;
  };


  // ===== Update (PUT) =====
  const handleUpdate = async () => {
    const payload = buildUpdatePayload();


    if (!payload || Object.keys(payload).length === 0) {
      showSnack("error", "يرجى إدخال قيمة واحدة على الأقل للتعديل");
      return;
    }


    if (!isCash && !payload.goodId) {
      showSnack("error", "يرجى اختيار صنف (goodId) للتعديل");
      return;
    }


    setSaving(true);
    try {
      await AxiosUserInstance.put(`/Admin/Donation/${id}`, payload);
      showSnack("success", "تم تعديل التبرع بنجاح");
      setOpenEdit(false);
      await fetchDetails();
    } catch (e) {
      showSnack("error", e?.response?.data?.message || "فشل تعديل التبرع");
    } finally {
      setSaving(false);
    }
  };


  const onSelectGood = (goodId) => {
    const found = goods.find((g) => String(g?.id) === String(goodId));
    setEditForm((p) => ({
      ...p,
      goodId,
      nameGood: found?.nameGood ?? "",
      quantity: found?.quantity ?? "",
    }));
  };


  if (loading) {
    return (
      <Box sx={pageWrapperSx}>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }


  if (!donation) {
    return (
      <Box sx={pageWrapperSx}>
        <Typography align="center">لا توجد بيانات</Typography>
      </Box>
    );
  }


  return (
    <Box sx={pageWrapperSx}>
      {/* Header */}
      <Card sx={headerCardStyles}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", fontSize: { xs: 20, lg: 28 } }}
              >
                تفاصيل التبرع
              </Typography>
              <VolunteerActivismIcon
                sx={{ fontSize: { xs: 26, lg: 34 }, color: "#fff" }}
              />
            </Box>


            <Typography
              sx={{
                opacity: 0.9,
                mt: { xs: 1, md: 2 },
                fontSize: { xs: 13, md: 16 },
              }}
            >
              عرض وتعديل وحذف التبرع
            </Typography>
          </Box>


          <Box
            sx={{
              width: { xs: 52, lg: 70 },
              height: { xs: 52, lg: 70 },
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isCash ? (
              <PaidOutlinedIcon
                sx={{ fontSize: { xs: 28, lg: 40 }, color: "#fff" }}
              />
            ) : (
              <Inventory2OutlinedIcon
                sx={{ fontSize: { xs: 28, lg: 40 }, color: "#fff" }}
              />
            )}
          </Box>
        </CardContent>
      </Card>


      <Paper elevation={0} sx={{ ...paperStyle, maxWidth: 1200, mx: "auto" }}>
        {/* Title row + actions (FIXED for 900-1100px) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isBetween900And1100
              ? "column"
              : { xs: "column", lg: "row" },
            alignItems: isBetween900And1100
              ? "stretch"
              : { xs: "stretch", lg: "center" },
            justifyContent: "space-between",
            gap: 1.5,
            mb: 3,
            direction: "rtl",
          }}
        >
          <Typography
            sx={{
              direction: "rtl",
              textAlign: "right",
              fontWeight: 900,
              fontSize: { xs: 16, sm: 18, md: 20, lg: 22 },
              color: "#2f2f27",
              whiteSpace: isBetween900And1100
                ? "normal"
                : { xs: "normal", lg: "nowrap" },
              lineHeight: 1.6,
            }}
            title={donation?.donorName}
          >
            <span>اسم المتبرع :</span>{" "}
            <span style={{ fontWeight: 900 }}>{donation?.donorName}</span>
          </Typography>


          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: isBetween900And1100
                ? "flex-start"
                : { xs: "flex-start", lg: "flex-end" },
              width: isBetween900And1100 ? "100%" : { xs: "100%", lg: "auto" },
            }}
          >
            <Button
              startIcon={<EditOutlinedIcon />}
              variant="contained"
              onClick={() => setOpenEdit(true)}
              sx={{
                ...editBtnSx,
                minWidth: isBetween900And1100 ? 200 : 160,
              }}
            >
              تعديل التبرع
            </Button>


            <Button
              startIcon={<DeleteOutlineIcon />}
              variant="contained"
              onClick={() => setOpenDelete(true)}
              sx={{
                ...deleteBtnSx,
                minWidth: isBetween900And1100 ? 200 : 160,
              }}
            >
              حذف التبرع
            </Button>
          </Box>
        </Box>


        {/* Stats (FIXED for 900-1100px) */}
        <Grid container spacing={2}>
          <Grid
            size={
              isBetween900And1100 ? { xs: 12, md: 6 } : { xs: 12, sm: 6, lg: 4 }
            }
          >
            <Card sx={statCardSx}>
              <Box sx={statInnerSx}>
                <Box sx={statIconWrapSx}>
                  <CalendarMonthOutlinedIcon
                    sx={{ fontSize: 26, color: "#6a6a57" }}
                  />
                </Box>
                <Box>
                  <Typography sx={statLabelSx}>تاريخ التبرع</Typography>
                  <Typography sx={statValueSx}>
                    {donation?.donationDate}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>


          <Grid
            size={
              isBetween900And1100 ? { xs: 12, md: 6 } : { xs: 12, sm: 6, lg: 4 }
            }
          >
            <Card sx={statCardSx}>
              <Box sx={statInnerSx}>
                <Box sx={statIconWrapSx}>
                  <VolunteerActivismIcon
                    sx={{ fontSize: 26, color: "#6a6a57" }}
                  />
                </Box>
                <Box>
                  <Typography sx={statLabelSx}>نوع التبرع</Typography>
                  <Typography sx={statValueSx}>
                    {donation?.donationType}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>


          <Grid
            size={
              isBetween900And1100
                ? { xs: 12 } // ✅ third card goes full-width under them in this range
                : { xs: 12, sm: 6, lg: 4 }
            }
          >
            <Card sx={statCardSx}>
              <Box sx={statInnerSx}>
                <Box sx={statIconWrapSx}>
                  {isCash ? (
                    <PaymentsOutlinedIcon
                      sx={{ fontSize: 26, color: "#6a6a57" }}
                    />
                  ) : (
                    <Inventory2OutlinedIcon
                      sx={{ fontSize: 26, color: "#6a6a57" }}
                    />
                  )}
                </Box>
                <Box>
                  <Typography sx={statLabelSx}>
                    {isCash ? "المبلغ" : "ملخص سريع"}
                  </Typography>
                  <Typography sx={statValueSx}>
                    {isCash
                      ? `${formatMoney(donation?.monetaryAmount)} ${donation?.currency || ""}`
                      : `📦 ${donation?.goods?.length || 0} أصناف`}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>


        {/* ===== InKind display ===== */}
        {!isCash && (
          <>
            <Box sx={sectionTitleSx}>
              <Inventory2OutlinedIcon sx={{ color: "#6a6a57" }} />
              <Typography
                sx={{ fontWeight: 900, color: "#6a6a57", fontSize: 19 }}
              >
                تفاصيل التبرع العيني
              </Typography>
            </Box>


            {isSmallOrMediumScreen ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {goods.length === 0 ? (
                  <Typography align="center">لا توجد أصناف</Typography>
                ) : (
                  goods.map((g) => (
                    <Card
                      key={g.id}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        background: "rgba(255,255,255,0.85)",
                      }}
                    >
                      <Typography sx={{ fontWeight: 900, mb: 0.5 }}>
                        {g.nameGood}
                      </Typography>
                      <Typography color="text.secondary">
                        الكمية: {g.quantity}
                      </Typography>
                    </Card>
                  ))
                )}
              </Box>
            ) : (
              <Card component={Paper} elevation={0} sx={goodsTableShellSx}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ overflowX: "auto" }}>
                    <Table sx={{ minWidth: 450, direction: "rtl" }}>
                      <TableHead>
                        <TableRow
                          sx={{ backgroundColor: "rgba(240,240,234,0.9)" }}
                        >
                          <TableCell align="center" sx={{ fontWeight: "bold" }}>
                            اسم المنتج
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: "bold" }}>
                            الكمية
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {goods.length > 0 ? (
                          goods.map((g) => (
                            <TableRow key={g.id}>
                              <TableCell align="center">{g.nameGood}</TableCell>
                              <TableCell align="center">{g.quantity}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2} align="center">
                              لا توجد أصناف
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </Box>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Paper>


      {/* ================= Edit Dialog ================= */}
      <Dialog
        open={openEdit}
        onClose={() => !saving && setOpenEdit(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 900 }}>تعديل التبرع</DialogTitle>


        <DialogContent sx={{ pt: 2 }}>
          {isCash ? (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="المبلغ"
                  value={editForm.monetaryAmount}
                  onChange={(e) =>
                    setEditForm((p) => ({
                      ...p,
                      monetaryAmount: e.target.value,
                    }))
                  }
                  inputProps={{ inputMode: "decimal" }}
                  sx={inputStyle}
                />
              </Grid>


              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="العملة"
                  value={editForm.currency}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, currency: e.target.value }))
                  }
                  sx={inputStyle}
                />
              </Grid>


              <Grid size={{ xs: 12 }}>
                <Typography sx={{ mt: 0.5, color: "#777", fontSize: 13 }}>
                  يمكنك تعديل المبلغ فقط أو العملة فقط أو الاثنين.
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth sx={inputStyle}>
                  <InputLabel sx={fieldLabelSx}>اختر الصنف</InputLabel>
                  <Select
                    label="اختر الصنف"
                    value={editForm.goodId}
                    onChange={(e) => onSelectGood(e.target.value)}
                    sx={{
                      borderRadius: "14px",
                      "& .MuiSelect-select": {
                        direction: "rtl",
                        textAlign: "right",
                      },
                    }}
                  >
                    {goods.length === 0 ? (
                      <MenuItem value="" disabled>
                        لا توجد أصناف
                      </MenuItem>
                    ) : (
                      goods.map((g) => (
                        <MenuItem key={g.id} value={g.id}>
                          {g.nameGood}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>


              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="تغيير اسم المنتج"
                  value={editForm.nameGood}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, nameGood: e.target.value }))
                  }
                  sx={inputStyle}
                />
              </Grid>


              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="تغيير الكمية"
                  value={editForm.quantity}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, quantity: e.target.value }))
                  }
                  inputProps={{ inputMode: "numeric" }}
                  sx={inputStyle}
                />
              </Grid>


              <Grid size={{ xs: 12 }}>
                <Typography sx={{ mt: 0.5, color: "#777", fontSize: 13 }}>
                  ملاحظة: للتبرع العيني يجب اختيار الصنف، وبعدها تستطيع تعديل
                  الاسم أو الكمية أو الاثنين.
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>


        <DialogActions sx={{ px: 3, pb: 2, gap: 2 }}>
          <Button
            onClick={() => setOpenEdit(false)}
            disabled={saving}
            variant="outlined"
            sx={{
              borderRadius: 3,
              fontWeight: 900,
              textTransform: "none",
              color: "#6a6a57",
              borderColor: "rgba(106,106,87,0.45)",
              background: "#fff",
              "&:hover": { borderColor: "rgba(106,106,87,0.85)" },
            }}
          >
            إلغاء
          </Button>


          <Button
            onClick={handleUpdate}
            disabled={saving}
            variant="contained"
            sx={{ ...editBtnSx, opacity: saving ? 0.8 : 1 }}
          >
            {saving ? "جارٍ الحفظ..." : "حفظ التعديل"}
          </Button>
        </DialogActions>
      </Dialog>


      {/* ================= Delete Confirm Dialog ================= */}
      <Dialog
        open={openDelete}
        onClose={() => !deleting && setOpenDelete(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#B71C1C" }}>
          تأكيد الحذف
        </DialogTitle>


        <DialogContent dividers>
          <Typography sx={{ fontWeight: 900 }}>
            هل أنت متأكد أنك تريد حذف هذا التبرع؟
          </Typography>
          <Typography sx={{ mt: 1, color: "text.secondary", fontWeight: 800 }}>
            لا يمكن التراجع عن هذه العملية.
          </Typography>
        </DialogContent>


        <DialogActions sx={{ p: 2, gap: 2 }}>
          <Button
            onClick={() => setOpenDelete(false)}
            disabled={deleting}
            variant="outlined"
            sx={{
              borderRadius: 3,
              fontWeight: 900,
              textTransform: "none",
              color: "#6a6a57",
              borderColor: "rgba(106,106,87,0.45)",
              background: "#fff",
              "&:hover": { borderColor: "rgba(106,106,87,0.85)" },
            }}
          >
            إلغاء
          </Button>


          <Button
            onClick={handleDelete}
            disabled={deleting}
            variant="contained"
            sx={{ ...deleteBtnSx, opacity: deleting ? 0.8 : 1 }}
          >
            {deleting ? "جارٍ الحذف..." : "حذف"}
          </Button>
        </DialogActions>
      </Dialog>


      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnack}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}



