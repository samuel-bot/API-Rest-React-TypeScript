import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="body2" color="textSecondary">
        @ {new Date().getFullYear()} Admin Usuários
      </Typography>
    </Box>
  );
}
