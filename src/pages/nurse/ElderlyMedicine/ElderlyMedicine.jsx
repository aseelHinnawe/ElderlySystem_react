import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Stack,
  TextField,
  Divider,
  Card,
  CardContent,
  MenuItem,
  IconButton,
  Collapse,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import AxiosUserInstance from "../../../api/AxiosUserInstance.jsx";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";


const REFRESH_MS = 60_000;


// qty status: 1/2/3
const QTY_STATUS_REMAIN = 1; // متبقي
const QTY_STATUS_LOW = 2; // قريب الانتهاء
const QTY_STATUS_FINISH = 3; // منتهي


// give status: 1/2
const GIVE_STATUS_ACTIVE = 1; // مستمر
const GIVE_STATUS_FINISHED = 2; // منتهي


const headerCardStyles = {
  mb: 4,
  borderRadius: 5,
  background: "linear-gradient(135deg,rgb(106,106,87),rgb(160,160,120))",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};


const pageWrapperSx = {
  p: "16px",
  minHeight: "100vh",
  background: "#f0f0ea",
};


const selectPaperStyle = {
  p: { xs: 2.5, sm: 3 },
  mb: 3,
  borderRadius: "20px",
  background: "#f0f0ea",
  border: "1px solid rgba(106, 106, 87, 0.15)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
};


const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "rgba(255,255,255,0.5)",
  },
};


const checklistCardSx = {
  mb: "16px",
  borderRadius: "24px",
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
  background: "rgba(255, 255, 255, 0.65)",
  backdropFilter: "blur(8px)",
};


const detailBoxSx = {
  p: 2,
  borderRadius: 3,
  backgroundColor: "#F8F8F4",
  border: "1px solid rgba(106,106,87,0.12)",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  minHeight: 85,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
};


// ====== helpers for edit ======
const normalizeText = (v) => (typeof v === "string" ? v.trim() : "");


const timeToHHmmss = (t) => {
  const v = normalizeText(t);
  if (!v) return "";
  if (v.length === 5) return `${v}:00`;
  return v;
};


const parseDateToInput = (dateStr) => {
  const s = normalizeText(dateStr);
  if (!s) return "";
  if (s.includes("-") && s.length >= 10) return s.slice(0, 10);
  if (s.includes("/")) {
    const [dd, mm, yyyy] = s.split("/");
    if (yyyy && mm && dd) {
      return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    }
  }
  return "";
};


const parseTimeToInput = (timeStr) => {
  const s = normalizeText(timeStr);
  if (!s) return "";
  return s.length >= 5 ? s.slice(0, 5) : s;
};


