"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackage = void 0;
exports.createPackage = createPackage;
exports.getPackages = getPackages;
exports.updatePackage = updatePackage;
exports.deletePackages = deletePackages;
exports.getPackageById = getPackageById;
const packages_model_1 = require("../models/packages-model");
const global_error_1 = require("../middleware/global-error");
const helper_1 = require("../utility/helper");
async function createPackage(req, res, next) {
    const { accommondation, base_price, end_date, from, posted_by, start_date, to, package_name, } = req.body;
    try {
        const result = await packages_model_1.PACKAGESCHEMA.create({
            accommondation,
            base_price,
            end_date,
            from,
            posted_by,
            start_date,
            to,
            package_name,
        });
        if (!result) {
            throw new global_error_1.CustomError("Something wrong!", 400);
        }
        const response = {
            message: "Packages created successfully.",
            statuscode: 201,
            success: true,
            responses: result,
        };
        res.status(response.statuscode).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function getPackages(req, res, next) {
    const query = {};
    const pipeline = [];
    const { search, status, page = 1, limit = 10 } = req.query;
    try {
        const pageNumber = parseInt(page, 10);
        const pageLimit = parseInt(limit, 10);
        const currentDate = new Date();
        // If a search term is provided, add the search condition
        if (search) {
            query.$or = [
                { package_name: { $regex: new RegExp(search, "i") } },
            ];
        }
        // Apply filtering based on status (date logic)
        if (status) {
            if (status === "Completed") {
                // Completed: End Date < Today
                query.end_date = { $lt: currentDate };
            }
            else if (status === "Active") {
                // Active: Start Date ≤ Today AND End Date ≥ Today
                query.start_date = { $lte: currentDate };
                query.end_date = { $gte: currentDate };
            }
            else if (status === "Upcoming") {
                // Upcoming: Start Date > Today
                query.start_date = { $gt: currentDate };
            }
        }
        // If there are filtering conditions, add the match stage
        if (Object.keys(query).length > 0) {
            pipeline.push({ $match: query });
        }
        // Sort stage - sorting by start_date in ascending order
        pipeline.push({ $sort: { start_date: 1 } });
        // Pagination stages
        pipeline.push({ $skip: (pageNumber - 1) * pageLimit }, { $limit: pageLimit });
        pipeline.push({
            $lookup: {
                from: "users",
                localField: "posted_by",
                foreignField: "_id",
                as: "posterDetails",
            },
        }, {
            $unwind: {
                path: "$posterDetails",
                preserveNullAndEmptyArrays: true,
            },
        }, {
            $lookup: {
                from: "users",
                localField: "booking_ids",
                foreignField: "_id",
                as: "bookedUsers",
            },
        }, {
            $project: {
                package_name: 1,
                from: 1,
                to: 1,
                start_date: 1,
                end_date: 1,
                price: 1,
                posterDetails: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    profile: 1,
                },
                bookedUsers: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    profile: 1,
                },
            },
        });
        const response = await packages_model_1.PACKAGESCHEMA.aggregate(pipeline);
        const count = await packages_model_1.PACKAGESCHEMA.countDocuments(query);
        const result = {
            message: "Successfully fetched.",
            statuscode: 200,
            success: true,
            responses: response,
            pagination: {
                limit: pageLimit,
                page: pageNumber,
                totalCount: count,
            },
        };
        res.status(result.statuscode).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function updatePackage(req, res, next) {
    try {
        const { id } = req.params;
        const findPack = await packages_model_1.PACKAGESCHEMA.findById(id);
        if (!findPack) {
            throw new global_error_1.CustomError("Package not found.", 404);
        }
        const response = await packages_model_1.PACKAGESCHEMA.findByIdAndUpdate(id, {
            ...req.body,
        }, { new: true });
        if (!response) {
            throw new global_error_1.CustomError("Package not updated, please try again later", 400);
        }
        const result = {
            message: "Package updated successfully",
            statuscode: 200,
            success: true,
            responses: response,
        };
        res.status(result.statuscode).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function deletePackages(req, res, next) {
    try {
        const { id } = req.params;
        const findPack = await packages_model_1.PACKAGESCHEMA.findById(id);
        if (!findPack) {
            throw new global_error_1.CustomError("Package not found.", 404);
        }
        const response = await packages_model_1.PACKAGESCHEMA.findByIdAndDelete(id);
        if (!response) {
            throw new global_error_1.CustomError("Package not deleted, please try again later", 400);
        }
        const result = {
            message: "Package deleted successfully",
            statuscode: 200,
            success: true,
        };
        res.status(result.statuscode).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function getPackageById(req, res, next) {
    try {
        const { id } = req.params;
        const findPackage = await packages_model_1.PACKAGESCHEMA.findById(id).populate({
            path: "booking_ids posted_by",
            select: "-__v -password -isVerifyed -user_type -googleId",
        });
        if (!findPackage) {
            throw new global_error_1.CustomError("Opps! data not found.", 400);
        }
        const response = {
            message: "Successfully fetched package.",
            statuscode: 200,
            success: true,
            responses: findPackage,
        };
        res.status(response.statuscode).json(response);
    }
    catch (error) {
        next(error);
    }
}
exports.getPackage = (0, helper_1.catchAsync)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const findPackage = await packages_model_1.PACKAGESCHEMA.findById(id).populate({
            path: "booking_ids posted_by",
            select: "-__v -password -isVerifyed -user_type -googleId",
        });
        if (!findPackage) {
            throw new global_error_1.CustomError("Opps! data not found.", 400);
        }
        const response = {
            message: "Successfully fetched package.",
            statuscode: 200,
            success: true,
            responses: findPackage,
        };
        res.status(response.statuscode).json(response);
    }
    catch (error) {
        next(error);
    }
});
