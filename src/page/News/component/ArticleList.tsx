import React from "react";
import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";

const Article = () => {
  return (
    <Stack flexDirection="row" py="12px" columnGap="12px">
      <Box
        sx={{
          width: "88px",
          height: "88px",
          borderRadius: "4px",
          bgcolor: "#D0D5DD",
          flexShrink: 0,
        }}
      />
      <Stack columnGap="12px" flex={1}>
        <Typography fontSize="12px" color="#667085">
          {`自由時報 ・ 今天, 13:02`}
        </Typography>
        <Typography
          fontSize="18px"
          fontWeight={600}
          color="#000"
          my="2px"
          className="overflowText"
        >
          挖走台積電客戶？英特爾搶到4客戶代工訂單
        </Typography>
        <Typography
          className="lineClamp2"
          fontSize="12px"
          color="#000"
          lineHeight="20px"
        >
          為了進軍代工業務，英特爾主打先進18A製程（相當於台積電2奈米）搶商機。執行長季辛格（Pat
          Gelsinger）透露，18A已取得3家忠實客戶的代工訂單，今年年底還要跟1家客戶簽約，其中「1家非常重
        </Typography>
      </Stack>
    </Stack>
  );
};

export default function ArticleList() {
  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "#fff",
        borderRadius: "8px",
      }}
    >
      <Article />
      <Divider />
      <Article />
      <Divider />
      <Article />
      <Divider />
      <Article />
      <Divider />
    </Box>
  );
}
