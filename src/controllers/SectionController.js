
const Section = require("../models/SectionModel");
const { successResponse } = require("../utils/responseHandler");
const createError = require("http-errors");

/**
 * @Create new section for user
 * @POST => /api/section
*/
const createNewSection = async (req, res, next) => {
    try {
         const authUser = req.user;
         // Check authenticated user
         if(!authUser?.id) throw createError(401, "Unauthorized access");

        const body = req.body;
        const section = (await Section.create({...body})).populate('products');
         return successResponse(res, {
            message: "Success",
            statusCode:201,
            payload: section,
        })
    } catch (error) {
        next(error);
    }
}

/**
 * All section for authenticated user
 * @GET => /api/section
 * @params accessBy='admin' | 'user'
*/
const getAllSections = async (req, res, next) => {

    try {
        const accessBy = req.query?.accessBy || 'user';

        const query = {
            status: accessBy === 'admin' ? { $in: [true, false] } : true
        };
        const sections = await Section.find(query).populate('products').sort({createdAt:-1});
        return successResponse(res, {
            message: "Success",
            statusCode:200,
            payload: {sections},
        })
    } catch (error) {
        next(error);
    }
}


/**
 * @ Update section for authenticated user
 * @patch => /api/section/:{SectionId}
*/
const updateSectionBySectionId = async (req, res, next) => {
    try {
         const authUser = req.user;
         const sectionId = req.params?.sectionId;
         // Check authenticated user
         if(!authUser?.id) throw createError(401, "Unauthorized access");

       
        const body = req.body;
        const section = await Section.findByIdAndUpdate(sectionId, {...body}, { new:true, runValidators:true });
         return successResponse(res, {
            message: "Success",
            statusCode:200,
            payload: section,
        })
    } catch (error) {
        next(error);
    }
}

/**
 * @ delete section for authenticated user
 * @delete => /api/section/:{sectionId}
*/
const deleteSectionByUserId = async (req, res, next) => {
    try {
         const authUser = req.user;
         const sectionId = req.params?.sectionId;
         // Check authenticated user
         if(!authUser?.id) throw createError(401, "Unauthorized access");

        
        const section = await Section.findByIdAndDelete(sectionId);
         return successResponse(res, {
            message: "Success",
            statusCode:200,
            payload: section,
        })
    } catch (error) {
        next(error);
    }
}



module.exports = {
    createNewSection,
    getAllSections,
    updateSectionBySectionId,
    deleteSectionByUserId,
}