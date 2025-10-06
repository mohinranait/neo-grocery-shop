const { createDeal, getAllDeals, updateDealById } = require("../controllers/DealProductController");
const { isAuth } = require("../middleware/isAuth");

const dealRoute = require("express").Router();


dealRoute.post(`/deal`, isAuth, createDeal);
dealRoute.get(`/deals`, getAllDeals );
dealRoute.patch("/deal/:dealId",isAuth, updateDealById)


module.exports = dealRoute