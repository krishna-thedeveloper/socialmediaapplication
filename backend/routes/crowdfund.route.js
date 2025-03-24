import express from "express";
import { createCrowdfund, getCrowdfunds,getCrowdfund, getCrowdfundById, donateToCrowdfund, verifyPayment, deleteCrowdfund, getFollowingCrowdfundingPosts } from "../controllers/crowdfund.controller.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/",upload.single("image"), createCrowdfund);
router.get("/all", getCrowdfunds);
router.get("/following", getFollowingCrowdfundingPosts);
router.get("/user/:id", getCrowdfund);
router.get("/:id", getCrowdfundById);
router.post("/donate/:id", donateToCrowdfund);
router.post("/verify", verifyPayment);
router.delete('/:campaignId', deleteCrowdfund);
export default router;
