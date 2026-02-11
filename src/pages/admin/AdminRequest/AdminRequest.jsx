import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  Paper,
} from "@mui/material";
import AxiosUserInstance from "../../../api/AxiosUserInstance";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

export default function AdminRequest() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editingUserId, setEditingUserId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await AxiosUserInstance.get("/Admin/User", {
        params: { status: "Pending" },
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "فشل جلب الطلبات",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
  try {
    await AxiosUserInstance.patch(`/Admin/User/change-status/${id}`, null, {
      params: { status: newStatus },
    });

    setSnackbar({
      open: true,
      message: newStatus === "Active" ? "تم القبول" : "تم الرفض",
      severity: newStatus === "Active" ? "success" : "error",
    });

    fetchUsers();
  } catch (err) {
    console.error(err);
    setSnackbar({
      open: true,
      message: "فشل تعديل الحالة",
      severity: "error",
    });
  }
};


  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* لوحة طلبات الإضافة */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 5,
          background:
            "linear-gradient(135deg,rgb(106,106,87),rgb(160,160,120))",
          color: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", fontSize: { xs: 18, md: 28 } }}
              >
                طلبات الإضافة
              </Typography>

              <PersonAddAlt1Icon
                sx={{ fontSize: { xs: 26, md: 34 }, color: "#fff" }}
              />
            </Box>

            <Typography
              sx={{
                opacity: 0.9,
                mt: { xs: 1, md: 2 },
                fontSize: { xs: 12, md: 16 },
              }}
            >
              راجع الطلبات ووافق عليها أو ارفضها بكل سهولة
            </Typography>
          </Box>

          <Box
            sx={{
              width: { xs: 50, md: 70 },
              height: { xs: 50, md: 70 },
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PendingActionsIcon
              sx={{ fontSize: { xs: 28, md: 40 }, color: "#fff" }}
            />
          </Box>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
         {/* ====== Desktop Table ====== */}
<Box sx={{ display: { xs: "none", md: "block" } }}>
  <Card component={Paper} sx={{ borderRadius: 3, overflow: "hidden" }}>
    <CardContent sx={{ p: 0 }}>
      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 450, direction: "rtl" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                الاسم
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                الدور
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                الإجراءات
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell align="center">{user.fullName}</TableCell>
                  <TableCell align="center">{user.roleUser}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: { xs: 11, md: 13 },
                          backgroundColor: "#63a867",
                          boxShadow: "none",
                          "&:hover": { backgroundColor: "#256427" },
                        }}
                        onClick={() => handleStatusChange(user.id, "Active")}
                      >
                        قبول
                      </Button>

                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: { xs: 11, md: 13 },
                          boxShadow: "none",
                        }}
                        onClick={() => handleStatusChange(user.id, "InActive")}
                      >
                        رفض
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  لا توجد بيانات
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </CardContent>
  </Card>
</Box>

{/* ====== Mobile Cards ====== */}
<Box sx={{ display: { xs: "block", md: "none" } }}>
  {users.length > 0 ? (
    users.map((user) => (
      <Card
        key={user.id}
        sx={{
          mb: 2,
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Typography sx={{ fontWeight: 900, fontSize: 15 }}>
            الاسم : {user.fullName}
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 15, fontWeight: 700, color: "#4b4b3f" }}>
            الدور : {user.roleUser}
          </Typography>

          <Box sx={{ mt: 1.5, display: "flex", gap: 1 }}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 900,
                backgroundColor: "#417d44",
                boxShadow: "none",
                "&:hover": { backgroundColor: "#256427" },
              }}
              onClick={() => handleStatusChange(user.id, "Active")}
            >
              قبول
            </Button>

            <Button
              fullWidth
              variant="contained"
              color="error"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 900,
                boxShadow: "none",
              }}
              onClick={() => handleStatusChange(user.id, "InActive")}
            >
              رفض
            </Button>
          </Box>
        </CardContent>
      </Card>
    ))
  ) : (
    <Typography align="center">لا توجد بيانات</Typography>
  )}
</Box>


         
        </>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}