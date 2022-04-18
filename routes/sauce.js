const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const uploadImg = require("../middleware/multer-config");
const saucesCtrl = require("../controllers/sauces");

router.get("/", verifyToken, saucesCtrl.allSauces);
router.post("/", uploadImg, verifyToken, saucesCtrl.addSauce);
router.get("/:id", verifyToken, saucesCtrl.oneSauce);
router.delete("/:id", verifyToken, saucesCtrl.deleteSauce);
router.put("/:id", uploadImg, verifyToken, saucesCtrl.modifySauce);
router.post("/:id/like", verifyToken, saucesCtrl.likeSauce);

module.exports = router;
