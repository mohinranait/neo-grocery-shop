const Product = require("../models/ProductModel");
const { generateSlug } = require("../utils/helpers");
const { successResponse } = require("../utils/responseHandler");
const createError = require("http-errors");

/**
 * @api {post} /product -> Create new product method
*/
const createNewProduct = async (req, res, next) => {

    try {
        const authUser = req.user;
        if((authUser.role !== 'Admin') && (authUser.role !== 'Manager') ) throw createError(401, "Unauthorized access");

        const body = req?.body;        
        const genSlug = generateSlug(body?.slug || body?.name);

        const product = await Product.create({...body, slug: genSlug, author: authUser?.id })
        if(!product) throw createError(500, "Product not created");
        return successResponse(res, {
            message: "Product has been created",
            payload:product,
            statusCode:200
        })   
    } catch (error) {
        next(error)
    }
}

/**
 * @api {get} /products?accessBy=User -> get all products
 * @query {accessBy=[User, Admin,Manager]}
*/
const getAllProducts = async (req, res , next) => {
    try {
        // Find all querys
        const accessBy = req.query?.accessBy || "User";
        const status = req.query?.status || ''; 
        const search = req.query?.search || '';
        const page = parseInt(req.query?.page) || 1;
        const limit = parseInt(req.query?.limit) || 20;
        let sorting = req.query?.sort || 'asc'; // asc, desc
        const sortField = req.query?.sortField || 'name';
        const requestSell = req.query?.request; // Top Sell , Offers
        const features = req.query?.features; 
       
        const firstDate = req.query?.firstDate ? new Date(req.query.firstDate) : null;
        const lastDate = req.query?.lastDate ? new Date(req.query.lastDate) : null;

        const searchText = new RegExp('.*'+search+'.*','i')


        let query = {
            status: "Active"
        }
         

        // Sorting products by asc OR desc
        sorting = sorting === "asc" ? 1 : -1;
       

       // Search Product
        if(search){
            query.$or = [
                { name: {$regex : searchText } },
                { slug: {$regex : searchText } },
                { skuCode: {$regex : searchText } }
            ]
        }

        // features product
        if(requestSell){
            if(requestSell === 'isFeature'){
                query.isFeature = 'Active'
            }else if(requestSell === 'Offers'){
                // TODO This logic is comming soon
                // query['price.discountPrice'] = { $gt : 0}
            }
        }
        

        // features product
        if(features){
            if(features === 'All'){
                query.isFeature = {
                    $in: ['Active',"Inactive"]
                }
            }
            else{
               query.isFeature = features
            }
        }

       
        // Date wish
        if (firstDate && lastDate) {
            query.createdAt = {
                $gte: firstDate,
                $lte: lastDate,
            };
        } else if (firstDate) {
            const nextDay = new Date(firstDate);
            nextDay.setDate(nextDay.getDate() + 1); 
            query.createdAt = {
                $gte: firstDate,
                $lt: nextDay, 
            };
        }

        // Access Products
        if(accessBy === 'Admin' || accessBy === 'Manager'){
            if(!status || status == 'All'){
                query.status = {
                    $in: ['Active',"Inactive"]
                }
            }else{
                query.status = status;
            }
        }else{
            // User can access only Active Products
            query.status = 'Active'
        }
       
        const products = await Product.aggregate([
            { $match: query },
            { $sort: { [sortField]: sorting } },
            { $skip: (page-1) * limit },
            { $limit: limit },
            {
                $lookup: {
                    from: 'comments',
                    let : {pid: "$_id"},
                    pipeline: [
                            { $match: { $expr : { $eq : ["$productId", "$$pid" ] }, isApproved: true } },
                            {
                                $group: {
                                    _id: null,
                                    totalComments: {$sum: 1},
                                    avgRating: { $avg : "$rating"}
                                }
                            }
                    ],
                   as : "commentStats"
                }
            },
            {
                $addFields: {
                    totalComments: { $ifNull: [ { $first : "$commentStats.totalComments" },0] },
                    avgRating: { $ifNull: [ { $first: "$commentStats.avgRating" },0 ] }
                }
            },
            {
                $project: {
                    seo_title: 0,
                    seo_desc: 0,
                    seo_keyword: 0,
                    short_details: 0,
                    details: 0,
                    productFeatures: 0,
                    returnTime: 0,
                    shipping: 0,
                    manageStock: 0,
                    commentStats: 0
                }
            }
        ])

        const total = await Product.find(query).countDocuments();
    
        return successResponse(res, {
            message: "Success",
            statusCode:200,
            payload: {
                products,
                limit,
                total,
            },
        })
    } catch (error) {
        next(error);
    }
}