export default function ElderlyMedicine() {
  const [searchParams, setSearchParams] = useSearchParams();


  const elderlyIdFromUrl = useMemo(
    () => searchParams.get("elderlyId") || "",
    [searchParams],
  );


  // Desktop collapse
  const [openRowId, setOpenRowId] = useState(null);


  // edit mode (status inline)
  const [editingQtyPlanId, setEditingQtyPlanId] = useState(null);
  const [editingGivePlanId, setEditingGivePlanId] = useState(null);


  // filter (front only)
  const [giveFilter, setGiveFilter] = useState("active");


  // lists/state
  const [elderlies, setElderlies] = useState([]);
  const [plans, setPlans] = useState([]);


  const [elderliesLoading, setElderliesLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);


  const [elderliesErr, setElderliesErr] = useState("");
  const [plansErr, setPlansErr] = useState("");


  // saving states
  const [savingQtyPlanId, setSavingQtyPlanId] = useState(null);
  const [savingGivePlanId, setSavingGivePlanId] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);


  // snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });


  const closeSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };


  useEffect(() => {
    setGiveFilter("active");
    setOpenRowId(null);
    setEditingQtyPlanId(null);
    setEditingGivePlanId(null);
  }, [elderlyIdFromUrl]);


  // ===== Dialog: full edit drug plan =====
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editForm, setEditForm] = useState({
    startDate: "",
    endDate: "",
    dailyIntake: 1,
    notes: "",
    times: [""],
  });
  const [editErrors, setEditErrors] = useState({});


  const openEditDialog = (row) => {
    const di = Number(row?.dailyIntake || 1);
    const rowTimes = Array.isArray(row?.times) ? row.times : [];
    const initialTimes = Array.from(
      { length: di },
      (_, i) => parseTimeToInput(rowTimes[i] || ""),
    );


    setEditRow(row);
    setEditErrors({});
    setEditForm({
      startDate: parseDateToInput(row?.startDate),
      endDate: parseDateToInput(row?.endDate),
      dailyIntake: di,
      notes: row?.notes ?? "",
      times: initialTimes,
    });
    setEditDialogOpen(true);
  };


  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditRow(null);
    setEditErrors({});
  };


  // keep times length synced with dailyIntake in edit dialog
  useEffect(() => {
    if (!editDialogOpen) return;


    const di = Number(editForm.dailyIntake) || 1;
    setEditForm((prev) => {
      const curr = Array.isArray(prev.times) ? prev.times : [];
      if (curr.length === di) return prev;
      if (curr.length < di) {
        return {
          ...prev,
          times: [...curr, ...Array(di - curr.length).fill("")],
        };
      }
      return { ...prev, times: curr.slice(0, di) };
    });
  }, [editDialogOpen, editForm.dailyIntake]);


  // ========= labels/colors =========
  const qtyStatusLabel = (s) =>
    s === QTY_STATUS_REMAIN
      ? "متبقي"
      : s === QTY_STATUS_LOW
        ? "قريب الانتهاء"
        : s === QTY_STATUS_FINISH
          ? "منتهي"
          : "-";


  const qtyStatusColors = {
    [QTY_STATUS_REMAIN]: { bg: "#E8F5E9", color: "#2E7D32" },
    [QTY_STATUS_LOW]: { bg: "#FFF8E1", color: "#8D6E63" },
    [QTY_STATUS_FINISH]: { bg: "#FFEBEE", color: "#C62828" },
  };


  const giveStatusLabel = (s) =>
    s === GIVE_STATUS_ACTIVE
      ? "مستمر"
      : s === GIVE_STATUS_FINISHED
        ? "منتهي"
        : "-";


  const giveStatusColors = {
    active: { bg: "#E8F5E9", color: "#2E7D32" },
    finished: { bg: "#FFEBEE", color: "#C62828" },
    unknown: { bg: "#eee", color: "#555" },
  };


  const getGiveColors = (s) =>
    s === GIVE_STATUS_ACTIVE
      ? giveStatusColors.active
      : s === GIVE_STATUS_FINISHED
        ? giveStatusColors.finished
        : giveStatusColors.unknown;


  // ========= helpers =========
  const handleSelectElderly = (value) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (!value) p.delete("elderlyId");
      else p.set("elderlyId", String(value));
      return p;
    });
  };


  const formatTimeWithPeriod = (time) => {
    if (!time) return "-";
    const [h, m] = String(time).split(":");
    const hours = parseInt(h, 10);
    if (Number.isNaN(hours) || m === undefined) return time;
    const period = hours < 12 ? "صباحًا" : "مساءً";
    const normalHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${normalHour}:${m} ${period}`;
  };


  const toggleRow = (rowId) => {
    setOpenRowId((prev) => (prev === rowId ? null : rowId));
  };


  const startEditQty = (planId) => {
    setEditingQtyPlanId(planId);
    setEditingGivePlanId(null);
  };


  const startEditGive = (planId) => {
    setEditingGivePlanId(planId);
    setEditingQtyPlanId(null);
  };


  // ========= Fetch functions =========
  const fetchElderlies = useCallback(async () => {
    setElderliesLoading(true);
    setElderliesErr("");


    try {
      const res = await AxiosUserInstance.get("/Nurse/Elderly");
      const list = Array.isArray(res?.data?.elderlies) ? res.data.elderlies : [];


      const mapped = list
        .filter((x) => x?.elderlyId != null)
        .map((x) => ({
          id: x.elderlyId,
          name: x.name || `مسن #${x.elderlyId}`,
        }));


      setElderlies(mapped);
    } catch (err) {
      setElderliesErr(
        err?.response?.data?.message ||
          err?.message ||
          "حدث خطأ أثناء جلب قائمة المسنين",
      );
      setElderlies([]);
    } finally {
      setElderliesLoading(false);
    }
  }, []);


  const fetchDrugPlans = useCallback(async (elderlyId, showLoader = true) => {
    if (!elderlyId) {
      setPlans([]);
      setPlansErr("");
      return;
    }


    if (showLoader) setPlansLoading(true);
    setPlansErr("");


    try {
      const res = await AxiosUserInstance.get(
        `/Nurse/Medicine/elderly/${elderlyId}/drug-plans`,
      );


      setPlans(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      setPlansErr(
        err?.response?.data?.message ||
          err?.message ||
          "حدث خطأ أثناء جلب خطة الأدوية",
      );
      setPlans([]);
    } finally {
      if (showLoader) setPlansLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchElderlies();
  }, [fetchElderlies]);


  useEffect(() => {
    if (!elderlyIdFromUrl) {
      setPlans([]);
      setPlansErr("");
      return;
    }


    fetchDrugPlans(elderlyIdFromUrl, true);


    const interval = setInterval(() => {
      fetchDrugPlans(elderlyIdFromUrl, false);
    }, REFRESH_MS);


    return () => clearInterval(interval);
  }, [elderlyIdFromUrl, fetchDrugPlans]);


  // ✅ فلترة Front-end حسب حالة إعطاء الدواء
  const filteredPlans = useMemo(() => {
    return plans.filter((row) => {
      const s = row?.medicineStatus ?? row?.MedicineStatus;
      if (giveFilter === "active") return s === GIVE_STATUS_ACTIVE;
      if (giveFilter === "finished") return s === GIVE_STATUS_FINISHED;
      return true;
    });
  }, [plans, giveFilter]);


  // ========= Update functions =========
  const handleUpdateQtyStatus = async ({ drugPlanId, status }) => {
    const previous = plans.map((p) => ({ ...p }));


    setSavingQtyPlanId(drugPlanId);
    setPlans((old) =>
      old.map((p) => (p.drugPlanId === drugPlanId ? { ...p, status } : p)),
    );


    try {
      await AxiosUserInstance.put(
        `/Nurse/Medicine/drug-plan/${drugPlanId}/status`,
        null,
        { params: { status } },
      );


      setSnackbar({
        open: true,
        severity: "success",
        message: "تم تحديث حالة كمية الدواء بنجاح",
      });


      setEditingQtyPlanId(null);
    } catch (err) {
      setPlans(previous);
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "تعذر تحديث حالة كمية الدواء",
      });
    } finally {
      setSavingQtyPlanId(null);
      if (elderlyIdFromUrl) {
        fetchDrugPlans(elderlyIdFromUrl, false);
      }
    }
  };


  const handleUpdateGiveStatus = async ({ drugPlanId, medicineStatus }) => {
    const previous = plans.map((p) => ({ ...p }));


    setSavingGivePlanId(drugPlanId);
    setPlans((old) =>
      old.map((p) =>
        p.drugPlanId === drugPlanId ? { ...p, medicineStatus } : p,
      ),
    );


    try {
      await AxiosUserInstance.put(
        `/Nurse/Medicine/drug-plan/${drugPlanId}/medicine-status`,
        null,
        { params: { medicineStatus } },
      );


      setSnackbar({
        open: true,
        severity: "success",
        message: "تم تحديث حالة إعطاء الدواء بنجاح",
      });


      setEditingGivePlanId(null);
    } catch (err) {
      setPlans(previous);
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "تعذر تحديث حالة إعطاء الدواء",
      });
    } finally {
      setSavingGivePlanId(null);
      if (elderlyIdFromUrl) {
        fetchDrugPlans(elderlyIdFromUrl, false);
      }
    }
  };


  const submitEdit = async () => {
    const errs = {};


    const startDate = normalizeText(editForm.startDate);
    const endDate = normalizeText(editForm.endDate);
    const di = Number(editForm.dailyIntake) || 1;


    if (!startDate) errs.startDate = "تاريخ البداية مطلوب";
    if (!endDate) errs.endDate = "تاريخ النهاية مطلوب";


    if (startDate && endDate) {
      if (new Date(endDate) < new Date(startDate)) {
        errs.endDate = "تاريخ النهاية يجب أن يكون بعد/يساوي تاريخ البداية";
      }
    }


    const times = Array.isArray(editForm.times) ? editForm.times : [];
    if (times.length !== di) {
      errs.times = "عدد الأوقات يجب أن يساوي عدد الجرعات اليومية";
    }


    const cleanedTimes = times.map((t) => normalizeText(t));
    if (cleanedTimes.some((t) => !t)) {
      errs.times = "يرجى إدخال جميع الأوقات";
    }


    const unique = new Set(cleanedTimes);
    if (unique.size !== cleanedTimes.length) {
      errs.times = "مواعيد الجرعات تحتوي على تكرار";
    }


    setEditErrors(errs);
    if (Object.keys(errs).length > 0) return;


    const payload = {
      startDate,
      endDate,
      dailyIntake: di,
      notes: editForm.notes ?? "",
      times: cleanedTimes.map(timeToHHmmss),
    };


    setSavingEdit(true);
    try {
      await AxiosUserInstance.put(
        `/Nurse/Medicine/drug-plan/${editRow?.drugPlanId}`,
        payload,
      );


      setSnackbar({
        open: true,
        severity: "success",
        message: "تم تعديل خطة الدواء بنجاح",
      });


      closeEditDialog();


      if (elderlyIdFromUrl) {
        fetchDrugPlans(elderlyIdFromUrl, false);
      }
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "تعذر تعديل خطة الدواء",
      });
    } finally {
      setSavingEdit(false);
    }
  };


  // ========= UI renderers =========
  const renderQtyStatusWithPencil = (row, size = "desktop") => {
    const planId = row?.drugPlanId;
    const s = row?.status;
    const isSaving = savingQtyPlanId === planId;


    if (editingQtyPlanId === planId) {
      const opts = [1, 2, 3].filter((x) => x !== s);


      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 0.5,
            flexWrap: "wrap",
          }}
        >
          {opts.map((opt) => (
            <Button
              key={opt}
              size="small"
              variant="outlined"
              disabled={isSaving}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "none",
                fontSize: size === "mobile" ? 11 : { xs: 10, md: 13 },
                fontWeight: 800,
              }}
              onClick={() =>
                handleUpdateQtyStatus({
                  drugPlanId: planId,
                  status: opt,
                })
              }
            >
              {qtyStatusLabel(opt)}
            </Button>
          ))}


          <Button
            size="small"
            variant="outlined"
            color="error"
            disabled={isSaving}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontSize: size === "mobile" ? 11 : { xs: 10, md: 13 },
              fontWeight: 800,
            }}
            onClick={() => setEditingQtyPlanId(null)}
          >
            إلغاء
          </Button>


          {isSaving && <CircularProgress size={18} sx={{ ml: 1 }} />}
        </Box>
      );
    }


    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.75,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 0.4,
            borderRadius: 3,
            fontSize: 14,
            fontWeight: 800,
            whiteSpace: "nowrap",
            backgroundColor: qtyStatusColors[s]?.bg || "#eee",
            color: qtyStatusColors[s]?.color || "#555",
          }}
        >
          {qtyStatusLabel(s)}
        </Box>


        <IconButton
          size="small"
          onClick={() => startEditQty(planId)}
          disabled={isSaving}
          sx={{
            backgroundColor: "#f0f4f0",
            "&:hover": { backgroundColor: "#dce3dc" },
            borderRadius: 2,
            opacity: isSaving ? 0.6 : 1,
          }}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };


  const renderGiveStatusWithPencil = (row, size = "desktop") => {
    const planId = row?.drugPlanId;
    const giveStatus = row?.medicineStatus ?? row?.MedicineStatus;
    const isSaving = savingGivePlanId === planId;
    const colors = getGiveColors(giveStatus);


    if (editingGivePlanId === planId) {
      const opts = [GIVE_STATUS_ACTIVE, GIVE_STATUS_FINISHED].filter(
        (x) => x !== giveStatus,
      );


      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 0.5,
            flexWrap: "wrap",
          }}
        >
          {opts.map((opt) => (
            <Button
              key={opt}
              size="small"
              variant="outlined"
              disabled={isSaving}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "none",
                fontSize: size === "mobile" ? 11 : { xs: 10, md: 13 },
                fontWeight: 800,
              }}
              onClick={() =>
                handleUpdateGiveStatus({
                  drugPlanId: planId,
                  medicineStatus: opt,
                })
              }
            >
              {opt === GIVE_STATUS_ACTIVE ? "مستمر" : "منتهي"}
            </Button>
          ))}


          <Button
            size="small"
            variant="outlined"
            color="error"
            disabled={isSaving}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontSize: size === "mobile" ? 11 : { xs: 10, md: 13 },
              fontWeight: 800,
            }}
            onClick={() => setEditingGivePlanId(null)}
          >
            إلغاء
          </Button>


          {isSaving && <CircularProgress size={18} sx={{ ml: 1 }} />}
        </Box>
      );
    }


    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.75,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 0.4,
            borderRadius: 3,
            fontSize: 14,
            fontWeight: 800,
            whiteSpace: "nowrap",
            backgroundColor: colors.bg,
            color: colors.color,
          }}
        >
          {giveStatusLabel(giveStatus)}
        </Box>


        <IconButton
          size="small"
          onClick={() => startEditGive(planId)}
          disabled={isSaving}
          sx={{
            backgroundColor: "#f0f4f0",
            "&:hover": { backgroundColor: "#dce3dc" },
            borderRadius: 2,
            opacity: isSaving ? 0.6 : 1,
          }}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };


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
                أدوية المسن
              </Typography>
              <MedicationOutlinedIcon
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
              اختر اسم المسن لعرض جميع خطط الأدوية الخاصة به
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
            <LocalPharmacyOutlinedIcon
              sx={{ fontSize: { xs: 28, lg: 40 }, color: "#fff" }}
            />
          </Box>
        </CardContent>
      </Card>


      {/* Selects */}
      <Paper elevation={0} sx={selectPaperStyle}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, mb: 2, textAlign: "center" }}
        >
          اختيار المسن
        </Typography>


        {elderliesErr && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {elderliesErr}
          </Alert>
        )}


        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: elderlyIdFromUrl ? "row" : "column",
            },
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, width: "100%" }}>
            <TextField
              select
              fullWidth
              label="اسم المسن"
              value={elderlyIdFromUrl}
              onChange={(e) => handleSelectElderly(e.target.value)}
              sx={{
                ...inputStyle,
                "& .MuiSelect-select": { direction: "rtl", textAlign: "right" },
              }}
            >
              <MenuItem value="">
                {elderliesLoading ? "جارٍ تحميل المسنين..." : "اختر المسن"}
              </MenuItem>


              {elderlies.map((elderly) => (
                <MenuItem key={elderly.id} value={elderly.id}>
                  {elderly.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>


          {elderlyIdFromUrl && (
            <Box sx={{ flex: 1, width: "100%" }}>
              <TextField
                select
                fullWidth
                label="حالة إعطاء الدواء"
                value={giveFilter}
                onChange={(e) => setGiveFilter(e.target.value)}
                sx={{
                  ...inputStyle,
                  "& .MuiSelect-select": {
                    direction: "rtl",
                    textAlign: "right",
                  },
                }}
              >
                <MenuItem value="active">مستمر</MenuItem>
                <MenuItem value="finished">منتهي</MenuItem>
              </TextField>
            </Box>
          )}
        </Box>
      </Paper>


      <Divider sx={{ mb: 2 }} />


      {plansErr && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {plansErr}
        </Alert>
      )}


      {!elderlyIdFromUrl ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: "20px",
            background: "#fff",
            border: "1px solid rgba(106, 106, 87, 0.12)",
          }}
        >
          <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>
            يرجى اختيار المسن أولاً لعرض الأدوية
          </Typography>
        </Paper>
      ) : plansLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : filteredPlans.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: "20px",
            background: "#fff",
            border: "1px solid rgba(106, 106, 87, 0.12)",
          }}
        >
          <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>
            لا يوجد نتائج حسب الفلتر الحالي
          </Typography>
        </Paper>
      ) : (
        <>
          {/* ===== Desktop (md+) ===== */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Card
              component={Paper}
              sx={{ borderRadius: 3, overflow: "hidden" }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 450, direction: "rtl" }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          الدواء
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          النوع
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          الفترة
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          عدد الجرعات
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          حالة كمية الدواء
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          حالة إعطاء الدواء
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          تفاصيل/تعديل
                        </TableCell>
                      </TableRow>
                    </TableHead>


                    <TableBody>
                      {filteredPlans.map((row, idx) => {
                        const rowId = row?.drugPlanId ?? idx;
                        const isOpen = openRowId === rowId;


                        return (
                          <React.Fragment key={rowId}>
                            <TableRow
                              sx={{
                                backgroundColor: isOpen
                                  ? "#fcfcfa"
                                  : "transparent",
                              }}
                            >
                              <TableCell align="center">
                                {row?.medicineName ?? "-"}
                              </TableCell>
                              <TableCell align="center">
                                {row?.medicineTypeName ?? "-"}
                              </TableCell>
                              <TableCell align="center">
                                {row?.startDate ?? "-"} {" إلى "}{" "}
                                {row?.endDate ?? "-"}
                              </TableCell>
                              <TableCell align="center">
                                {row?.dailyIntake ?? "-"}
                              </TableCell>


                              <TableCell align="center">
                                {renderQtyStatusWithPencil(row, "desktop")}
                              </TableCell>
                              <TableCell align="center">
                                {renderGiveStatusWithPencil(row, "desktop")}
                              </TableCell>


                              <TableCell align="center">
                                <IconButton
                                  onClick={() => toggleRow(rowId)}
                                  size="small"
                                >
                                  {isOpen ? (
                                    <KeyboardArrowUpOutlinedIcon />
                                  ) : (
                                    <KeyboardArrowDownOutlinedIcon />
                                  )}
                                </IconButton>
                              </TableCell>
                            </TableRow>


                            <TableRow>
                              <TableCell
                                colSpan={7}
                                sx={{
                                  p: 0,
                                  borderBottom: 0,
                                  backgroundColor: "#fcfcfa",
                                }}
                              >
                                <Collapse
                                  in={isOpen}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <Box sx={{ p: 2.5 }}>
                                    <Box
                                      sx={{
                                        display: "grid",
                                        gridTemplateColumns:
                                          "repeat(2, minmax(0, 1fr))",
                                        gap: 1.5,
                                        mb: 1.5,
                                      }}
                                    >
                                      <Box sx={detailBoxSx}>
                                        <Typography
                                          sx={{
                                            fontSize: 15,
                                            mb: 0.8,
                                            color: "text.secondary",
                                          }}
                                        >
                                          الأوقات
                                        </Typography>
                                        {Array.isArray(row?.times) &&
                                        row.times.length > 0 ? (
                                          <Stack
                                            direction="row"
                                            gap={1}
                                            flexWrap="wrap"
                                            justifyContent="center"
                                          >
                                            {row.times.map((t, i) => (
                                              <Chip
                                                key={i}
                                                label={formatTimeWithPeriod(t)}
                                                size="small"
                                              />
                                            ))}
                                          </Stack>
                                        ) : (
                                          <Typography
                                            sx={{
                                              fontWeight: 800,
                                              color: "#2f2f27",
                                            }}
                                          >
                                            -
                                          </Typography>
                                        )}
                                      </Box>


                                      <Box
                                        sx={{
                                          ...detailBoxSx,
                                          alignItems: "flex-start",
                                          textAlign: "right",
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            fontSize: 15,
                                            mb: 0.8,
                                            color: "text.secondary",
                                          }}
                                        >
                                          ملاحظات
                                        </Typography>
                                        <Typography
                                          sx={{
                                            fontWeight: 800,
                                            color: "#2f2f27",
                                            whiteSpace: "pre-wrap",
                                            width: "100%",
                                          }}
                                        >
                                          {row?.notes ?? "-"}
                                        </Typography>
                                      </Box>
                                    </Box>


                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                      }}
                                    >
                                      <Button
                                        variant="outlined"
                                        startIcon={<EditOutlinedIcon />}
                                        onClick={() => openEditDialog(row)}
                                        sx={{
                                          borderRadius: 2,
                                          textTransform: "none",
                                          fontWeight: 900,
                                          color: "#6a6a57",
                                          borderColor: "rgba(106,106,87,0.35)",
                                          backgroundColor: "#fff",
                                          "&:hover": {
                                            borderColor: "#6a6a57",
                                            backgroundColor:
                                              "rgba(106,106,87,0.06)",
                                          },
                                          gap: 1,
                                        }}
                                      >
                                        تعديل الخطة
                                      </Button>
                                    </Box>
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              </CardContent>
            </Card>
          </Box>


          {/* ===== Mobile (xs/sm) ===== */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            {filteredPlans.map((row, idx) => (
              <Card key={row?.drugPlanId || idx} sx={checklistCardSx}>
                <CardContent sx={{ p: 2.2 }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 1,
                      mb: 1.2,
                    }}
                  >
                    <Box sx={{ ...detailBoxSx, minHeight: 70 }}>
                      <Typography
                        sx={{ fontSize: 14, mb: 0.6, color: "text.secondary" }}
                      >
                        حالة كمية الدواء
                      </Typography>
                      {renderQtyStatusWithPencil(row, "mobile")}
                    </Box>


                    <Box sx={{ ...detailBoxSx, minHeight: 70 }}>
                      <Typography
                        sx={{ fontSize: 14, mb: 0.6, color: "text.secondary" }}
                      >
                        حالة إعطاء الدواء
                      </Typography>
                      {renderGiveStatusWithPencil(row, "mobile")}
                    </Box>
                  </Box>


                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 1.2,
                      mb: 1.2,
                    }}
                  >
                    <Box sx={detailBoxSx}>
                      <Typography
                        sx={{ fontSize: 14, mb: 0.5, color: "text.secondary" }}
                      >
                        الدواء
                      </Typography>
                      <Typography sx={{ fontWeight: 800, color: "#2f2f27" }}>
                        {row?.medicineName ?? "-"}
                      </Typography>
                    </Box>


                    <Box sx={detailBoxSx}>
                      <Typography
                        sx={{ fontSize: 14, mb: 0.5, color: "text.secondary" }}
                      >
                        النوع
                      </Typography>
                      <Typography sx={{ fontWeight: 800, color: "#2f2f27" }}>
                        {row?.medicineTypeName ?? "-"}
                      </Typography>
                    </Box>


                    <Box sx={{ ...detailBoxSx, gridColumn: "1 / -1" }}>
                      <Typography
                        sx={{ fontSize: 14, mb: 0.5, color: "text.secondary" }}
                      >
                        الفترة
                      </Typography>
                      <Typography sx={{ fontWeight: 800, color: "#2f2f27" }}>
                        {row?.startDate ?? "-"} {" إلى "} {row?.endDate ?? "-"}
                      </Typography>
                    </Box>


                    <Box sx={detailBoxSx}>
                      <Typography
                        sx={{ fontSize: 14, mb: 0.5, color: "text.secondary" }}
                      >
                        عدد الجرعات
                      </Typography>
                      <Typography sx={{ fontWeight: 800, color: "#2f2f27" }}>
                        {row?.dailyIntake ?? "-"}
                      </Typography>
                    </Box>


                    <Box sx={detailBoxSx}>
                      <Typography
                        sx={{ fontSize: 14, mb: 0.5, color: "text.secondary" }}
                      >
                        رقم الخطة
                      </Typography>
                      <Typography sx={{ fontWeight: 800, color: "#2f2f27" }}>
                        {row?.drugPlanId ?? "-"}
                      </Typography>
                    </Box>
                  </Box>


                  <Accordion
                    disableGutters
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      background: "#f8f8f4",
                      border: "1px solid rgba(106,106,87,0.15)",
                      "&:before": { display: "none" },
                      mt: 1,
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        px: 2,
                        minHeight: 48,
                        "& .MuiAccordionSummary-content": {
                          margin: "8px 0",
                          justifyContent: "center",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: 14,
                          textAlign: "center",
                          width: "100%",
                        }}
                      >
                        عرض التفاصيل/تعديل
                      </Typography>
                    </AccordionSummary>


                    <AccordionDetails sx={{ px: 2, pb: 2 }}>
                      <Box sx={{ ...detailBoxSx, alignItems: "center", mb: 1.5 }}>
                        <Typography
                          sx={{ fontSize: 14, mb: 1, color: "text.secondary" }}
                        >
                          الأوقات
                        </Typography>


                        {Array.isArray(row?.times) && row.times.length > 0 ? (
                          <Stack
                            direction="row"
                            gap={1}
                            flexWrap="wrap"
                            justifyContent="center"
                          >
                            {row.times.map((t, i) => (
                              <Chip
                                key={i}
                                label={formatTimeWithPeriod(t)}
                                size="small"
                              />
                            ))}
                          </Stack>
                        ) : (
                          <Typography sx={{ fontWeight: 800, color: "#2f2f27" }}>
                            -
                          </Typography>
                        )}
                      </Box>


                      <Box
                        sx={{
                          ...detailBoxSx,
                          alignItems: "flex-start",
                          textAlign: "right",
                          mb: 1.5,
                        }}
                      >
                        <Typography
                          sx={{ fontSize: 14, mb: 0.8, color: "text.secondary" }}
                        >
                          ملاحظات
                        </Typography>


                        <Typography
                          sx={{
                            fontWeight: 800,
                            color: "#2f2f27",
                            whiteSpace: "pre-wrap",
                            width: "100%",
                          }}
                        >
                          {row?.notes ?? "-"}
                        </Typography>
                      </Box>


                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<EditOutlinedIcon />}
                        onClick={() => openEditDialog(row)}
                        sx={{
                          borderRadius: 3,
                          textTransform: "none",
                          fontWeight: 900,
                          color: "#6a6a57",
                          borderColor: "rgba(106,106,87,0.35)",
                          backgroundColor: "#fff",
                          "&:hover": {
                            borderColor: "#6a6a57",
                            backgroundColor: "rgba(106,106,87,0.06)",
                          },
                          gap: 1,
                        }}
                      >
                        تعديل الخطة
                      </Button>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </Box>
        </>
      )}


      {/* ===== Edit Dialog ===== */}
      <Dialog
        open={editDialogOpen}
        onClose={savingEdit ? undefined : closeEditDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 900, direction: "rtl" }}>
          تعديل خطة الدواء
        </DialogTitle>


        <DialogContent sx={{ pt: 2, direction: "rtl" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              mt: 1,
            }}
          >
            <TextField
              label="تاريخ البداية"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={editForm.startDate}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, startDate: e.target.value }))
              }
              error={!!editErrors.startDate}
              helperText={editErrors.startDate}
              sx={inputStyle}
              fullWidth
            />


            <TextField
              label="تاريخ النهاية"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={editForm.endDate}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, endDate: e.target.value }))
              }
              error={!!editErrors.endDate}
              helperText={editErrors.endDate}
              sx={inputStyle}
              fullWidth
            />
          </Box>


          <Box sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="عدد الجرعات اليومية"
              value={editForm.dailyIntake}
              onChange={(e) =>
                setEditForm((p) => ({
                  ...p,
                  dailyIntake: Number(e.target.value),
                }))
              }
              sx={{
                ...inputStyle,
                "& .MuiSelect-select": { direction: "rtl", textAlign: "right" },
              }}
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </TextField>
          </Box>


          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="ملاحظات"
              value={editForm.notes}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, notes: e.target.value }))
              }
              multiline
              minRows={2}
              sx={{
                ...inputStyle,
                "& .MuiOutlinedInput-input": {
                  direction: "rtl",
                  textAlign: "right",
                },
              }}
            />
          </Box>


          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontWeight: 900, mb: 1 }}>
              مواعيد الجرعات
            </Typography>


            {editErrors.times && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {editErrors.times}
              </Alert>
            )}


            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              {(editForm.times || []).map((t, idx) => (
                <TextField
                  key={idx}
                  type="time"
                  label={`وقت الجرعة #${idx + 1}`}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 60 }}
                  value={t}
                  onChange={(e) =>
                    setEditForm((p) => {
                      const arr = [...(p.times || [])];
                      arr[idx] = e.target.value;
                      return { ...p, times: arr };
                    })
                  }
                  sx={inputStyle}
                  fullWidth
                />
              ))}
            </Box>
          </Box>
        </DialogContent>


        <DialogActions sx={{ direction: "rtl", px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={closeEditDialog}
            disabled={savingEdit}
            variant="outlined"
            color="error"
            sx={{ borderRadius: 2, fontWeight: 900 }}
          >
            إلغاء
          </Button>


          <Button
            onClick={submitEdit}
            disabled={savingEdit}
            variant="contained"
            sx={{
              borderRadius: 2,
              fontWeight: 900,
              background: "linear-gradient(135deg, #6a6a57, #8a8a76)",
            }}
          >
            {savingEdit ? "جارٍ الحفظ..." : "حفظ التعديل"}
          </Button>
        </DialogActions>
      </Dialog>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%", fontWeight: 700 }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

