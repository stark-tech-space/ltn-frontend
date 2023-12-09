import React from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

const BlockNews = () => {
  return (
    <Box display="flex" columnGap={{ xs: 2, md: "20px" }} py={2}>
      <Avatar sx={{ width: "56px", height: "56px", flexShrink: 0 }} />
      <Stack flex={1}>
        <Typography
          fontSize={{ xs: "16px", md: "20px", lg: "20px" }}
          fontWeight={600}
          lineHeight={1.35}
        >
          洞見分析標題洞見分析標題洞見分析標題洞見分析標題洞見分析標題
        </Typography>
        <Typography
          className="lineClamp2"
          fontSize="14px"
          fontWeight={400}
          lineHeight="22px"
          my={1}
        >
          文章內容文章內容文章內容文章內容文章內容文章內容文章內容文章內容文章內容文章內容文章內容文章內容文章內容文章內容文章內容文章內容文章內容文章內容
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography fontSize="14px" color="#667085">
            {` 作家 ・ 2023-10-25, 13:02`}
          </Typography>
          <Stack flexDirection="row" alignItems="center" columnGap={2}>
            <Box display="flex" alignItems="center">
              <IconButton>
                <ChatBubbleOutlineOutlinedIcon
                  htmlColor="#344054"
                  fontSize="small"
                />
              </IconButton>
              <Typography fontSize="14px">34</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton>
                <ThumbUpAltOutlinedIcon htmlColor="#344054" fontSize="small" />
              </IconButton>
              <Typography fontSize="14px">34</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton>
                <FavoriteBorderOutlinedIcon
                  htmlColor="#344054"
                  fontSize="small"
                />
              </IconButton>
              <Typography fontSize="14px">34</Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default function BlockNewsList() {
  return (
    <Stack
      bgcolor="#fff"
      p={{ xs: 2, md: 3, lg: 3 }}
      borderRadius={{ xs: 0, md: "8px", lg: "8px" }}
    >
      <BlockNews />
      <Divider />
      <BlockNews />
      <Divider />
      <BlockNews />
      <Divider />
    </Stack>
  );
}