/**
 * @api {get} /product/:id Get product by ID
*/
const getSingleProductById = async (req, res, next) => {
    try{
        const productId = req.params?.id;
        const product = await Product.findById(productId);
        if(!product) throw createError(500, "Product not updated");
        return successResponse(res, {
            message: "Success",
            statusCode: 200,
            payload:product
        })
    }catch(error){
        next(error)
    }
}
/**
 * @api {get} /product/:slug Get product by ID
*/
const getSingleProductBySlug = async (req, res, next) => {
    try{
        const productSlug = req.params?.slug;
        const product = await Product.findOne({slug:productSlug});
        if(!product) throw createError(500, "Product not updated");
        return successResponse(res, {
            message: "Success",
            statusCode: 200,
            payload:product
        })
    }catch(error){
        next(error)
    }
}

/**
 * @api {patch} /product/:id Update product by ID
*/
const updateProductByID = async (req, res, next) => {
    try {
        const authUser = req.user;
        if((authUser.role !== 'Admin') && (authUser.role !== 'Manager') ) throw createError(401, "Unauthorized access");
        const productId = req.params?.id;
        const body = req?.body;
    
        
        const product = await Product.findByIdAndUpdate(productId, {...body}, {new:true, runValidators:true});
        if(!product) throw createError(500, "Product not updated");
        return successResponse(res, {
            message: "Product has been updated",
            payload:product,
            statusCode:200
        })   
    } catch (error) {
        next(error)
    }
}


/**
 * @api {delete} /product/:id Delete product by ID
*/
const deleteProductById = async (req, res, next) => {
    try {
        const authUser = req.user;
        if((authUser.role !== 'Admin') && (authUser.role !== 'Manager') ) throw createError(401, "Unauthorized access");
        const productId = req.params?.id;
        const product = await Product.findByIdAndDelete(productId);
        if(!product) throw createError(500, "Product not deleted");
        return successResponse(res, {
            message: "Product has been deleted",
            payload:product,
            statusCode:200
        })   
    } catch (error) {
        next(error)
    }
}


