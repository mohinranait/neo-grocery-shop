const Category = require("../models/CategoryModel");
const createError = require("http-errors");
const { generateSlug } = require("../utils/helpers");
const { successResponse } = require("../utils/responseHandler");
const Product = require("../models/ProductModel");
/**
 * @api {get} /categories Get all categories
*/
const getAllCategories = async (req, res, next) => {
    try {
        
        // Step 1: Get all categories
        const categories = await Category.find();

        // Step 2: Aggregate product counts per category
        const categoryCounts = await Product.aggregate([
        { $unwind: "$category" },
        { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        // Step 3: Convert count array to object for easy lookup
        const countMap = categoryCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
        }, {} );

        // Step 4: Merge category data with product count
        const categoriesWithCounts = categories.map((category) => ({
        ...category.toObject(),
        productCount: countMap[category._id.toString()] || 0,
        }));


        return successResponse(res, {
            message: "Success",
            payload:categoriesWithCounts,
            statusCode:200
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @api {get} /category/:id Get category by ID
*/
const getCategoryById = async (req, res, next) => {
    try {
        let categoryId = req.params?.id;

        const category = await Category.findById(categoryId); 
        if(!category) throw createError(404, "Category not-found");
        return successResponse(res, {
            message: "Success",
            payload:category,
            statusCode:200
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @api {post} /category Create new category
*/
const createNewCategory = async (req, res, next) => {
    try {
        const authUser = req.user;
        if(authUser.role !== 'Admin' ) throw createError(401, "Unauthorized access");
        const { name, slug, parent, catBanner, catThumbnail, catIcon, status } = req.body;
        const genSlug = generateSlug( slug || name)
        const newCategory = new Category({ name, slug:genSlug, parent, catBanner, catThumbnail, catIcon, status });
        const category = await newCategory.save();
        if(!category) throw createError(500, "Category not created");
        return successResponse(res, {
            message: "Category created successfully",
            payload:category,
            statusCode:200
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @api {patch} /category/:id Update category by ID
*/
const updateCategoryById = async (req, res, next) => {
    try {
        const authUser = req.user;
        if((authUser.role !== 'Admin') && (authUser.role !== 'Manager') ) throw createError(401, "Unauthorized access");
        let categoryId = req.params?.id;
        const { name, slug, parent, catBanner, catThumbnail, catIcon, status } = req.body;  
        const genSlug = generateSlug( slug || name);
        const category = await Category.findByIdAndUpdate(categoryId, { name, slug:genSlug, parent, catBanner, catThumbnail, catIcon, status }, { new:true, runValidators:true }); 
        if(!category) throw createError(500, "Category not updated");
        return successResponse(res, {
            message: "Category updated successfully",
            payload:category,
            statusCode:200
        })       
    } catch (error) {
        next(error)
    }
}

/**
 * @api {delete} /category/:id Delete category by ID
*/
const deleteCategoryById = async (req, res, next) => {
    try {
        const authUser = req.user;
        if(authUser.role !== 'Admin' ) throw createError(401, "Unauthorized access");
        let categoryId = req.params?.id;
        const category = await Category.findByIdAndDelete(categoryId);
        if(!category) throw createError(500, "Category not deleted");

        // Update all categories with this parentId to null
        await Category.updateMany(
            { parentId: categoryId }, 
            { $set: { parentId: null } } 
        );
        return successResponse(res, {
            message: "Category deleted successfully",
            statusCode:200
        })
    } catch (error) {
        next(error)
    }
}



module.exports = {
    getAllCategories,
    getCategoryById,
    createNewCategory,
    updateCategoryById,
    deleteCategoryById
}