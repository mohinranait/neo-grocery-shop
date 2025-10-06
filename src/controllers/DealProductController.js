const DealProduct = require("../models/DealProduct");
const { generateSlug } = require("../utils/helpers");
const { successResponse } = require("../utils/responseHandler");
const createError = require("http-errors")

const createDeal = async (req, res,next) => {
    try {
        const body = req.body;
          const genSlug = generateSlug(body?.slug || body?.dealName);
        const deal = await DealProduct.create({...body, slug: genSlug});
        return successResponse(res, {
            message:"Deal create successfull",
            payload: deal,
            statusCode: 201,
        })
    } catch (error) {
        next(error)
    }
}

const updateDealById = async (req, res,next) => {
    try {
        const dealId = req.params?.dealId;
        const body = req.body;
        const deal = await DealProduct.findByIdAndUpdate(dealId, {...body})
        if(!deal) throw createError(404, "Deal not found");
         
        return successResponse(res, {
            message:"Deal update successfull",
            payload: deal,
            statusCode: 200,
        })
    } catch (error) {
        next(error)
    }
}

const getAllDeals = async (req, res,next) => {
    try {
        const accessBy = 'admin'
        const query=  {
            status: true
        }
        const deals = await DealProduct.find( query );
        return successResponse(res, {
            message:"Successfull",
            payload: {
                deals
            },
            statusCode: 200,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
   createDeal,
   getAllDeals,
   updateDealById
};