/**
 * @api {get} /products?accessBy=User -> get all products
 * @query {accessBy=[User, Admin,Manager]}
*/
const getAllProductsForClient = async (req, res, next) => {
  try {
    // ------------------ QUERY PARAMS ------------------
    const {
      search = "",
      category = "",
      priceRange = "",
      brands = "",
      ratings = "",
      shipping = "",
      stock = "",
      page = 1,
      limit = 20,
      sort = "asc",
      sortField = "name",
      feature = "All",
    } = req.query;

    // ------------------ BUILD MONGO QUERY ------------------
    let query = { 
      status: "Active",
      publish_date: {$lte: new Date()  }
    };

    // SEARCH
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { slug: searchRegex },
        { skuCode: searchRegex },
      ];
    }

    // CATEGORY (multi)
    if (category) {
      query.category = { $in: category.split(",") };
    }

    // BRANDS (multi)
    if (brands) {
      query.brand = { $in: brands.split(",") };
    }

    // SHIPPING (free or paid)
    if (shipping) {
      query.freeShipping = shipping ;
    }
    

    // AVAILABLE STOCK QUANTITY
    if(Boolean(stock)){
      query.isStock = { $gt : 0 } 
    } 
    

    // FEATURES
    if (Boolean(feature)) query.isFeature = "Active";

    // SORT ORDER
    const sortOrder = sort === "asc" ? 1 : -1;

    // ------------------ AGGREGATION PIPELINE ------------------
    const pipeline = [
      { $match: query },

      // ------------------ PRICE CALCULATION ------------------
      {
        $addFields: {
          variableMin: {
            $cond: [
              { $eq: ["$variant", "Variable Product"] },
              {
                $min: {
                  $map: {
                    input: "$variations",
                    as: "v",
                    in: {
                      $cond: [
                        { $gt: ["$$v.offerPrice", 0] },
                        "$$v.offerPrice",
                        "$$v.productPrice",
                      ],
                    },
                  },
                },
              },
              null,
            ],
          },
          variableMax: {
            $cond: [
              { $eq: ["$variant", "Variable Product"] },
              {
                $max: {
                  $map: {
                    input: "$variations",
                    as: "v",
                    in: {
                      $cond: [
                        { $gt: ["$$v.offerPrice", 0] },
                        "$$v.offerPrice",
                        "$$v.productPrice",
                      ],
                    },
                  },
                },
              },
              null,
            ],
          },
          singleFinalPrice: {
            $cond: [
              { $ne: ["$variant", "Variable Product"] },
              {
                $let: {
                  vars: {
                    price: "$price.productPrice",
                    discountValue: "$price.discountValue",
                    discountType: "$price.discountType",
                    start: "$offerDate.start_date",
                    end: "$offerDate.end_date",
                    now: new Date(),
                  },
                  in: {
                    $cond: [
                      { $and: [{ $lte: ["$$start", "$$now"] }, { $gte: ["$$end", "$$now"] }] },
                      {
                        $cond: [
                          { $eq: ["$$discountType", "fixed"] },
                          { $subtract: ["$$price", "$$discountValue"] },
                          {
                            $cond: [
                              { $eq: ["$$discountType", "percent"] },
                              { $subtract: ["$$price", { $multiply: ["$$price", { $divide: ["$$discountValue", 100] }] }] },
                              "$$price",
                            ],
                          },
                        ],
                      },
                      "$$price",
                    ],
                  },
                },
              },
              null,
            ],
          },
          searchPriceMin: { $cond: [{ $eq: ["$variant", "Variable Product"] }, "$variableMin", "$singleFinalPrice"] },
          searchPriceMax: { $cond: [{ $eq: ["$variant", "Variable Product"] }, "$variableMax", "$singleFinalPrice"] },
        },
      },

      // ------------------ PRICE RANGE FILTER ------------------
  ...(priceRange
  ? (() => {
      const [minP, maxP] = priceRange.split(",").map(Number);
      return [
        {
          $match: {
            $or: [
              // Single product price in range
              {
                $and: [
                  { variant: { $ne: "Variable Product" } },
                  { singleFinalPrice: { $gte: minP, $lte: maxP } },
                ],
              },
              // Variable product price range overlap
              {
                $and: [
                  { variant: "Variable Product" },
                  { variableMax: { $gte: minP } },
                  { variableMin: { $lte: maxP } },
                ],
              },
            ],
          },
        },
      ];
    })()
  : []),

      // ------------------ COMMENTS LOOKUP ------------------
      {
        $lookup: {
          from: "comments",
          let: { pid: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$productId", "$$pid"] }, isApproved: true } },
            { $group: { _id: null, totalComments: { $sum: 1 }, avgRating: { $avg: "$rating" } } },
          ],
          as: "commentStats",
        },
      },

      {
        $addFields: {
          totalComments: { $ifNull: [{ $first: "$commentStats.totalComments" }, 0] },
          avgRating: { $ifNull: [{ $round: [{ $first: "$commentStats.avgRating" }, 0] }, 0] },
        },
      },

      // ------------------ RATING FILTER (radio / multi-checkbox) ------------------
         ...(ratings
    ? [{ $match: { avgRating: { $gte: Number(ratings), $lt: Number(ratings) + 1 } } }]
    : []),

      // ------------------ SORT ------------------
      { $sort: { [sortField]: sortOrder } },

      // ------------------ PAGINATION ------------------
      { $skip: (Number(page) - 1) * limit },
      { $limit: Number(limit) },

      // ------------------ REMOVE HEAVY FIELDS ------------------
      {
        $project: {
          seo_title: 0,
          seo_desc: 0,
          seo_keyword: 0,
          details: 0,
          productFeatures: 0,
          short_details: 0,
          commentStats: 0,
        },
      },
    ];

    // ------------------ EXECUTE PIPELINE ------------------
    const products = await Product.aggregate(pipeline);

    // ------------------ COUNT WITHOUT PAGINATION ------------------
    const totalPipeline = pipeline.filter((p) => !("$skip" in p) && !("$limit" in p));
    const total = await Product.aggregate([...totalPipeline, { $count: "total" }]);

    return successResponse(res, {
      message: "Success",
      statusCode: 200,
      payload: {
        products,
        limit,
        total: total[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};





module.exports = {
    createNewProduct,
    getAllProducts,
    getSingleProductById,
    getSingleProductBySlug,
    updateProductByID,
    deleteProductById,
    getAllProductsForClient
}