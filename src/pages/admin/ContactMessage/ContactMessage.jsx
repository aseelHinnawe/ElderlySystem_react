import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  TextField,
  Paper,
  Chip,
  IconButton,
  Collapse,
  Divider,
  Grid,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AxiosUserInstance from "../../../api/AxiosUserInstance.jsx";


const headerCardStyles = {
  mb: 3,
  borderRadius: 5,
  background: "linear-gradient(135deg,rgb(106,106,87),rgb(160,160,120))",
  color: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};


export default function ContactMessage() {
  const navigate = useNavigate();


  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState(null);


  const [replyInputs, setReplyInputs] = useState({});
  const [postingIds, setPostingIds] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });


  const fetchContactMessages = async () => {
    const res = await AxiosUserInstance.get("/ContactMessage");
    return res?.data?.data || [];
  };


  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["contactMessages"],
    queryFn: fetchContactMessages,
    staleTime: 1000 * 30,
    retry: 1,
    onError: (err) => {
      if (err?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "حدث خطأ أثناء جلب الرسائل",
      });
    },
  });


  const messages = useMemo(() => data || [], [data]);


  const getReplyState = (m) => {
    const statusText = (m?.status || "").trim();
    const isReplied =
      !!m?.repliedAt ||
      statusText.includes("تم الرد") ||
      (m?.adminReplyDisplay && m.adminReplyDisplay !== "لم يتم الرد");


    const replyText =
      (m?.adminReply && m.adminReply.trim()) ||
      (m?.adminReplyDisplay && m.adminReplyDisplay !== "لم يتم الرد"
        ? m.adminReplyDisplay
        : "");


    return { isReplied, replyText, statusText };
  };


  const statusChipProps = (m) => {
    const { isReplied } = getReplyState(m);
    if (isReplied) return { color: "success", label: "تم الرد" };
    return { color: "warning", label: "جديد" };
  };


  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const { isReplied } = getReplyState(m);
      if (filterStatus === "all") return true;
      if (filterStatus === "new") return !isReplied;
      if (filterStatus === "replied") return isReplied;
      return true;
    });
  }, [messages, filterStatus]);


  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };


  const handleReplyChange = (id, value) => {
    setReplyInputs((prev) => ({ ...prev, [id]: value }));
  };


  const handleSendReply = async (id) => {
    const text = (replyInputs[id] || "").trim();
    if (!text) {
      setSnackbar({
        open: true,
        severity: "warning",
        message: "اكتب الرد قبل الإرسال",
      });
      return;
    }


    try {
      setPostingIds((p) => ({ ...p, [id]: true }));


      // ✅ جرّبت لك reply + adminReply لزيادة التوافق
      await AxiosUserInstance.post(`/ContactMessage/${id}/reply`, {
        reply: text,
        adminReply: text,
      });


      setSnackbar({
        open: true,
        severity: "success",
        message: "تم إرسال الرد بنجاح",
      });


      setReplyInputs((prev) => ({ ...prev, [id]: "" }));
      await refetch();
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setSnackbar({
        open: true,
        severity: "error",
        message: err?.response?.data?.message || "حدث خطأ أثناء إرسال الرد",
      });
    } finally {
      setPostingIds((p) => ({ ...p, [id]: false }));
    }
  };


  return (
    <Box sx={{ p: { xs: 2, md: 3 } }} dir="rtl">
      {/* Header */}
      <Card sx={headerCardStyles}>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              رسائل التواصل
            </Typography>
            <Typography sx={{ opacity: 0.9, mt: 1, fontSize: 14 }}>
              يمكنك عرض الرسائل والرد عليها بسهولة
            </Typography>
          </Box>
        </CardContent>
      </Card>


      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>الحالة</InputLabel>
            <Select
              value={filterStatus}
              label="الحالة"
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ borderRadius: 3, backgroundColor: "#fefefe" }}
            >
              <MenuItem value="new">جديد</MenuItem>
              <MenuItem value="replied">تم الرد</MenuItem>
              <MenuItem value="all">الكل</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>


      {/* Loading / Error */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      )}


      {isError && !isLoading && (
        <Alert severity="error">تعذر تحميل الرسائل. حاول مرة أخرى.</Alert>
      )}


      {!isLoading && !isError && filteredMessages.length === 0 && (
        <TableCell colSpan={4} align="center">
          لا توجد بيانات
        </TableCell>
      )}


      {/* Desktop Table */}
      {!isLoading && !isError && filteredMessages.length > 0 && (
        <>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Card
              component={Paper}
              sx={{ borderRadius: 3, overflow: "hidden" }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 800, direction: "rtl" }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell align="center" sx={{ fontWeight: 900 }}>
                          الاسم
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 900 }}>
                          الموضوع
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 900 }}>
                          الحالة
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontWeight: 900 }}
                        ></TableCell>
                      </TableRow>
                    </TableHead>


                    <TableBody>
                      {filteredMessages.map((m) => {
                        const chip = statusChipProps(m);
                        const { isReplied, replyText } = getReplyState(m);
                        const expanded = expandedId === m?.id;


                        return (
                          <React.Fragment key={m?.id}>
                            <TableRow hover>
                              <TableCell align="center">
                                {m?.fullName || "-"}
                              </TableCell>
                              <TableCell align="center">
                                {m?.subject || "-"}
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  size="small"
                                  color={chip.color}
                                  label={chip.label}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <IconButton onClick={() => toggleExpand(m?.id)}>
                                  {expanded ? (
                                    <ExpandLessIcon />
                                  ) : (
                                    <ExpandMoreIcon />
                                  )}
                                </IconButton>
                              </TableCell>
                            </TableRow>


                            {/* Expand Row */}
                            <TableRow>
                              <TableCell colSpan={5} sx={{ p: 0 }}>
                                <Collapse
                                  in={expanded}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <Box sx={{ p: 2 }}>
                                    <Typography
                                      sx={{
                                        fontWeight: 900,
                                        mb: 1,
                                        textAlign: "right",
                                      }}
                                    >
                                      تفاصيل الرسالة
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        whiteSpace: "pre-wrap",
                                        mb: 2,
                                        textAlign: "right",
                                      }}
                                    >
                                      {m?.message || "-"}
                                    </Typography>


                                    <Divider sx={{ my: 2 }} />


                                    <Typography
                                      sx={{
                                        fontWeight: 900,
                                        mb: 1,
                                        textAlign: "right",
                                      }}
                                    >
                                      رد الإدارة
                                    </Typography>


                                    {isReplied ? (
                                      <Box
                                        sx={{
                                          p: 2,
                                          borderRadius: 2,
                                          backgroundColor: "#f5f5f5",
                                          border: "1px solid #e0e0e0",
                                        }}
                                      >
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            whiteSpace: "pre-wrap",
                                            textAlign: "right",
                                          }}
                                        >
                                          {replyText ||
                                            "تم الرد (لا يوجد نص رد)"}
                                        </Typography>
                                      </Box>
                                    ) : (
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: 1.5,
                                        }}
                                      >
                                        <TextField
                                          label="اكتب رد الإدارة"
                                          multiline
                                          minRows={3}
                                          value={replyInputs[m?.id] || ""}
                                          onChange={(e) =>
                                            handleReplyChange(
                                              m?.id,
                                              e.target.value,
                                            )
                                          }
                                          fullWidth
                                        />
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                          }}
                                        >
                                          <Button
                                            variant="contained"
                                            onClick={() =>
                                              handleSendReply(m?.id)
                                            }
                                            disabled={!!postingIds[m?.id]}
                                            sx={{
                                              borderRadius: 2,
                                              textTransform: "none",
                                              fontWeight: 800,
                                              backgroundColor: "#FFF8E1",
                                              color: "#8D6E63",
                                              border:
                                                "1px solid rgba(141,110,99,0.35)",
                                              boxShadow: "none",
                                              "&:hover": {
                                                backgroundColor: "#FFECB3",
                                                boxShadow: "none",
                                              },
                                              "&.Mui-disabled": {
                                                backgroundColor: "#f3f3f3",
                                                color: "#9e9e9e",
                                                borderColor: "#e0e0e0",
                                              },
                                            }}
                                          >
                                            {postingIds[m?.id]
                                              ? "جاري الإرسال..."
                                              : "إرسال الرد"}
                                          </Button>
                                        </Box>
                                      </Box>
                                    )}
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


          {/* Mobile Cards */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            {filteredMessages.map((m) => {
              const chip = statusChipProps(m);
              const { isReplied, replyText } = getReplyState(m);
              const expanded = expandedId === m?.id;


              return (
                <Card
                  key={m?.id}
                  sx={{ mb: 2, borderRadius: 3, overflow: "hidden" }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 1,
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 900, fontSize: 14 }}>
                          {m?.fullName || "-"}
                        </Typography>
                        <Typography
                          sx={{ fontSize: 13, opacity: 0.85, mt: 0.5 }}
                        >
                          الموضوع: {m?.subject || "-"}
                        </Typography>
                      </Box>


                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "end",
                          gap: 1,
                        }}
                      >
                        <Chip
                          size="small"
                          color={chip.color}
                          label={chip.label}
                        />
                        <IconButton onClick={() => toggleExpand(m?.id)}>
                          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                    </Box>


                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                      <Divider sx={{ my: 2 }} />


                      <Typography sx={{ fontWeight: 900, mb: 1 }}>
                        تفاصيل الرسالة
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap", mb: 2 }}
                      >
                        {m?.message || "-"}
                      </Typography>


                      <Typography sx={{ fontWeight: 900, mb: 1 }}>
                        رد الإدارة
                      </Typography>


                      {isReplied ? (
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "#f5f5f5",
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace: "pre-wrap",
                              textAlign: "right",
                            }}
                          >
                            {replyText || "تم الرد (لا يوجد نص رد)"}
                          </Typography>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                          }}
                        >
                          <TextField
                            label="اكتب رد الإدارة"
                            multiline
                            minRows={3}
                            value={replyInputs[m?.id] || ""}
                            onChange={(e) =>
                              handleReplyChange(m?.id, e.target.value)
                            }
                            fullWidth
                          />
                          <Button
                            variant="contained"
                            onClick={() => handleSendReply(m?.id)}
                            disabled={!!postingIds[m?.id]}
                          >
                            {postingIds[m?.id]
                              ? "جاري الإرسال..."
                              : "إرسال الرد"}
                          </Button>
                        </Box>
                      )}
                    </Collapse>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </>
      )}


      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}



